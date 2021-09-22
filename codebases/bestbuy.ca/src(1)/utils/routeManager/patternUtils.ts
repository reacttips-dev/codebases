// tslint:disable:variable-name
// tslint:disable:no-var-requires
// tslint:disable:no-unused-expression
const _invariant = require("invariant");
const _invariant2 = _interopRequireDefault(_invariant);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function _compilePattern(pattern) {
    let regexpSource = "";
    const paramNames = [];
    const tokens = [];
    let match = void 0;
    let lastIndex = 0;
    const matcher = /:([a-zA-Z_$][a-zA-Z0-9_$]*)|\*\*|\*|\(|\)|\\\(|\\\)/g;
    // tslint:disable-next-line:no-conditional-assignment
    while (match = matcher.exec(pattern)) {
        if (match.index !== lastIndex) {
            tokens.push(pattern.slice(lastIndex, match.index));
            regexpSource += escapeRegExp(pattern.slice(lastIndex, match.index));
        }
        if (match[1]) {
            regexpSource += "([^/]+)";
            paramNames.push(match[1]);
        }
        else if (match[0] === "**") {
            regexpSource += "(.*)";
            paramNames.push("splat");
        }
        else if (match[0] === "*") {
            regexpSource += "(.*?)";
            paramNames.push("splat");
        }
        else if (match[0] === "(") {
            regexpSource += "(?:";
        }
        else if (match[0] === ")") {
            regexpSource += ")?";
        }
        else if (match[0] === "\\(") {
            regexpSource += "\\(";
        }
        else if (match[0] === "\\)") {
            regexpSource += "\\)";
        }
        tokens.push(match[0]);
        lastIndex = matcher.lastIndex;
    }
    if (lastIndex !== pattern.length) {
        tokens.push(pattern.slice(lastIndex, pattern.length));
        regexpSource += escapeRegExp(pattern.slice(lastIndex, pattern.length));
    }
    return {
        pattern,
        regexpSource,
        paramNames,
        tokens,
    };
}
const CompiledPatternsCache = Object.create(null);
function compilePattern(pattern) {
    if (!CompiledPatternsCache[pattern]) {
        CompiledPatternsCache[pattern] = _compilePattern(pattern);
    }
    return CompiledPatternsCache[pattern];
}
function matchPattern(pattern, pathname) {
    // Ensure pattern starts with leading slash for consistency with pathname.
    if (pattern.charAt(0) !== "/") {
        pattern = "/" + pattern;
    }
    const compilePattern2 = compilePattern(pattern);
    let regexpSource = compilePattern2.regexpSource;
    const paramNames = compilePattern2.paramNames;
    const tokens = compilePattern2.tokens;
    if (pattern.charAt(pattern.length - 1) !== "/") {
        regexpSource += "/?"; // Allow optional path separator at end.
    }
    // Special-case patterns like '*' for catch-all routes.
    if (tokens[tokens.length - 1] === "*") {
        regexpSource += "$";
    }
    const match = pathname.match(new RegExp("^" + regexpSource, "i"));
    if (match == null) {
        return null;
    }
    const matchedPath = match[0];
    let remainingPathname = pathname.substr(matchedPath.length);
    if (remainingPathname) {
        // Require that the match ends at a path separator, if we didn't match
        // the full path, so any remaining pathname is a new path segment.
        if (matchedPath.charAt(matchedPath.length - 1) !== "/") {
            return null;
        }
        // If there is a remaining pathname, treat the path separator as part of
        // the remaining pathname for properly continuing the match.
        remainingPathname = "/" + remainingPathname;
    }
    return {
        remainingPathname,
        paramNames,
        paramValues: match.slice(1).map((v) => {
            return v && decodeURIComponent(v);
        }),
    };
}
function getParamNames(pattern) {
    return compilePattern(pattern).paramNames;
}
function getParams(pattern, pathname) {
    const match = matchPattern(pattern, pathname);
    if (!match) {
        return null;
    }
    const paramNames = match.paramNames;
    const paramValues = match.paramValues;
    const params = {};
    paramNames.forEach((paramName, index) => {
        params[paramName] = paramValues[index];
    });
    return params;
}
/**
 * Returns a version of the given pattern with params interpolated. Throws
 * if there is a dynamic segment of the pattern for which there is no param.
 */
function formatPattern(pattern, params) {
    params = params || {};
    const compilePattern3 = compilePattern(pattern);
    const tokens = compilePattern3.tokens;
    let parenCount = 0;
    let pathname = "";
    let splatIndex = 0;
    const parenHistory = [];
    let token = void 0;
    let paramName = void 0;
    let paramValue = void 0;
    for (let i = 0, len = tokens.length; i < len; ++i) {
        token = tokens[i];
        if (token === "*" || token === "**") {
            paramValue = Array.isArray(params.splat) ? params.splat[splatIndex++] : params.splat;
            !(paramValue != null || parenCount > 0) ? process.env.NODE_ENV !== "production" ? (_invariant2.default)(false, 'Missing splat #%s for path "%s"', splatIndex, pattern) : (_invariant2.default)(false) : void 0;
            if (paramValue != null) {
                pathname += encodeURI(paramValue);
            }
        }
        else if (token === "(") {
            parenHistory[parenCount] = "";
            parenCount += 1;
        }
        else if (token === ")") {
            const parenText = parenHistory.pop();
            parenCount -= 1;
            if (parenCount) {
                parenHistory[parenCount - 1] += parenText;
            }
            else {
                pathname += parenText;
            }
        }
        else if (token === "\\(") {
            pathname += "(";
        }
        else if (token === "\\)") {
            pathname += ")";
        }
        else if (token.charAt(0) === ":") {
            paramName = token.substring(1);
            paramValue = params[paramName];
            !(paramValue != null || parenCount > 0) ? process.env.NODE_ENV !== "production" ? (_invariant2.default)(false, 'Missing "%s" parameter for path "%s"', paramName, pattern) : (_invariant2.default)(false) : void 0;
            if (paramValue == null) {
                if (parenCount) {
                    parenHistory[parenCount - 1] = "";
                    const curTokenIdx = tokens.indexOf(token);
                    const tokensSubset = tokens.slice(curTokenIdx, tokens.length);
                    let nextParenIdx = -1;
                    for (let _i = 0; _i < tokensSubset.length; _i++) {
                        if (tokensSubset[_i] === ")") {
                            nextParenIdx = _i;
                            break;
                        }
                    }
                    !(nextParenIdx > 0) ? process.env.NODE_ENV !== "production" ? (_invariant2.default)(false, 'Path "%s" is missing end paren at segment "%s"', pattern, tokensSubset.join("")) : (_invariant2.default)(false) : void 0;
                    // jump to ending paren
                    i = curTokenIdx + nextParenIdx - 1;
                }
            }
            else if (parenCount) {
                parenHistory[parenCount - 1] += encodeURIComponent(paramValue);
            }
            else {
                pathname += encodeURIComponent(paramValue);
            }
        }
        else {
            if (parenCount) {
                parenHistory[parenCount - 1] += token;
            }
            else {
                pathname += token;
            }
        }
    }
    !(parenCount <= 0) ? process.env.NODE_ENV !== "production" ? (_invariant2.default)(false, 'Path "%s" is missing end paren', pattern) : (_invariant2.default)(false) : void 0;
    return pathname.replace(/\/+/g, "/");
}
export default {
    compilePattern,
    matchPattern,
    getParamNames,
    getParams,
    formatPattern,
};
//# sourceMappingURL=patternUtils.js.map