/**
 * Returns a function that performs the inverse operation of the given function.
 * Ex: const subDays = inverse(addDays);
 */
export default function inverse<T, R>(fn: (value: T, amount: number) => R) {
    return (value: T, amount: number) => fn(value, -amount);
}
