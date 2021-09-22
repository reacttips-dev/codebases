import React, { createContext } from 'react';
export var FeaturesContext = createContext({
    flags: {},
});
export var FeaturesProvider = function (_a) {
    var flags = _a.flags, children = _a.children;
    return (React.createElement(FeaturesContext.Provider, { value: { flags: flags } }, children));
};
//# sourceMappingURL=features.js.map