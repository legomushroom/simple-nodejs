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

        console.log('someone connected', handshake.url);

        try {
            connectionManager.connect(
                socket,
                getConnectionOptions(handshake.query),
            );
        } catch (e) {
            trace.error(e);
            socket.disconnect(true);
        }
    });

    server.listen(SOCKET_PORT);

// client for tests
import io from 'socket.io-client';
const socket = io(`ws://localhost:${SOCKET_PORT}/tap-rooms?userId=uid&networkId=nid&address=10.0.0.1`);
