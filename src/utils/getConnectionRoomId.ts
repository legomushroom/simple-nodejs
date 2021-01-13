import { IConnectionOptions } from '../interfaces/IConnectionParams';

export const getConnectionRoomId = (
    connectionParams: IConnectionOptions
): string => {
    const { userId, networkId } = connectionParams;

    return `${userId}_${networkId}`;
};

export const getConnectionId = (
    connectionParams: IConnectionOptions
): string => {
    const { address } = connectionParams;

    return `${address}_${getConnectionRoomId(connectionParams)}`;
};
