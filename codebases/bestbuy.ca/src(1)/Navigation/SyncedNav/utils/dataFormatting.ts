const testDescendants = (tree, condition, childrenKey = "children") => {
    return tree[childrenKey]
        ? Array.isArray(tree[childrenKey]) &&
            tree[childrenKey].some((child) => condition(child) || testDescendants(child, condition, childrenKey))
        : false;
};
/**
 * applies a value to all descendents of a tree and returns as a new object
 * @param opts.childrenKey - the key representing the child items of the tree
 * @param opts.value - a function which will output the value to apply to each part of the tree
 * @param data - the object we wish to update
 */
const applyToTree = (opts) => {
    const buildItem = (data) => {
        return Object.assign(Object.assign(Object.assign({}, data), opts.value(data)), { [opts.childrenKey]: data[opts.childrenKey] ? data[opts.childrenKey].map((item) => buildItem(item)) : [] });
    };
    return buildItem;
};
export { applyToTree, testDescendants };
//# sourceMappingURL=dataFormatting.js.map