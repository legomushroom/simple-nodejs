import * as SocketIO from 'socket.io';

import { DisposableClass } from '../utils/DisposableClass';
import { IConnectionOptions } from '../interfaces/IConnectionParams';

export class SocketConnectionRecord extends DisposableClass {
    constructor(
        trace: string,
        public readonly id: string,
        public readonly roomId: string,
        public readonly socket: SocketIO.Socket,
        private readonly options: IConnectionOptions
    ) {
        super(`${trace}:${socket.id}`);

        this.trace.info(`creating connection for socket in room "${roomId}"`);

        socket.join(roomId);

        socket.on('message', this.onMessage);
        socket.on('disconnect', this.dispose.bind(this));
    }

    private onMessage = (data: any) => {
        this.trace.info(`on message: ${typeof data}`, data);

        if (this.isDisposed) {
            this.trace.warn('data received but the connection record is disposed', this.options);
        }

        this.trace.verbose(`data received (${typeof data}), broadcasting to the room "${this.roomId}"`);

        this.socket.to(this.roomId).emit('message', data);
    };

    public dispose(reason?: string) {
        this.trace.verbose(`disposing connection record "${this.id}", reason: "${reason}"`, this.options);

        this.socket.off('event', this.onMessage);

        super.dispose();
        this.socket.leave(this.roomId);
        this.socket.disconnect(true);

        return this;
    }
}
;
