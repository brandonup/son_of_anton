# Security — Dinesh Dev Container

OS-level isolation layer for Claude Code CLI sessions in Bypass Permissions Mode.

> **Note:** Brandon uses Claude Code through the desktop app, not the CLI. This container is used for headless or automated CLI runs only. For daily app-based sessions, the active security layers are `.claude/settings.json` (sandbox + deny rules) and the `CLAUDE.md` behavioral guardrails.

---

## Quick Start (CLI sessions)

```bash
# 1. Build the container (one-time, or after Dockerfile changes)
docker compose build

# 2. Start the container
docker compose up -d

# 3. Authenticate (first time only — uses your Claude subscription, no API key needed)
docker compose exec dinesh-dev claude auth login

# 4. Start coding
docker compose exec dinesh-dev claude --dangerously-skip-permissions

# 5. When done
docker compose down
```

> Auth credentials persist as long as the container exists. After `docker compose down` + `up`, re-run `claude auth login` once.

---

## What the Container Adds (Beyond settings.json)

The container provides controls that settings.json alone cannot enforce when running on the host:

| Control | How |
|---|---|
| iptables network allowlist | `entrypoint.sh` blocks all outbound except approved domains before dropping to `dinesh` user |
| Host credential isolation | `~/.ssh`, `~/.aws`, browser profiles are not mounted — they don't exist inside the container |
| Read-only root filesystem | `read_only: true` prevents modification of system binaries |
| Non-root user | All commands run as unprivileged `dinesh` |
| No privilege escalation | `no-new-privileges:true` blocks sudo/setuid exploits |
| Immutable security config | `settings.json` and `CLAUDE.md` mounted read-only — container cannot modify its own guardrails |

---

## Security Gaps

- **Supply chain attacks**: `--ignore-scripts` is enforced on all npm installs — postinstall scripts cannot run. Residual risk: malicious code baked into the package itself (not a postinstall hook). Mitigate with lockfiles, `npm audit`, and `pip-audit`.
- **Network exfiltration via allowed domains**: The iptables rules allow outbound to approved domains only. Malicious code could attempt to exfiltrate data through those channels (e.g., encoding data in a registry request). This is a narrow, high-effort vector.
- **Container escape**: Docker is not a perfect sandbox. A kernel exploit could break out. Keep Docker Desktop and macOS updated.

---

## Updating Allowed Commands

Allowed and denied commands are controlled in `../.claude/settings.json`, not in the container. To modify, edit that file.

## Network Allowlist

The entrypoint applies these iptables rules before the Claude session starts:

| Domain | Purpose |
|---|---|
| `api.anthropic.com`, `statsig.anthropic.com` | Claude API |
| `registry.npmjs.org`, `registry.yarnpkg.com` | npm packages |
| `pypi.org`, `files.pythonhosted.org` | Python packages |
| `github.com`, `raw.githubusercontent.com`, `objects.githubusercontent.com` | Source control |

All other outbound traffic is dropped.
