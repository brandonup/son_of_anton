#!/bin/bash
set -euo pipefail

# Auto-export audit log before container stops
export_audit() {
  if [ -f /tmp/claude-audit.jsonl ] && [ -d /home/dinesh/audit-export ]; then
    cp /tmp/claude-audit.jsonl "/home/dinesh/audit-export/$(date +%Y%m%d-%H%M%S).jsonl" 2>/dev/null || true
    echo "Audit log exported to /home/dinesh/audit-export/"
  fi
}
trap export_audit SIGTERM SIGINT EXIT

# Network allowlist — block all outbound except approved domains
iptables -A OUTPUT -o lo -j ACCEPT
iptables -A OUTPUT -p udp --dport 53 -j ACCEPT
iptables -A OUTPUT -p tcp --dport 53 -j ACCEPT
iptables -A OUTPUT -d api.anthropic.com -j ACCEPT
iptables -A OUTPUT -d statsig.anthropic.com -j ACCEPT
iptables -A OUTPUT -d registry.npmjs.org -j ACCEPT
iptables -A OUTPUT -d registry.yarnpkg.com -j ACCEPT
iptables -A OUTPUT -d pypi.org -j ACCEPT
iptables -A OUTPUT -d files.pythonhosted.org -j ACCEPT
iptables -A OUTPUT -d github.com -j ACCEPT
iptables -A OUTPUT -d raw.githubusercontent.com -j ACCEPT
iptables -A OUTPUT -d objects.githubusercontent.com -j ACCEPT
iptables -A OUTPUT -j DROP

# Drop to non-root user and exec the provided command
exec su - dinesh -c "cd /home/dinesh/workspace && $*"
