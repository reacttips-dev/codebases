"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_from_dom_1 = require("react-from-dom");
var helpers_1 = require("./helpers");
exports.STATUS = {
    FAILED: 'failed',
    LOADED: 'loaded',
    LOADING: 'loading',
    PENDING: 'pending',
    READY: 'ready',
    UNSUPPORTED: 'unsupported',
};
var cacheStore = Object.create(null);
var InlineSVG = /** @class */ (function (_super) {
    __extends(InlineSVG, _super);
    function InlineSVG(props) {
        var _this = _super.call(this, props) || this;
        // tslint:disable-next-line:variable-name
        _this._isMounted = false;
        _this.handleLoad = function (content) {
            /* istanbul ignore else */
            if (_this._isMounted) {
                _this.setState({
                    content: content,
                    status: exports.STATUS.LOADED,
                }, _this.getElement);
            }
        };
        _this.handleError = function (error) {
            var onError = _this.props.onError;
            var status = error.message === 'Browser does not support SVG' ? exports.STATUS.UNSUPPORTED : exports.STATUS.FAILED;
            /* istanbul ignore else */
            if (process.env.NODE_ENV !== 'production') {
                // tslint:disable-next-line:no-console
                console.error(error);
            }
            /* istanbul ignore else */
            if (_this._isMounted) {
                _this.setState({ status: status }, function () {
                    /* istanbul ignore else */
                    if (typeof onError === 'function') {
                        onError(error);
                    }
                });
            }
        };
        _this.request = function () {
            var _a = _this.props, cacheRequests = _a.cacheRequests, src = _a.src;
            try {
                if (cacheRequests) {
                    cacheStore[src] = { content: '', status: exports.STATUS.LOADING, queue: [] };
                }
                return fetch(src)
                    .then(function (response) {
                    var contentType = response.headers.get('content-type');
                    var _a = __read((contentType || '').split(/ ?; ?/), 1), fileType = _a[0];
                    if (response.status > 299) {
                        throw new helpers_1.InlineSVGError('Not Found');
                    }
                    if (!['image/svg+xml', 'text/plain'].some(function (d) { return fileType.indexOf(d) >= 0; })) {
                        throw new helpers_1.InlineSVGError("Content type isn't valid: " + fileType);
                    }
                    return response.text();
                })
                    .then(function (content) {
                    _this.handleLoad(content);
                    /* istanbul ignore else */
                    if (cacheRequests) {
                        var cache = cacheStore[src];
                        /* istanbul ignore else */
                        if (cache) {
                            cache.content = content;
                            cache.status = exports.STATUS.LOADED;
                            cache.queue = cache.queue.filter(function (cb) {
                                cb(content);
                                return false;
                            });
                        }
                    }
                })
                    .catch(function (error) {
                    /* istanbul ignore else */
                    if (cacheRequests) {
                        delete cacheStore[src];
                    }
                    _this.handleError(error);
                });
            }
            catch (error) {
                _this.handleError(new helpers_1.InlineSVGError(error.message));
            }
        };
        _this.state = {
            content: '',
            element: null,
            hasCache: !!props.cacheRequests && !!cacheStore[props.src],
            status: exports.STATUS.PENDING,
        };
        _this.hash = props.uniqueHash || helpers_1.randomString(8);
        return _this;
    }
    InlineSVG.prototype.componentDidMount = function () {
        this._isMounted = true;
        if (!helpers_1.canUseDOM()) {
            this.handleError(new helpers_1.InlineSVGError('No DOM'));
            return;
        }
        var status = this.state.status;
        var src = this.props.src;
        try {
            /* istanbul ignore else */
            if (status === exports.STATUS.PENDING) {
                /* istanbul ignore else */
                if (!helpers_1.isSupportedEnvironment()) {
                    throw new helpers_1.InlineSVGError('Browser does not support SVG');
                }
                /* istanbul ignore else */
                if (!src) {
                    throw new helpers_1.InlineSVGError('Missing src');
                }
                this.load();
            }
        }
        catch (error) {
            this.handleError(error);
        }
    };
    InlineSVG.prototype.componentDidUpdate = function (prevProps, prevState) {
        if (!helpers_1.canUseDOM()) {
            return;
        }
        var _a = this.state, hasCache = _a.hasCache, status = _a.status;
        var _b = this.props, onLoad = _b.onLoad, src = _b.src;
        if (prevState.status !== exports.STATUS.READY && status === exports.STATUS.READY) {
            /* istanbul ignore else */
            if (onLoad) {
                onLoad(src, hasCache);
            }
        }
        if (prevProps.src !== src) {
            if (!src) {
                this.handleError(new helpers_1.InlineSVGError('Missing src'));
                return;
            }
            this.load();
        }
    };
    InlineSVG.prototype.componentWillUnmount = function () {
        this._isMounted = false;
    };
    InlineSVG.prototype.processSVG = function () {
        var content = this.state.content;
        var preProcessor = this.props.preProcessor;
        if (preProcessor) {
            return preProcessor(content);
        }
        return content;
    };
    InlineSVG.prototype.updateSVGAttributes = function (node) {
        var _this = this;
        var _a = this.props, _b = _a.baseURL, baseURL = _b === void 0 ? '' : _b, uniquifyIDs = _a.uniquifyIDs;
        var replaceableAttributes = ['id', 'href', 'xlink:href', 'xlink:role', 'xlink:arcrole'];
        var linkAttributes = ['href', 'xlink:href'];
        var isDataValue = function (name, value) {
            return linkAttributes.indexOf(name) >= 0 && (value ? value.indexOf('#') < 0 : false);
        };
        if (!uniquifyIDs) {
            return node;
        }
        __spread(node.children).map(function (d) {
            if (d.attributes && d.attributes.length) {
                var attributes_1 = Object.values(d.attributes);
                attributes_1.forEach(function (a) {
                    var match = a.value.match(/url\((.*?)\)/);
                    if (match && match[1]) {
                        a.value = a.value.replace(match[0], "url(" + baseURL + match[1] + "__" + _this.hash + ")");
                    }
                });
                replaceableAttributes.forEach(function (r) {
                    var attribute = attributes_1.find(function (a) { return a.name === r; });
                    if (attribute && !isDataValue(r, attribute.value)) {
                        attribute.value = attribute.value + "__" + _this.hash;
                    }
                });
            }
            if (d.children.length) {
                d = _this.updateSVGAttributes(d);
            }
            return d;
        });
        return node;
    };
    InlineSVG.prototype.getNode = function () {
        var _a = this.props, description = _a.description, title = _a.title;
        try {
            var svgText = this.processSVG();
            var node = react_from_dom_1.default(svgText, { nodeOnly: true });
            if (!node || !(node instanceof SVGSVGElement)) {
                throw new helpers_1.InlineSVGError('Could not convert the src to a DOM Node');
            }
            var svg = this.updateSVGAttributes(node);
            if (description) {
                var originalDesc = svg.querySelector('desc');
                if (originalDesc && originalDesc.parentNode) {
                    originalDesc.parentNode.removeChild(originalDesc);
                }
                var descElement = document.createElement('desc');
                descElement.innerHTML = description;
                svg.prepend(descElement);
            }
            if (title) {
                var originalTitle = svg.querySelector('title');
                if (originalTitle && originalTitle.parentNode) {
                    originalTitle.parentNode.removeChild(originalTitle);
                }
                var titleElement = document.createElement('title');
                titleElement.innerHTML = title;
                svg.prepend(titleElement);
            }
            return svg;
        }
        catch (error) {
            this.handleError(error);
        }
    };
    InlineSVG.prototype.getElement = function () {
        try {
            var node = this.getNode();
            var element = react_from_dom_1.default(node);
            if (!element || !React.isValidElement(element)) {
                throw new helpers_1.InlineSVGError('Could not convert the src to a React element');
            }
            this.setState({
                element: element,
                status: exports.STATUS.READY,
            });
        }
        catch (error) {
            this.handleError(new helpers_1.InlineSVGError(error.message));
        }
    };
    InlineSVG.prototype.load = function () {
        var _this = this;
        /* istanbul ignore else */
        if (this._isMounted) {
            this.setState({
                content: '',
                element: null,
                status: exports.STATUS.LOADING,
            }, function () {
                var _a = _this.props, cacheRequests = _a.cacheRequests, src = _a.src;
                var cache = cacheRequests && cacheStore[src];
                if (cache) {
                    /* istanbul ignore else */
                    if (cache.status === exports.STATUS.LOADING) {
                        cache.queue.push(_this.handleLoad);
                    }
                    else if (cache.status === exports.STATUS.LOADED) {
                        _this.handleLoad(cache.content);
                    }
                    return;
                }
                var dataURI = src.match(/data:image\/svg[^,]*?(;base64)?,(.*)/);
                var inlineSrc;
                if (dataURI) {
                    inlineSrc = dataURI[1] ? atob(dataURI[2]) : decodeURIComponent(dataURI[2]);
                }
                else if (src.indexOf('<svg') >= 0) {
                    inlineSrc = src;
                }
                if (inlineSrc) {
                    _this.handleLoad(inlineSrc);
                    return;
                }
                _this.request();
            });
        }
    };
    InlineSVG.prototype.render = function () {
        if (!helpers_1.canUseDOM()) {
            return null;
        }
        var _a = this.state, element = _a.element, status = _a.status;
        var _b = this.props, baseURL = _b.baseURL, cacheRequests = _b.cacheRequests, _c = _b.children, children = _c === void 0 ? null : _c, description = _b.description, innerRef = _b.innerRef, _d = _b.loader, loader = _d === void 0 ? null : _d, onError = _b.onError, onLoad = _b.onLoad, preProcessor = _b.preProcessor, src = _b.src, title = _b.title, uniqueHash = _b.uniqueHash, uniquifyIDs = _b.uniquifyIDs, rest = __rest(_b, ["baseURL", "cacheRequests", "children", "description", "innerRef", "loader", "onError", "onLoad", "preProcessor", "src", "title", "uniqueHash", "uniquifyIDs"]);
        if (element) {
            return React.cloneElement(element, __assign({ ref: innerRef }, rest));
        }
        if ([exports.STATUS.UNSUPPORTED, exports.STATUS.FAILED].indexOf(status) > -1) {
            return children;
        }
        return loader;
    };
    InlineSVG.defaultProps = {
        cacheRequests: true,
        uniquifyIDs: false,
    };
    return InlineSVG;
}(React.PureComponent));
exports.default = InlineSVG;
//# sourceMappingURL=index.js.map