"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../../constants");
var makeId_1 = __importDefault(require("../../utils/makeId"));
var utils_1 = require("../../utils");
var isFunction = function (fn) { return fn && typeof fn === "function"; };
exports.DEFAULT_READY_TIMEOUT = 1;
var ONE_DAY_IN_SECONDS = 86400;
/**
 * Contains business rules and helper methods to handle communication with Split.IO.
 * It takes a client, which should be created using SplitIOClientBuilder, that is
 * an SplitIO.IClient. This client is the interface with Split.IO;
 */
var SplitIOService = /** @class */ (function () {
    function SplitIOService(client, logger, blockedEventTypes) {
        if (logger === void 0) { logger = console.log; }
        if (blockedEventTypes === void 0) { blockedEventTypes = constants_1.DEFAULT_BLOCKED_EVENT_TYPES; }
        this.client = client;
        this.logger = logger;
        this.blockedEventTypes = blockedEventTypes;
    }
    SplitIOService.prototype.fetchFeatureToggles = function (featureToggles, userData) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.getTreatments(featureToggles, userData)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, this.mapSplitIOTreatmentsToFeatureToggles(response)];
                }
            });
        });
    };
    SplitIOService.prototype.track = function (eventName, eventValue, properties) {
        if (properties === void 0) { properties = {}; }
        try {
            if (this.isEventTypeBlocked(eventName)) {
                return;
            }
            var cleanEventName = this.sanitizeEventType(eventName);
            var eventData = this.processEventData(eventName, properties);
            this.client.track(cleanEventName, eventValue, eventData);
        }
        catch (error) {
            this.logger(error);
        }
    };
    SplitIOService.prototype.mapSplitIOTreatmentsToFeatureToggles = function (variants) {
        var features = {};
        Object.keys(variants).forEach(function (key) {
            features[key] = variants[key] === "on";
        });
        return features;
    };
    SplitIOService.prototype.init = function (readyCb, updateCb) {
        if (readyCb && isFunction(readyCb)) {
            this.client.on(this.client.Event.SDK_READY, function () {
                readyCb();
            });
        }
        if (updateCb && isFunction(updateCb)) {
            this.client.on(this.client.Event.SDK_UPDATE, function () {
                updateCb();
            });
        }
    };
    SplitIOService.getDefaultConfig = function (authorizationKey, userKey, trafficType) {
        return {
            startup: {
                readyTimeout: exports.DEFAULT_READY_TIMEOUT,
            },
            scheduler: {
                featuresRefreshRate: ONE_DAY_IN_SECONDS,
            },
            core: {
                authorizationKey: authorizationKey,
                key: userKey,
                trafficType: trafficType || "user"
            },
            debug: false
        };
    };
    SplitIOService.getUserKey = function () {
        // avoid errors on SSR
        if (typeof window != 'undefined') {
            var clientIdCookie = utils_1.CookieUtils.getCookie(constants_1.CLIENT_ID_COOKIE_NAME);
            if (clientIdCookie) {
                return clientIdCookie.value;
            }
            var clientId = makeId_1.default();
            clientIdCookie = new utils_1.Cookie(constants_1.CLIENT_ID_COOKIE_NAME, clientId);
            clientIdCookie.maxAge = 31536000; // a year
            utils_1.CookieUtils.setCookie(clientIdCookie);
            return clientIdCookie.value;
        }
        return;
    };
    SplitIOService.mapCustomEventToSplit = function (event) {
        if (event && event.detail) {
            var _a = event.detail.payload, shippingTotal = _a.shippingTotal, totalOrderValueWithDiscounts = _a.totalOrderValueWithDiscounts, totalProductPrice = _a.totalProductPrice, totalSavings = _a.totalSavings, sku = _a.sku;
            return {
                properties: {
                    shippingTotal: shippingTotal,
                    totalOrderValueWithDiscounts: totalOrderValueWithDiscounts,
                    totalProductPrice: totalProductPrice,
                    totalSavings: totalSavings,
                    sku: sku,
                },
                type: event.detail.event,
                value: 0,
            };
        }
        return;
    };
    SplitIOService.mapNativeEventToSPlit = function (event) {
        if (event && event.nativeEvent) {
            var _a = event.detail, shippingTotal = _a.shippingTotal, totalOrderValueWithDiscounts = _a.totalOrderValueWithDiscounts, totalProductPrice = _a.totalProductPrice, totalSavings = _a.totalSavings, sku = _a.sku;
            return {
                properties: {
                    shippingTotal: shippingTotal,
                    totalOrderValueWithDiscounts: totalOrderValueWithDiscounts,
                    totalProductPrice: totalProductPrice,
                    totalSavings: totalSavings,
                    sku: sku
                },
                type: event.nativeEvent.type,
                value: 0,
            };
        }
        return;
    };
    SplitIOService.prototype.sanitizeEventType = function (eventTpe) {
        var forwardSlashRegex = /\//g;
        var cleanString = eventTpe.replace(forwardSlashRegex, "__");
        return cleanString;
    };
    SplitIOService.prototype.isEventTypeBlocked = function (key) {
        var isBlocked = this.blockedEventTypes.some(function (evenType) {
            var regex = new RegExp(evenType);
            return regex.test(key);
        });
        return isBlocked;
    };
    SplitIOService.prototype.processEventData = function (eventName, eventData) {
        try {
            var processedData = Object.assign({}, eventData);
            switch (eventName) {
                case constants_1.EVENTS_MAP.ANALYTICS_CONFIRMATION_PAGELOAD:
                    // @ts-ignore
                    processedData.totalOrderValueWithDiscounts = parseFloat(eventData.totalProductPrice) - parseFloat(eventData.totalSavings);
                    break;
                default:
                    // do nothing
                    break;
            }
            return processedData;
        }
        catch (error) {
            this.logger(error);
            return eventData;
        }
    };
    return SplitIOService;
}());
exports.default = SplitIOService;
//# sourceMappingURL=index.js.map