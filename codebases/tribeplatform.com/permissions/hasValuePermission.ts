export const hasValuePermission = (permissions = [], value) => {
    var _a, _b, _c;
    const has = permissions === null || permissions === void 0 ? void 0 : permissions.find(p => p.value === value);
    return {
        authorized: Boolean((_a = has === null || has === void 0 ? void 0 : has.isAuthorized) === null || _a === void 0 ? void 0 : _a.authorized),
        reason: (_b = has === null || has === void 0 ? void 0 : has.isAuthorized) === null || _b === void 0 ? void 0 : _b.reason,
        requiredPlan: (_c = has === null || has === void 0 ? void 0 : has.isAuthorized) === null || _c === void 0 ? void 0 : _c.requiredPlan,
        value: has === null || has === void 0 ? void 0 : has.value,
        valuePermission: has,
    };
};
//# sourceMappingURL=hasValuePermission.js.map