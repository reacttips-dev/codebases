export var addRedirectUrl = function (url, redirectTo) {
    if (!redirectTo) {
        return url;
    }
    var param = new URLSearchParams({ redirectTo: redirectTo });
    return url + "?" + param.toString();
};
//# sourceMappingURL=add-redirect-to-parameter.js.map