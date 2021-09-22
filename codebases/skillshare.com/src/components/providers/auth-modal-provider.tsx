import React from 'react';
export var AuthModalContext = React.createContext({
    api: { isLogin: false, closeAuthModal: function () { }, updateIsEmailSignUp: function () { }, updateIsLogin: function () { } },
});
export var AuthModalProvider = function (_a) {
    var api = _a.api, children = _a.children;
    return React.createElement(AuthModalContext.Provider, { value: { api: api } }, children);
};
//# sourceMappingURL=auth-modal-provider.js.map