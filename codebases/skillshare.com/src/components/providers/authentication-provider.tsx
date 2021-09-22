import React from 'react';
export var AuthenticationContext = React.createContext({
    isAuthenticated: false,
    YII_CSRF_TOKEN: '',
    device_session_id: '',
});
export var AuthenticationProvider = function (_a) {
    var isAuthenticated = _a.isAuthenticated, _b = _a.YII_CSRF_TOKEN, YII_CSRF_TOKEN = _b === void 0 ? '' : _b, _c = _a.device_session_id, device_session_id = _c === void 0 ? '' : _c, children = _a.children;
    return (React.createElement(AuthenticationContext.Provider, { value: { isAuthenticated: isAuthenticated, YII_CSRF_TOKEN: YII_CSRF_TOKEN, device_session_id: device_session_id } }, children));
};
//# sourceMappingURL=authentication-provider.js.map