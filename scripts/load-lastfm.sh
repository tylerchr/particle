#!/bin/bash
for i in `seq 5 223`;
do
	node ./test.js lastfm tyler9xp@gmail.com $i
	sleep 1;
done