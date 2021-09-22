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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import { useMutation, useQuery } from '@apollo/react-hooks';
import { GetNotificationsQuery, GetTeacherNotificationsQuery } from '../../schema/notifications';
import { MarkNotificationsAsReadMutation } from '../../schema/notifications/mutations';
export var useNotificationsState = function () {
    var _a, _b, _c, _d, _e, _f;
    var START = '-1';
    var limit = 20;
    var _g = useQuery(GetNotificationsQuery, {
        variables: {
            after: START,
            first: limit,
        },
        notifyOnNetworkStatusChange: true,
    }), data = _g.data, refetch = _g.refetch, fetchMore = _g.fetchMore, isDataPending = _g.loading, error = _g.error;
    var onFetchMore = function (endCursor) {
        fetchMore({
            variables: {
                after: endCursor,
            },
            updateQuery: function (prev, _a) {
                var fetchMoreResult = _a.fetchMoreResult;
                if (!fetchMoreResult) {
                    return prev;
                }
                var fetchMoreResultNotificationParams = fetchMoreResult.notifications;
                var prevNotificationParams = prev.notifications;
                var edges = Object.assign({}, prev.notifications, {
                    edges: __spread(prevNotificationParams.edges, fetchMoreResultNotificationParams.edges),
                }).edges;
                return {
                    notifications: __assign(__assign(__assign({}, prevNotificationParams), fetchMoreResultNotificationParams), { edges: edges }),
                };
            },
        });
    };
    var edges = ((_a = data === null || data === void 0 ? void 0 : data.notifications) === null || _a === void 0 ? void 0 : _a.edges) || [];
    var totalCount = ((_b = data === null || data === void 0 ? void 0 : data.notifications) === null || _b === void 0 ? void 0 : _b.totalCount) || 0;
    var hasMore = ((_d = (_c = data === null || data === void 0 ? void 0 : data.notifications) === null || _c === void 0 ? void 0 : _c.pageInfo) === null || _d === void 0 ? void 0 : _d.hasNextPage) || false;
    var endCursor = ((_f = (_e = data === null || data === void 0 ? void 0 : data.notifications) === null || _e === void 0 ? void 0 : _e.pageInfo) === null || _f === void 0 ? void 0 : _f.endCursor) || START.toString();
    var onRefetch = function () {
        refetch();
    };
    return {
        edges: edges,
        totalCount: totalCount,
        isDataPending: isDataPending,
        hasMore: hasMore,
        endCursor: endCursor,
        error: error,
        onRefetch: onRefetch,
        onFetchMore: onFetchMore,
    };
};
export var useTeacherNotificationsState = function () {
    var _a, _b, _c, _d, _e, _f;
    var START = '-1';
    var limit = 20;
    var _g = useQuery(GetTeacherNotificationsQuery, {
        variables: {
            after: START,
            first: limit,
        },
        notifyOnNetworkStatusChange: true,
    }), data = _g.data, refetch = _g.refetch, fetchMore = _g.fetchMore, isDataPending = _g.loading, error = _g.error;
    var onFetchMore = function (endCursor) {
        fetchMore({
            variables: {
                after: endCursor,
            },
            updateQuery: function (prev, _a) {
                var fetchMoreResult = _a.fetchMoreResult;
                if (!fetchMoreResult) {
                    return prev;
                }
                var fetchMoreResultNotificationParams = fetchMoreResult.teacherNotifications;
                var prevNotificationParams = prev.teacherNotifications;
                var edges = Object.assign({}, prev.teacherNotifications, {
                    edges: __spread(prevNotificationParams.edges, fetchMoreResultNotificationParams.edges),
                }).edges;
                return {
                    teacherNotifications: __assign(__assign(__assign({}, prevNotificationParams), fetchMoreResultNotificationParams), { edges: edges }),
                };
            },
        });
    };
    var edges = ((_a = data === null || data === void 0 ? void 0 : data.teacherNotifications) === null || _a === void 0 ? void 0 : _a.edges) || [];
    var totalCount = ((_b = data === null || data === void 0 ? void 0 : data.teacherNotifications) === null || _b === void 0 ? void 0 : _b.totalCount) || 0;
    var hasMore = ((_d = (_c = data === null || data === void 0 ? void 0 : data.teacherNotifications) === null || _c === void 0 ? void 0 : _c.pageInfo) === null || _d === void 0 ? void 0 : _d.hasNextPage) || false;
    var endCursor = ((_f = (_e = data === null || data === void 0 ? void 0 : data.teacherNotifications) === null || _e === void 0 ? void 0 : _e.pageInfo) === null || _f === void 0 ? void 0 : _f.endCursor) || START.toString();
    var onRefetch = function () {
        refetch();
    };
    return {
        edges: edges,
        totalCount: totalCount,
        isDataPending: isDataPending,
        hasMore: hasMore,
        endCursor: endCursor,
        error: error,
        onRefetch: onRefetch,
        onFetchMore: onFetchMore,
    };
};
export var useNotificationActions = function () {
    var _a = __read(useMutation(MarkNotificationsAsReadMutation), 1), markNotificationsAsReadMutation = _a[0];
    var markNotificationsAsRead = function (before) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, markNotificationsAsReadMutation({ variables: { input: { before: before } } })];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    }); };
    return {
        markNotificationsAsRead: markNotificationsAsRead,
    };
};
//# sourceMappingURL=notifications-state.js.map