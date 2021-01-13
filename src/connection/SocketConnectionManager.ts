import * as SocketIO from 'socket.io';
import { Trace } from '../utils/createTrace';
import { DisposableClass } from '../utils/DisposableClass';
import { IConnectionOptions } from '../interfaces/IConnectionParams';
import { getConnectionId, getConnectionRoomId } from '../utils/getConnectionRoomId';
import { SocketConnectionRecord } from './SocketConnectionRecord';
import { assert } from '../utils/assert';

export class SocketConnectionManager extends DisposableClass {
    private readonly connections: Map<string, SocketConnectionRecord> = new Map();

    constructor(
        trace: string | Trace
    ) {
        super(trace);
    }

    public connect = (
        socket: SocketIO.Socket,
        options: IConnectionOptions
    ) => {
        const connectionId = getConnectionId(options);

        assert(
            !this.connections.has(connectionId),
            `The ${connectionId} already exists.`
        );

        const record = new SocketConnectionRecord(
            this.trace.childName('record'),
            connectionId,
            getConnectionRoomId(options),
            socket,
            options
        );

        record.onDispose(() => {
            this.connections.delete(record.id);
        });

        this.addToDisposables(
            record,
            record.onDispose(() => {
                this.connections.delete(record.id);
            })
        );

        this.connections.set(connectionId, record);
    };

    public disconnect = (
        options: IConnectionOptions
    ) => {
        const connectionId = getConnectionId(options);
        const record = this.connections.get(connectionId);

        if (!record) {
            this.trace.warn(`requested to disconnect, but no connection "${connectionId}" found`);
            return;
        }

        record.dispose();
    };
};
