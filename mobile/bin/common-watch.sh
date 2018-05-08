#!/bin/sh

pidfile=./file-watch.pid

if [[ $1 ]]; then
    rm $pidfile
fi

# If the pid file exists we must already be running
if ! ln -s "pid=$$" "$pidfile"; then
  echo "Already running. Exiting." >&2
  exit 0
fi

 # remove pid if we exit normally or are terminated
  trap "rm -f $pidfile" 0 1 3 15
  npm install -g wml
  watchman watch ../../common
  wml add ../../common ../common-mobile
  wml start