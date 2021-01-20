#!/bin/bash

#################################
# Set up Ethernet bridge on Linux
# Requires: bridge-utils
#################################

# Define Bridge Interface
br="br0"

# Define list of TAP interfaces to be bridged,
# for example tap="tap0 tap1 tap2".
tap="cs-tap0"

# Define physical ethernet interface to be bridged
# with TAP interface(s) above.
eth="eth0"
eth_ip="172.16.5.4"
eth_netmask="255.255.255.0"
eth_broadcast="172.16.5.255"

echo "adding tap interface \"$tap\""

ip tuntap add mode tap $tap

echo "adding bridge $br"

# add tap interface
# ip addr add $NETWORK_ADDRESS dev $tap
# ip link set $TUN_INTERFACE_NAME up
# route add -net $NETWORK netmask $NETWORK_MASK gw $IP_ADDRESS

# for t in $tap; do
#     openvpn --mktun --dev $t
# done

brctl addbr $br

echo "setting up bridge ip and mask ip: $eth_ip mask: $eth_netmask broadcase:  $eth_broadcast"
ifconfig $br $eth_ip netmask $eth_netmask broadcast $eth_broadcast

echo "adding interface $eth to $br"

brctl addif $br $eth

for t in $tap; do
    echo "adding interface $t to $br"
    brctl addif $br $t
done

for t in $tap; do
    echo "rise the interface $t in promiscous mode"
    ifconfig $t 0.0.0.0 promisc up
done

# echo "rise the interface $t in promiscous mode"
# ifconfig $eth 0.0.0.0 promisc up

