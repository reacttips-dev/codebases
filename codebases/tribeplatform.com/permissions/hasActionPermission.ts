export const hasActionPermission = (permissions = [], scope) => {
    var _a, _b, _c;
    const has = permissions === null || permissions === void 0 ? void 0 : permissions.find(p => p.name === scope);
    return {
        authorized: Boolean((_a = has === null || has === void 0 ? void 0 : has.isAuthorized) === null || _a === void 0 ? void 0 : _a.authorized),
        reason: (_b = has === null || has === void 0 ? void 0 : has.isAuthorized) === null || _b === void 0 ? void 0 : _b.reason,
        requiredPlan: (_c = has === null || has === void 0 ? void 0 : has.isAuthorized) === null || _c === void 0 ? void 0 : _c.requiredPlan,
        actionPermission: has,
    };
};
//# sourceMappingURL=hasActionPermission.js.map