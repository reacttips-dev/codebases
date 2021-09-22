/**
 * From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
 */
export default function groupBy<T extends {[key: string]: any}>(
    list: T[],
    propertyNameOrAccessor: ((param: T) => string) | string,
) {
    if (["string", "function"].indexOf(typeof propertyNameOrAccessor) === -1) {
        return {};
    }
    return list.reduce((acc: {[key: string]: any}, obj) => {
        const key =
            typeof propertyNameOrAccessor === "string" ? obj[propertyNameOrAccessor] : propertyNameOrAccessor(obj);

        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
    }, {});
}
