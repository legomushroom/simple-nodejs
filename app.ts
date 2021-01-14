import * as SocketIO from 'socket.io';
import { getConnectionOptions } from './src/utils/getConnectionOptions';
import { SocketConnectionManager } from './src/connection/SocketConnectionManager';
import { createTrace } from './src/utils/createTrace';

const trace = createTrace('app');

const SOCKET_PORT = 3000;
const connectionManager = new SocketConnectionManager('connection-manager');

const server = new SocketIO.Server();
server
    .of('/tap-rooms')
    .on('connection', (socket: SocketIO.Socket) => {
        const { handshake } = socket;

        trace.info('someone connected', handshake.url);

        try {
            connectionManager.connect(
                socket,
                getConnectionOptions(handshake.query),
            );
        } catch (e) {
            trace.error(e);
            socket.disconnect(true);
        }
    })

server.listen(SOCKET_PORT);

// const SOCKET_SERVER_URL = 'wss://85e9e5b54f61.ngrok.io';

// import io from 'socket.io-client';

// setTimeout(() => {
//     trace.info('starting the connection');
//     try {
//         const socket = io(`${SOCKET_SERVER_URL}/tap-rooms?userId=uid&networkId=nid&address=10.0.0.1`);
//     } catch (e) {
//         trace.error(e);
//     }
// }, 2000);
