export const asTwoChunks = <T>(arr: T[]): [T[], T[]] => {
    const middlePoint = Math.ceil(arr.length / 2);
    return [arr.slice(0, middlePoint), arr.slice(middlePoint, arr.length)];
};
