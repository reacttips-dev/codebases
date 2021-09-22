export const getAverage = (array: { y: number }[]): number =>
    array.reduce((average, { y }) => average + y / array.length, 0);

export const getStandardDeviation = (array: { y: number }[]): number => {
    const average = getAverage(array);
    const differenceSumSquare = array.reduce((sum, { y }) => sum + Math.pow(y - average, 2), 0);
    const { length: arrayLength } = array;
    const standardDeviation = Math.pow(differenceSumSquare / arrayLength, 0.5);
    return standardDeviation;
};
