import React from 'react';
export var EnvironmentContext = React.createContext({
    variables: {
        api: { host: '', schema: '' },
        apiInternal: { host: '', schema: '' },
        recaptcha: { siteKey: '' },
        appHost: '',
        isStripeProductionEnvironment: false,
    },
});
export var EnvironmentProvider = function (_a) {
    var variables = _a.variables, children = _a.children;
    return React.createElement(EnvironmentContext.Provider, { value: { variables: variables } }, children);
};
//# sourceMappingURL=environment.js.map