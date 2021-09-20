export function createContextManager() {
    var context = {};
    return {
        get: function () { return context; },
        add: function (key, value) {
            context[key] = value;
        },
        remove: function (key) {
            delete context[key];
        },
        set: function (newContext) {
            context = newContext;
        },
    };
}
//# sourceMappingURL=contextManager.js.map