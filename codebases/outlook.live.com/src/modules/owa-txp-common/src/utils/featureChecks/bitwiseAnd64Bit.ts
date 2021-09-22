/**
 * Handling bitwise AND operation for 64 bit numbers since javascript bitwise
 * operators convert their operands to signed 32 bit integers before the operation.
 *
 * The result of bitwise operations will also be 32 bit signed integer. So it should
 * be converted to positive number by using >>>0 considering the edge cases where
 * 32nd bit is set in the result.
 */
export default function bitwiseAnd64Bit(num1: number, num2: number): number {
    const mod = Math.pow(2, 32);
    if (num1 >= mod || num2 >= mod) {
        const op1mod = num1 % mod;
        const op2mod = num2 % mod;

        const res32 = (op1mod & op2mod) >>> 0;

        num1 -= op1mod;
        num2 -= op2mod;

        const op164to32 = num1 / mod;
        const op264to32 = num2 / mod;

        const res64to32 = (op164to32 & op264to32) >>> 0;

        return res64to32 * mod + res32;
    } else {
        return (num1 & num2) >>> 0;
    }
}
