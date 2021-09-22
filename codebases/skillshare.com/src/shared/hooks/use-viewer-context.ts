var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { useQuery } from '@apollo/react-hooks';
import { GetViewerContextQuery } from '../../schema/user/server-queries';
import { useAuthentication } from './use-authentication';
export function useViewerContext(couponCode) {
    var isAuthenticated = useAuthentication().isAuthenticated;
    var data = useQuery(GetViewerContextQuery, { variables: { isAuthenticated: isAuthenticated, couponCode: couponCode } }).data;
    var userIdentity;
    if (data && data.viewer) {
        var sub = data.viewer.subscription;
        var isPremium = sub !== undefined ? sub.isActive && !sub.isPaused : false;
        userIdentity = __assign(__assign({}, data.viewer), { isPremium: isPremium });
    }
    return {
        user: userIdentity,
        siteAnnouncement: data === null || data === void 0 ? void 0 : data.siteAnnouncement,
    };
}
//# sourceMappingURL=use-viewer-context.js.map