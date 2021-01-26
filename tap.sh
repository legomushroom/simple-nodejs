#!/bin/bash

NETWORK='10.0.0.0'
IP_ADDRESS='10.0.0.1'
IP_BROADCAST='10.0.0.255'
NETWORK_MASK='255.255.255.0'
NETWORK_ADDRESS="$IP_ADDRESS/24"

TAP_NAME='cstap0'
BRIDGE_NAME='cs-bridge-0'

echo -e "\nadding bridge $BRIDGE_NAME"

brctl addbr $BRIDGE_NAME

ifconfig

echo -e "\nsetting up bridge ip and mask ip: $IP_ADDRESS mask: $NETWORK_MASK broadcase:  $eth_broadcast"
ifconfig $BRIDGE_NAME $IP_ADDRESS netmask $NETWORK_MASK broadcast $IP_BROADCAST

ifconfig

echo -e "\nadding tap interface \"$TAP_NAME\""

ip tuntap add mode tap $TAP_NAME
ifconfig

echo -e "\nadding tap to bridge"

ip link set $TAP_NAME up

brctl addif $BRIDGE_NAME $TAP_NAME

echo -e "\n ok"

# ip addr add $NETWORK_ADDRESS dev $TUN_INTERFACE_NAME
route add -net $NETWORK netmask $NETWORK_MASK gw $IP_ADDRESS