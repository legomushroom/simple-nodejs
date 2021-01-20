const tunfd = require('tunfd');
const fs = require('fs');
const io = require('socket.io-client');

const SOCKET_SERVER_URL = 'wss://85f65e79a16a.ngrok.io';
const TUN_NUMBER = 0;

const iface = new tunfd.TunInterface({
  // optional, kernel will automatically assign a name if not given here
  name: `cstap1`,
  // can be either "tun" or "tap", default is "tun"
  // tun mode gets you ip packets, tap mode gets you ethernet frames
  mode: 'tap',
  // set to true if you want the 4-byte packet information header
  // default is false, which adds IFF_NO_PI to ifr_flags
  pi: false,
});

console.log('starting the connection');
try {
    const socket = io(`${SOCKET_SERVER_URL}/tap-rooms?userId=uid&networkId=nid&address=2`);
    socket.binaryType = 'arraybuffer';
    socket.on('connect', () => {
        console.log('>> connect');

        const readStream = fs.createReadStream(null, { fd: iface.fd });
        const writeStream = fs.createWriteStream(null, { fd: iface.fd });

        readStream.on('data', (packet) => {
            console.log(`>> data from tun interface: ${typeof packet}`, packet);
            socket.send(packet);
        });

        socket.on('message', (data) => {
            console.log(`>> data from socket: ${typeof data}`, data);
            writeStream.write(data);
        });

        socket.on('disconnect', (data) => {
            console.log('>> disconnect');
        });
    });
} catch (e) {
    trace.error(e);
}

// prevent nodejs from stopping
setInterval(() => {}, 100);
