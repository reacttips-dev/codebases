export default function insertWithBound(array: any[], value: any, bound: number) {
    array.push(value);
    if (array.length > bound) {
        array.splice(0, 1);
    }
}
