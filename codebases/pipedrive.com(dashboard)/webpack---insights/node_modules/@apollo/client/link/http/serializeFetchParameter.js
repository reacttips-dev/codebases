import { InvariantError } from 'ts-invariant';
export var serializeFetchParameter = function (p, label) {
    var serialized;
    try {
        serialized = JSON.stringify(p);
    }
    catch (e) {
        var parseError = process.env.NODE_ENV === "production" ? new InvariantError(23) : new InvariantError("Network request failed. " + label + " is not serializable: " + e.message);
        parseError.parseError = e;
        throw parseError;
    }
    return serialized;
};
//# sourceMappingURL=serializeFetchParameter.js.map