const regex = /\{(.*?)\}/gi;
const contentParser = (expressionMap) => ({
    parse: (str) => str.replace(regex, (match, key) => expressionMap.hasOwnProperty(key) ? expressionMap[key] : ""),
});
export default contentParser;
//# sourceMappingURL=contentParser.js.map