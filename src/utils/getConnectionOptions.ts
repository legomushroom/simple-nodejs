import { IConnectionOptions } from '../interfaces/IConnectionParams';
import { assertDefined } from './assertDefined';

export const getConnectionOptions = (
    searchParams: Partial<IConnectionOptions>,
): IConnectionOptions => {
    const userId = searchParams['userId'];
    assertDefined(userId, 'no user id found');

    const networkId = searchParams['networkId'];
    assertDefined(networkId, 'no network id found');

    const address = searchParams['address'];
    assertDefined(address, 'no address found');

    return {
        userId,
        networkId,
        address,
    };
};
