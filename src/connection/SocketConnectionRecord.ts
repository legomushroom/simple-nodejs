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

        socket.on('event', this.onEvent);
        socket.on('disconnect', this.dispose.bind(this));
    }

    private onEvent = (data: any) => {
        if (this.isDisposed) {
            this.trace.warn('data received but the connection record is disposed', this.options);
        }

        this.trace.verbose(`data received, broadcasting to the room "${this.roomId}"`);

        this.socket.to(this.roomId).emit(data);
    };

    public dispose(reason?: string) {
        this.trace.verbose(`disposing connection record "", reason: "${reason}"`, this.options);

        this.socket.off('event', this.onEvent);

        super.dispose();
        this.socket.leave(this.roomId);
        this.socket.disconnect(true);

        return this;
    }
}
;
