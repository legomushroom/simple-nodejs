#!/bin/bash

#################################
# Set up Ethernet bridge on Linux
# Requires: bridge-utils
#################################

# Define Bridge Interface
br="docker0"

# Define list of TAP interfaces to be bridged,
# for example tap="tap0 tap1 tap2".
tap="cstap1"

echo "adding tap interface \"$tap\""

ip tuntap add mode tap $tap

# for t in $tap; do
#     echo "adding interface $t to $br"
#     brctl addif $br $t
# done

for t in $tap; do
    echo "rise the interface $t in promiscous mode"
    ifconfig $t 0.0.0.0 promisc up
done
