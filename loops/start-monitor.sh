#!/bin/bash
# start-monitor.sh — 4-pane view of all agent logs
# Usage: bash ~/son_of_anton/loops/start-monitor.sh

tmux kill-session -t monitor 2>/dev/null

tmux new-session -d -s monitor -x 220 -y 50

# Split into 4 panes
tmux split-window -h -t monitor
tmux split-window -v -t monitor:0.0
tmux split-window -v -t monitor:0.1

# Stream each agent's log in a pane
tmux send-keys -t monitor:0.0 "echo 'GILFOYLE' && tail -f ~/son_of_anton/loops/logs/gilfoyle.log" Enter
tmux send-keys -t monitor:0.1 "echo 'BIGHEAD'  && tail -f ~/son_of_anton/loops/logs/bighead.log" Enter
tmux send-keys -t monitor:0.2 "echo 'DINESH'   && tail -f ~/son_of_anton/loops/logs/dinesh.log" Enter
tmux send-keys -t monitor:0.3 "echo 'JIAN'     && tail -f ~/son_of_anton/loops/logs/jian.log" Enter

tmux attach -t monitor
