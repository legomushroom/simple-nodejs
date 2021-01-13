import { assert } from './assert';

type TAssertionType = <T>(val: T, errorMessage: string | Error) => asserts val is NonNullable<T>;

/**
 * Assert the `val` object is not `null` nor `undefined`, if it is
 * throw an `AssertionError` with the `errorMessage`. Alternatively,
 * if an error instance is passed as the `errorMessage`, throw that instead.
 */
export const assertDefined: TAssertionType = <T>(
    val: T,
    errorMessage: string | Error,
): asserts val is NonNullable<T> => {
    return assert(val != null, errorMessage);
};
