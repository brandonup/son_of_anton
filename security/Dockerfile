# Son of Anton — Dinesh Dev Container
# OS-level isolation for Claude Code sessions in Bypass Permissions Mode.
# Run via: docker compose up -d (from this directory)

FROM node:20-slim

RUN apt-get update && apt-get install -y \
    git python3 python3-pip python3-venv python3-dev \
    build-essential iptables \
    && rm -rf /var/lib/apt/lists/*

# Install Claude Code globally
RUN npm install -g @anthropic-ai/claude-code

# Create non-root user — Dinesh runs without elevated privileges
RUN useradd -m -s /bin/bash dinesh && \
    mkdir -p /home/dinesh/workspace /home/dinesh/.claude && \
    chown -R dinesh:dinesh /home/dinesh

# Copy network allowlist entrypoint (runs as root, then drops to dinesh)
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Note: no USER dinesh here — entrypoint.sh starts as root (for iptables),
# then drops privileges to dinesh before running any user commands

WORKDIR /home/dinesh/workspace

# Ensure pip user installs go somewhere writable
ENV PATH="/home/dinesh/.local/bin:$PATH"
ENV PYTHONPATH="/home/dinesh/workspace"

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["/bin/bash"]
