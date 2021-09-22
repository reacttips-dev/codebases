export const copyObjectByKeys = (object = {}, keys = []) => keys
    .filter((key) => object[key] !== undefined)
    .reduce((acc, curr) => (Object.assign(Object.assign({}, acc), { [curr]: object[curr] })), {});
export const updateObject = (obj, value, updateType = "replace") => {
    if (!obj || !value) {
        return obj;
    }
    switch (updateType) {
        case "replace":
            return value;
        case "extend":
            return Object.assign(Object.assign({}, obj), value);
        default:
            return obj;
    }
};
export const deepObjectModifier = (obj = {}, paths = [], value = {}, updateType = "replace") => {
    if (!paths.length || !obj || !Object.keys(obj)) {
        return obj;
    }
    const [firstNode, ...rest] = paths;
    const hasMoreNodesInPath = rest.length;
    const arrayNodeFormatRegex = /(\w+)\[(\d+)\]/;
    const [, arrayNode = "", index = ""] = arrayNodeFormatRegex.exec(firstNode) || [];
    const itemIndex = Number(index);
    const isArrayNode = !!arrayNode && itemIndex >= 0;
    if (isArrayNode) {
        const isValidArrayNode = obj[arrayNode] && obj[arrayNode].length > itemIndex;
        if (isValidArrayNode) {
            const newArray = [...obj[arrayNode]];
            const newNode = hasMoreNodesInPath ?
                deepObjectModifier(newArray[itemIndex], rest, value, updateType) :
                updateObject(newArray[itemIndex], value, updateType);
            newArray.splice(itemIndex, 1, newNode);
            return Object.assign(Object.assign({}, obj), { [arrayNode]: newArray });
        }
    }
    else {
        const isValidNode = obj[firstNode];
        if (isValidNode) {
            const newNode = hasMoreNodesInPath ?
                deepObjectModifier(obj[firstNode], rest, value, updateType) :
                updateObject(obj[firstNode], value, updateType);
            return Object.assign(Object.assign({}, obj), { [firstNode]: newNode });
        }
    }
    return obj;
};
//# sourceMappingURL=objectBuilder.js.map