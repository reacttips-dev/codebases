import React from 'react';
export var CookieContext = React.createContext({});
export var CookieProvider = function (_a) {
    var cookies = _a.cookies, children = _a.children;
    return React.createElement(CookieContext.Provider, { value: { cookies: cookies } }, children);
};
//# sourceMappingURL=cookie.js.map