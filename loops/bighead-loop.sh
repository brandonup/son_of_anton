#!/bin/bash
# Big Head — runs every 15 minutes, checks Linear, works on assigned KIN tickets
KINETIC_DIR="/Users/brandonupchuch/son_of_anton/projects/kinetic"
LOG="$HOME/son_of_anton/loops/logs/bighead.log"

cd "$KINETIC_DIR"

while true; do
    echo "" >> "$LOG"
    echo "=== $(date '+%Y-%m-%d %H:%M:%S') — Big Head waking ===" | tee -a "$LOG"
    claude --continue \
        --dangerously-skip-permissions \
        -p "You are Big Head. Read agents/bighead.md, agents/bighead-memory.md, and projects/kinetic/MEMORY.md to load your full context. Then check Linear for KIN tickets assigned to you in Todo status. Pick the highest priority and work on it. Security layers active. If nothing is assigned to you, respond with IDLE." \
        2>&1 | tee -a "$LOG"
    echo "=== $(date '+%Y-%m-%d %H:%M:%S') — Big Head sleeping 15min ===" | tee -a "$LOG"
    sleep 900
done
