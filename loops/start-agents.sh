#!/bin/bash
# start-agents.sh — starts all 6 Kinetic agent loops in a tmux session
# Usage: bash ~/son_of_anton/loops/start-agents.sh

LOOPS_DIR="$HOME/son_of_anton/loops"

# Kill existing session if running
tmux kill-session -t kinetic 2>/dev/null

# Create new tmux session with first agent window
tmux new-session -d -s kinetic -n gilfoyle

# Create a window for each agent
tmux new-window -t kinetic -n dinesh
tmux new-window -t kinetic -n bighead
tmux new-window -t kinetic -n jian

# Start each agent loop in its window
tmux send-keys -t kinetic:gilfoyle "bash $LOOPS_DIR/gilfoyle-loop.sh" Enter
tmux send-keys -t kinetic:dinesh   "bash $LOOPS_DIR/dinesh-loop.sh" Enter
tmux send-keys -t kinetic:bighead  "bash $LOOPS_DIR/bighead-loop.sh" Enter
tmux send-keys -t kinetic:jian     "bash $LOOPS_DIR/jian-loop.sh" Enter

echo ""
echo "4 agents started in tmux session 'kinetic'."
echo ""
echo "To watch them:  tmux attach -t kinetic"
echo "To switch tabs: Ctrl+B then 0-3 (gilfoyle=0, dinesh=1, bighead=2, jian=3)"
echo "To leave:       Ctrl+B then D  (agents keep running)"
echo "To stop all:    tmux kill-session -t kinetic"
