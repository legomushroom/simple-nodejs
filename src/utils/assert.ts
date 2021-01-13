import { AssertionError } from '../errors/AssertionError';

type TAssertionType = (val: boolean, errorMessage: string | Error) => asserts val is true;

/**
 * Assert that the expression that results in `val` holds, otherwise throw
 * an `AssertionError` with the `errorMessage`. Alternatively, if an error
 * instance is passed as the `errorMessage`, throw that instead.
 */
export const assert: TAssertionType =(
    val: boolean,
    errorMessage: string | Error,
): asserts val is true => {
    if (val !== true) {
        const error = (typeof errorMessage === 'string')
            ? new AssertionError(errorMessage)
            : errorMessage;

        throw error;
    }
};
