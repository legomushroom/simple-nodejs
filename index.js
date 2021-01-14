const tunfd = require('tunfd');
const fs = require('fs');

let iface0 = new tunfd.TunInterface({
  // optional, kernel will automatically assign a name if not given here
  name: 'tun0',
  // can be either "tun" or "tap", default is "tun"
  // tun mode gets you ip packets, tap mode gets you ethernet frames
  mode: 'tun',
  // set to true if you want the 4-byte packet information header
  // default is false, which adds IFF_NO_PI to ifr_flags
  pi: false
});

// // if you want to know the auto-assigned name of the interface
// console.log(iface.name);
// // the fd of the new interface
// console.log(iface.fd);

setInterval(() => {}, 100);


let iface1 = new tunfd.TunInterface({
    // optional, kernel will automatically assign a name if not given here
    name: 'tun1',
    // can be either "tun" or "tap", default is "tun"
    // tun mode gets you ip packets, tap mode gets you ethernet frames
    mode: 'tun',
    // set to true if you want the 4-byte packet information header
    // default is false, which adds IFF_NO_PI to ifr_flags
    pi: false
  });


// let writeStream0 = fs.createWriteStream(null, { fd: iface0.fd });
let writeStream1 = fs.createWriteStream(null, { fd: iface1.fd });

// how to get packets
let readStream0 = fs.createReadStream(null, { fd: iface0.fd });
readStream0.on('data', (packet) => {
    console.log(packet);
    writeStream1.write(packet);
});

// let readStream1 = fs.createReadStream(null, { fd: iface1.fd });
// readStream1.on('data', (packet) => {
//     console.log(packet);
//     writeStream0.write(packet);
// });


// // how to put packets
// let writeStream = fs.createWriteStream(null, { fd: iface.fd });
// writeStream.write(...);

// // // fork()
// // console.log(tunfd.fork());