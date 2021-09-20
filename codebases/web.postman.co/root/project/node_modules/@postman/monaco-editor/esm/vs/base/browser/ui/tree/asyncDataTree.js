/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { ComposedTreeDelegate } from './abstractTree.js';
import { ObjectTree, CompressibleObjectTree } from './objectTree.js';
import { TreeError, WeakMapper } from './tree.js';
import { dispose, DisposableStore } from '../../../common/lifecycle.js';
import { Emitter, Event } from '../../../common/event.js';
import { timeout, createCancelablePromise } from '../../../common/async.js';
import { Iterator } from '../../../common/iterator.js';
import { ElementsDragAndDropData } from '../list/listView.js';
import { isPromiseCanceledError, onUnexpectedError } from '../../../common/errors.js';
import { toggleClass } from '../../dom.js';
import { values } from '../../../common/map.js';
import { isFilterResult, getVisibleState } from './indexTreeModel.js';
function createAsyncDataTreeNode(props) {
    return __assign(__assign({}, props), { children: [], refreshPromise: undefined, stale: true, slow: false, collapsedByDefault: undefined });
}
function isAncestor(ancestor, descendant) {
    if (!descendant.parent) {
        return false;
    }
    else if (descendant.parent === ancestor) {
        return true;
    }
    else {
        return isAncestor(ancestor, descendant.parent);
    }
}
function intersects(node, other) {
    return node === other || isAncestor(node, other) || isAncestor(other, node);
}
var AsyncDataTreeNodeWrapper = /** @class */ (function () {
    function AsyncDataTreeNodeWrapper(node) {
        this.node = node;
    }
    Object.defineProperty(AsyncDataTreeNodeWrapper.prototype, "element", {
        get: function () { return this.node.element.element; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AsyncDataTreeNodeWrapper.prototype, "children", {
        get: function () { return this.node.children.map(function (node) { return new AsyncDataTreeNodeWrapper(node); }); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AsyncDataTreeNodeWrapper.prototype, "depth", {
        get: function () { return this.node.depth; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AsyncDataTreeNodeWrapper.prototype, "visibleChildrenCount", {
        get: function () { return this.node.visibleChildrenCount; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AsyncDataTreeNodeWrapper.prototype, "visibleChildIndex", {
        get: function () { return this.node.visibleChildIndex; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AsyncDataTreeNodeWrapper.prototype, "collapsible", {
        get: function () { return this.node.collapsible; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AsyncDataTreeNodeWrapper.prototype, "collapsed", {
        get: function () { return this.node.collapsed; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AsyncDataTreeNodeWrapper.prototype, "visible", {
        get: function () { return this.node.visible; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AsyncDataTreeNodeWrapper.prototype, "filterData", {
        get: function () { return this.node.filterData; },
        enumerable: true,
        configurable: true
    });
    return AsyncDataTreeNodeWrapper;
}());
var AsyncDataTreeRenderer = /** @class */ (function () {
    function AsyncDataTreeRenderer(renderer, nodeMapper, onDidChangeTwistieState) {
        this.renderer = renderer;
        this.nodeMapper = nodeMapper;
        this.onDidChangeTwistieState = onDidChangeTwistieState;
        this.renderedNodes = new Map();
        this.templateId = renderer.templateId;
    }
    AsyncDataTreeRenderer.prototype.renderTemplate = function (container) {
        var templateData = this.renderer.renderTemplate(container);
        return { templateData: templateData };
    };
    AsyncDataTreeRenderer.prototype.renderElement = function (node, index, templateData, height) {
        this.renderer.renderElement(this.nodeMapper.map(node), index, templateData.templateData, height);
    };
    AsyncDataTreeRenderer.prototype.renderTwistie = function (element, twistieElement) {
        toggleClass(twistieElement, 'codicon-loading', element.slow);
        return false;
    };
    AsyncDataTreeRenderer.prototype.disposeElement = function (node, index, templateData, height) {
        if (this.renderer.disposeElement) {
            this.renderer.disposeElement(this.nodeMapper.map(node), index, templateData.templateData, height);
        }
    };
    AsyncDataTreeRenderer.prototype.disposeTemplate = function (templateData) {
        this.renderer.disposeTemplate(templateData.templateData);
    };
    AsyncDataTreeRenderer.prototype.dispose = function () {
        this.renderedNodes.clear();
    };
    return AsyncDataTreeRenderer;
}());
function asTreeEvent(e) {
    return {
        browserEvent: e.browserEvent,
        elements: e.elements.map(function (e) { return e.element; })
    };
}
var AsyncDataTreeElementsDragAndDropData = /** @class */ (function (_super) {
    __extends(AsyncDataTreeElementsDragAndDropData, _super);
    function AsyncDataTreeElementsDragAndDropData(data) {
        var _this = _super.call(this, data.elements.map(function (node) { return node.element; })) || this;
        _this.data = data;
        return _this;
    }
    return AsyncDataTreeElementsDragAndDropData;
}(ElementsDragAndDropData));
function asAsyncDataTreeDragAndDropData(data) {
    if (data instanceof ElementsDragAndDropData) {
        return new AsyncDataTreeElementsDragAndDropData(data);
    }
    return data;
}
var AsyncDataTreeNodeListDragAndDrop = /** @class */ (function () {
    function AsyncDataTreeNodeListDragAndDrop(dnd) {
        this.dnd = dnd;
    }
    AsyncDataTreeNodeListDragAndDrop.prototype.getDragURI = function (node) {
        return this.dnd.getDragURI(node.element);
    };
    AsyncDataTreeNodeListDragAndDrop.prototype.getDragLabel = function (nodes, originalEvent) {
        if (this.dnd.getDragLabel) {
            return this.dnd.getDragLabel(nodes.map(function (node) { return node.element; }), originalEvent);
        }
        return undefined;
    };
    AsyncDataTreeNodeListDragAndDrop.prototype.onDragStart = function (data, originalEvent) {
        if (this.dnd.onDragStart) {
            this.dnd.onDragStart(asAsyncDataTreeDragAndDropData(data), originalEvent);
        }
    };
    AsyncDataTreeNodeListDragAndDrop.prototype.onDragOver = function (data, targetNode, targetIndex, originalEvent, raw) {
        if (raw === void 0) { raw = true; }
        return this.dnd.onDragOver(asAsyncDataTreeDragAndDropData(data), targetNode && targetNode.element, targetIndex, originalEvent);
    };
    AsyncDataTreeNodeListDragAndDrop.prototype.drop = function (data, targetNode, targetIndex, originalEvent) {
        this.dnd.drop(asAsyncDataTreeDragAndDropData(data), targetNode && targetNode.element, targetIndex, originalEvent);
    };
    AsyncDataTreeNodeListDragAndDrop.prototype.onDragEnd = function (originalEvent) {
        if (this.dnd.onDragEnd) {
            this.dnd.onDragEnd(originalEvent);
        }
    };
    return AsyncDataTreeNodeListDragAndDrop;
}());
function asObjectTreeOptions(options) {
    return options && __assign(__assign({}, options), { collapseByDefault: true, identityProvider: options.identityProvider && {
            getId: function (el) {
                return options.identityProvider.getId(el.element);
            }
        }, dnd: options.dnd && new AsyncDataTreeNodeListDragAndDrop(options.dnd), multipleSelectionController: options.multipleSelectionController && {
            isSelectionSingleChangeEvent: function (e) {
                return options.multipleSelectionController.isSelectionSingleChangeEvent(__assign(__assign({}, e), { element: e.element }));
            },
            isSelectionRangeChangeEvent: function (e) {
                return options.multipleSelectionController.isSelectionRangeChangeEvent(__assign(__assign({}, e), { element: e.element }));
            }
        }, accessibilityProvider: options.accessibilityProvider && __assign(__assign({}, options.accessibilityProvider), { getAriaLabel: function (e) {
                return options.accessibilityProvider.getAriaLabel(e.element);
            }, getAriaLevel: options.accessibilityProvider.getAriaLevel && (function (node) {
                return options.accessibilityProvider.getAriaLevel(node.element);
            }), getActiveDescendantId: options.accessibilityProvider.getActiveDescendantId && (function (node) {
                return options.accessibilityProvider.getActiveDescendantId(node.element);
            }) }), filter: options.filter && {
            filter: function (e, parentVisibility) {
                return options.filter.filter(e.element, parentVisibility);
            }
        }, keyboardNavigationLabelProvider: options.keyboardNavigationLabelProvider && __assign(__assign({}, options.keyboardNavigationLabelProvider), { getKeyboardNavigationLabel: function (e) {
                return options.keyboardNavigationLabelProvider.getKeyboardNavigationLabel(e.element);
            } }), sorter: undefined, expandOnlyOnTwistieClick: typeof options.expandOnlyOnTwistieClick === 'undefined' ? undefined : (typeof options.expandOnlyOnTwistieClick !== 'function' ? options.expandOnlyOnTwistieClick : (function (e) { return options.expandOnlyOnTwistieClick(e.element); })), ariaProvider: options.ariaProvider && {
            getPosInSet: function (el, index) {
                return options.ariaProvider.getPosInSet(el.element, index);
            },
            getSetSize: function (el, index, listLength) {
                return options.ariaProvider.getSetSize(el.element, index, listLength);
            },
            getRole: options.ariaProvider.getRole ? function (el) {
                return options.ariaProvider.getRole(el.element);
            } : undefined,
            isChecked: options.ariaProvider.isChecked ? function (e) {
                var _a;
                return ((_a = options.ariaProvider) === null || _a === void 0 ? void 0 : _a.isChecked)(e.element);
            } : undefined
        }, additionalScrollHeight: options.additionalScrollHeight });
}
function dfs(node, fn) {
    fn(node);
    node.children.forEach(function (child) { return dfs(child, fn); });
}
var AsyncDataTree = /** @class */ (function () {
    function AsyncDataTree(user, container, delegate, renderers, dataSource, options) {
        if (options === void 0) { options = {}; }
        this.user = user;
        this.dataSource = dataSource;
        this.nodes = new Map();
        this.subTreeRefreshPromises = new Map();
        this.refreshPromises = new Map();
        this._onDidRender = new Emitter();
        this._onDidChangeNodeSlowState = new Emitter();
        this.nodeMapper = new WeakMapper(function (node) { return new AsyncDataTreeNodeWrapper(node); });
        this.disposables = new DisposableStore();
        this.identityProvider = options.identityProvider;
        this.autoExpandSingleChildren = typeof options.autoExpandSingleChildren === 'undefined' ? false : options.autoExpandSingleChildren;
        this.sorter = options.sorter;
        this.collapseByDefault = options.collapseByDefault;
        this.tree = this.createTree(user, container, delegate, renderers, options);
        this.root = createAsyncDataTreeNode({
            element: undefined,
            parent: null,
            hasChildren: true
        });
        if (this.identityProvider) {
            this.root = __assign(__assign({}, this.root), { id: null });
        }
        this.nodes.set(null, this.root);
        this.tree.onDidChangeCollapseState(this._onDidChangeCollapseState, this, this.disposables);
    }
    Object.defineProperty(AsyncDataTree.prototype, "onDidChangeFocus", {
        get: function () { return Event.map(this.tree.onDidChangeFocus, asTreeEvent); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AsyncDataTree.prototype, "onDidChangeSelection", {
        get: function () { return Event.map(this.tree.onDidChangeSelection, asTreeEvent); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AsyncDataTree.prototype, "onDidOpen", {
        get: function () { return Event.map(this.tree.onDidOpen, asTreeEvent); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AsyncDataTree.prototype, "onDidFocus", {
        get: function () { return this.tree.onDidFocus; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AsyncDataTree.prototype, "onDidDispose", {
        get: function () { return this.tree.onDidDispose; },
        enumerable: true,
        configurable: true
    });
    AsyncDataTree.prototype.createTree = function (user, container, delegate, renderers, options) {
        var _this = this;
        var objectTreeDelegate = new ComposedTreeDelegate(delegate);
        var objectTreeRenderers = renderers.map(function (r) { return new AsyncDataTreeRenderer(r, _this.nodeMapper, _this._onDidChangeNodeSlowState.event); });
        var objectTreeOptions = asObjectTreeOptions(options) || {};
        return new ObjectTree(user, container, objectTreeDelegate, objectTreeRenderers, objectTreeOptions);
    };
    AsyncDataTree.prototype.updateOptions = function (options) {
        if (options === void 0) { options = {}; }
        this.tree.updateOptions(options);
    };
    // Widget
    AsyncDataTree.prototype.getHTMLElement = function () {
        return this.tree.getHTMLElement();
    };
    Object.defineProperty(AsyncDataTree.prototype, "scrollTop", {
        get: function () {
            return this.tree.scrollTop;
        },
        set: function (scrollTop) {
            this.tree.scrollTop = scrollTop;
        },
        enumerable: true,
        configurable: true
    });
    AsyncDataTree.prototype.domFocus = function () {
        this.tree.domFocus();
    };
    AsyncDataTree.prototype.layout = function (height, width) {
        this.tree.layout(height, width);
    };
    AsyncDataTree.prototype.style = function (styles) {
        this.tree.style(styles);
    };
    // Model
    AsyncDataTree.prototype.getInput = function () {
        return this.root.element;
    };
    AsyncDataTree.prototype.setInput = function (input, viewState) {
        return __awaiter(this, void 0, void 0, function () {
            var viewStateContext;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.refreshPromises.forEach(function (promise) { return promise.cancel(); });
                        this.refreshPromises.clear();
                        this.root.element = input;
                        viewStateContext = viewState && { viewState: viewState, focus: [], selection: [] };
                        return [4 /*yield*/, this._updateChildren(input, true, false, viewStateContext)];
                    case 1:
                        _a.sent();
                        if (viewStateContext) {
                            this.tree.setFocus(viewStateContext.focus);
                            this.tree.setSelection(viewStateContext.selection);
                        }
                        if (viewState && typeof viewState.scrollTop === 'number') {
                            this.scrollTop = viewState.scrollTop;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    AsyncDataTree.prototype._updateChildren = function (element, recursive, rerender, viewStateContext) {
        if (element === void 0) { element = this.root.element; }
        if (recursive === void 0) { recursive = true; }
        if (rerender === void 0) { rerender = false; }
        return __awaiter(this, void 0, void 0, function () {
            var node;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof this.root.element === 'undefined') {
                            throw new TreeError(this.user, 'Tree input not set');
                        }
                        if (!this.root.refreshPromise) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.root.refreshPromise];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, Event.toPromise(this._onDidRender.event)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        node = this.getDataNode(element);
                        return [4 /*yield*/, this.refreshAndRenderNode(node, recursive, viewStateContext)];
                    case 4:
                        _a.sent();
                        if (rerender) {
                            try {
                                this.tree.rerender(node);
                            }
                            catch (_b) {
                                // missing nodes are fine, this could've resulted from
                                // parallel refresh calls, removing `node` altogether
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // View
    AsyncDataTree.prototype.rerender = function (element) {
        if (element === undefined || element === this.root.element) {
            this.tree.rerender();
            return;
        }
        var node = this.getDataNode(element);
        this.tree.rerender(node);
    };
    AsyncDataTree.prototype.collapse = function (element, recursive) {
        if (recursive === void 0) { recursive = false; }
        var node = this.getDataNode(element);
        return this.tree.collapse(node === this.root ? null : node, recursive);
    };
    AsyncDataTree.prototype.expand = function (element, recursive) {
        if (recursive === void 0) { recursive = false; }
        return __awaiter(this, void 0, void 0, function () {
            var node, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof this.root.element === 'undefined') {
                            throw new TreeError(this.user, 'Tree input not set');
                        }
                        if (!this.root.refreshPromise) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.root.refreshPromise];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, Event.toPromise(this._onDidRender.event)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        node = this.getDataNode(element);
                        if (this.tree.hasElement(node) && !this.tree.isCollapsible(node)) {
                            return [2 /*return*/, false];
                        }
                        if (!node.refreshPromise) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.root.refreshPromise];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, Event.toPromise(this._onDidRender.event)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        if (node !== this.root && !node.refreshPromise && !this.tree.isCollapsed(node)) {
                            return [2 /*return*/, false];
                        }
                        result = this.tree.expand(node === this.root ? null : node, recursive);
                        if (!node.refreshPromise) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.root.refreshPromise];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, Event.toPromise(this._onDidRender.event)];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: return [2 /*return*/, result];
                }
            });
        });
    };
    AsyncDataTree.prototype.setSelection = function (elements, browserEvent) {
        var _this = this;
        var nodes = elements.map(function (e) { return _this.getDataNode(e); });
        this.tree.setSelection(nodes, browserEvent);
    };
    AsyncDataTree.prototype.getSelection = function () {
        var nodes = this.tree.getSelection();
        return nodes.map(function (n) { return n.element; });
    };
    AsyncDataTree.prototype.setFocus = function (elements, browserEvent) {
        var _this = this;
        var nodes = elements.map(function (e) { return _this.getDataNode(e); });
        this.tree.setFocus(nodes, browserEvent);
    };
    AsyncDataTree.prototype.getFocus = function () {
        var nodes = this.tree.getFocus();
        return nodes.map(function (n) { return n.element; });
    };
    AsyncDataTree.prototype.reveal = function (element, relativeTop) {
        this.tree.reveal(this.getDataNode(element), relativeTop);
    };
    // Implementation
    AsyncDataTree.prototype.getDataNode = function (element) {
        var node = this.nodes.get((element === this.root.element ? null : element));
        if (!node) {
            throw new TreeError(this.user, "Data tree node not found: " + element);
        }
        return node;
    };
    AsyncDataTree.prototype.refreshAndRenderNode = function (node, recursive, viewStateContext) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.refreshNode(node, recursive, viewStateContext)];
                    case 1:
                        _a.sent();
                        this.render(node, viewStateContext);
                        return [2 /*return*/];
                }
            });
        });
    };
    AsyncDataTree.prototype.refreshNode = function (node, recursive, viewStateContext) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            var _this = this;
            return __generator(this, function (_a) {
                this.subTreeRefreshPromises.forEach(function (refreshPromise, refreshNode) {
                    if (!result && intersects(refreshNode, node)) {
                        result = refreshPromise.then(function () { return _this.refreshNode(node, recursive, viewStateContext); });
                    }
                });
                if (result) {
                    return [2 /*return*/, result];
                }
                return [2 /*return*/, this.doRefreshSubTree(node, recursive, viewStateContext)];
            });
        });
    };
    AsyncDataTree.prototype.doRefreshSubTree = function (node, recursive, viewStateContext) {
        return __awaiter(this, void 0, void 0, function () {
            var done, childrenToRefresh;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        node.refreshPromise = new Promise(function (c) { return done = c; });
                        this.subTreeRefreshPromises.set(node, node.refreshPromise);
                        node.refreshPromise.finally(function () {
                            node.refreshPromise = undefined;
                            _this.subTreeRefreshPromises.delete(node);
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 4, 5]);
                        return [4 /*yield*/, this.doRefreshNode(node, recursive, viewStateContext)];
                    case 2:
                        childrenToRefresh = _a.sent();
                        node.stale = false;
                        return [4 /*yield*/, Promise.all(childrenToRefresh.map(function (child) { return _this.doRefreshSubTree(child, recursive, viewStateContext); }))];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        done();
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AsyncDataTree.prototype.doRefreshNode = function (node, recursive, viewStateContext) {
        return __awaiter(this, void 0, void 0, function () {
            var childrenPromise, slowTimeout_1, children, err_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        node.hasChildren = !!this.dataSource.hasChildren(node.element);
                        if (!node.hasChildren) {
                            childrenPromise = Promise.resolve([]);
                        }
                        else {
                            slowTimeout_1 = timeout(800);
                            slowTimeout_1.then(function () {
                                node.slow = true;
                                _this._onDidChangeNodeSlowState.fire(node);
                            }, function (_) { return null; });
                            childrenPromise = this.doGetChildren(node)
                                .finally(function () { return slowTimeout_1.cancel(); });
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, childrenPromise];
                    case 2:
                        children = _a.sent();
                        return [2 /*return*/, this.setChildren(node, children, recursive, viewStateContext)];
                    case 3:
                        err_1 = _a.sent();
                        if (node !== this.root) {
                            this.tree.collapse(node === this.root ? null : node);
                        }
                        if (isPromiseCanceledError(err_1)) {
                            return [2 /*return*/, []];
                        }
                        throw err_1;
                    case 4:
                        if (node.slow) {
                            node.slow = false;
                            this._onDidChangeNodeSlowState.fire(node);
                        }
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AsyncDataTree.prototype.doGetChildren = function (node) {
        var _this = this;
        var result = this.refreshPromises.get(node);
        if (result) {
            return result;
        }
        result = createCancelablePromise(function () { return __awaiter(_this, void 0, void 0, function () {
            var children;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataSource.getChildren(node.element)];
                    case 1:
                        children = _a.sent();
                        return [2 /*return*/, this.processChildren(children)];
                }
            });
        }); });
        this.refreshPromises.set(node, result);
        return result.finally(function () { return _this.refreshPromises.delete(node); });
    };
    AsyncDataTree.prototype._onDidChangeCollapseState = function (_a) {
        var node = _a.node, deep = _a.deep;
        if (!node.collapsed && node.element.stale) {
            if (deep) {
                this.collapse(node.element.element);
            }
            else {
                this.refreshAndRenderNode(node.element, false)
                    .catch(onUnexpectedError);
            }
        }
    };
    AsyncDataTree.prototype.setChildren = function (node, childrenElements, recursive, viewStateContext) {
        var _a;
        var _this = this;
        // perf: if the node was and still is a leaf, avoid all this hassle
        if (node.children.length === 0 && childrenElements.length === 0) {
            return [];
        }
        var nodesToForget = new Map();
        var childrenTreeNodesById = new Map();
        for (var _i = 0, _b = node.children; _i < _b.length; _i++) {
            var child = _b[_i];
            nodesToForget.set(child.element, child);
            if (this.identityProvider) {
                var collapsed = this.tree.isCollapsed(child);
                childrenTreeNodesById.set(child.id, { node: child, collapsed: collapsed });
            }
        }
        var childrenToRefresh = [];
        var children = childrenElements.map(function (element) {
            var hasChildren = !!_this.dataSource.hasChildren(element);
            if (!_this.identityProvider) {
                var asyncDataTreeNode = createAsyncDataTreeNode({ element: element, parent: node, hasChildren: hasChildren });
                if (hasChildren && _this.collapseByDefault && !_this.collapseByDefault(element)) {
                    asyncDataTreeNode.collapsedByDefault = false;
                    childrenToRefresh.push(asyncDataTreeNode);
                }
                return asyncDataTreeNode;
            }
            var id = _this.identityProvider.getId(element).toString();
            var result = childrenTreeNodesById.get(id);
            if (result) {
                var asyncDataTreeNode = result.node;
                nodesToForget.delete(asyncDataTreeNode.element);
                _this.nodes.delete(asyncDataTreeNode.element);
                _this.nodes.set(element, asyncDataTreeNode);
                asyncDataTreeNode.element = element;
                asyncDataTreeNode.hasChildren = hasChildren;
                if (recursive) {
                    if (result.collapsed) {
                        asyncDataTreeNode.children.forEach(function (node) { return dfs(node, function (node) { return _this.nodes.delete(node.element); }); });
                        asyncDataTreeNode.children.splice(0, asyncDataTreeNode.children.length);
                        asyncDataTreeNode.stale = true;
                    }
                    else {
                        childrenToRefresh.push(asyncDataTreeNode);
                    }
                }
                else if (hasChildren && _this.collapseByDefault && !_this.collapseByDefault(element)) {
                    asyncDataTreeNode.collapsedByDefault = false;
                    childrenToRefresh.push(asyncDataTreeNode);
                }
                return asyncDataTreeNode;
            }
            var childAsyncDataTreeNode = createAsyncDataTreeNode({ element: element, parent: node, id: id, hasChildren: hasChildren });
            if (viewStateContext && viewStateContext.viewState.focus && viewStateContext.viewState.focus.indexOf(id) > -1) {
                viewStateContext.focus.push(childAsyncDataTreeNode);
            }
            if (viewStateContext && viewStateContext.viewState.selection && viewStateContext.viewState.selection.indexOf(id) > -1) {
                viewStateContext.selection.push(childAsyncDataTreeNode);
            }
            if (viewStateContext && viewStateContext.viewState.expanded && viewStateContext.viewState.expanded.indexOf(id) > -1) {
                childrenToRefresh.push(childAsyncDataTreeNode);
            }
            else if (hasChildren && _this.collapseByDefault && !_this.collapseByDefault(element)) {
                childAsyncDataTreeNode.collapsedByDefault = false;
                childrenToRefresh.push(childAsyncDataTreeNode);
            }
            return childAsyncDataTreeNode;
        });
        for (var _c = 0, _d = values(nodesToForget); _c < _d.length; _c++) {
            var node_1 = _d[_c];
            dfs(node_1, function (node) { return _this.nodes.delete(node.element); });
        }
        for (var _e = 0, children_1 = children; _e < children_1.length; _e++) {
            var child = children_1[_e];
            this.nodes.set(child.element, child);
        }
        (_a = node.children).splice.apply(_a, __spreadArrays([0, node.children.length], children));
        // TODO@joao this doesn't take filter into account
        if (node !== this.root && this.autoExpandSingleChildren && children.length === 1 && childrenToRefresh.length === 0) {
            children[0].collapsedByDefault = false;
            childrenToRefresh.push(children[0]);
        }
        return childrenToRefresh;
    };
    AsyncDataTree.prototype.render = function (node, viewStateContext) {
        var _this = this;
        var children = node.children.map(function (node) { return _this.asTreeElement(node, viewStateContext); });
        this.tree.setChildren(node === this.root ? null : node, children);
        if (node !== this.root) {
            this.tree.setCollapsible(node, node.hasChildren);
        }
        this._onDidRender.fire();
    };
    AsyncDataTree.prototype.asTreeElement = function (node, viewStateContext) {
        var _this = this;
        if (node.stale) {
            return {
                element: node,
                collapsible: node.hasChildren,
                collapsed: true
            };
        }
        var collapsed;
        if (viewStateContext && viewStateContext.viewState.expanded && node.id && viewStateContext.viewState.expanded.indexOf(node.id) > -1) {
            collapsed = false;
        }
        else {
            collapsed = node.collapsedByDefault;
        }
        node.collapsedByDefault = undefined;
        return {
            element: node,
            children: node.hasChildren ? Iterator.map(Iterator.fromArray(node.children), function (child) { return _this.asTreeElement(child, viewStateContext); }) : [],
            collapsible: node.hasChildren,
            collapsed: collapsed
        };
    };
    AsyncDataTree.prototype.processChildren = function (children) {
        if (this.sorter) {
            children.sort(this.sorter.compare.bind(this.sorter));
        }
        return children;
    };
    AsyncDataTree.prototype.dispose = function () {
        this.disposables.dispose();
    };
    return AsyncDataTree;
}());
export { AsyncDataTree };
var CompressibleAsyncDataTreeNodeWrapper = /** @class */ (function () {
    function CompressibleAsyncDataTreeNodeWrapper(node) {
        this.node = node;
    }
    Object.defineProperty(CompressibleAsyncDataTreeNodeWrapper.prototype, "element", {
        get: function () {
            return {
                elements: this.node.element.elements.map(function (e) { return e.element; }),
                incompressible: this.node.element.incompressible
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompressibleAsyncDataTreeNodeWrapper.prototype, "children", {
        get: function () { return this.node.children.map(function (node) { return new CompressibleAsyncDataTreeNodeWrapper(node); }); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompressibleAsyncDataTreeNodeWrapper.prototype, "depth", {
        get: function () { return this.node.depth; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompressibleAsyncDataTreeNodeWrapper.prototype, "visibleChildrenCount", {
        get: function () { return this.node.visibleChildrenCount; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompressibleAsyncDataTreeNodeWrapper.prototype, "visibleChildIndex", {
        get: function () { return this.node.visibleChildIndex; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompressibleAsyncDataTreeNodeWrapper.prototype, "collapsible", {
        get: function () { return this.node.collapsible; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompressibleAsyncDataTreeNodeWrapper.prototype, "collapsed", {
        get: function () { return this.node.collapsed; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompressibleAsyncDataTreeNodeWrapper.prototype, "visible", {
        get: function () { return this.node.visible; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompressibleAsyncDataTreeNodeWrapper.prototype, "filterData", {
        get: function () { return this.node.filterData; },
        enumerable: true,
        configurable: true
    });
    return CompressibleAsyncDataTreeNodeWrapper;
}());
var CompressibleAsyncDataTreeRenderer = /** @class */ (function () {
    function CompressibleAsyncDataTreeRenderer(renderer, nodeMapper, compressibleNodeMapperProvider, onDidChangeTwistieState) {
        this.renderer = renderer;
        this.nodeMapper = nodeMapper;
        this.compressibleNodeMapperProvider = compressibleNodeMapperProvider;
        this.onDidChangeTwistieState = onDidChangeTwistieState;
        this.renderedNodes = new Map();
        this.disposables = [];
        this.templateId = renderer.templateId;
    }
    CompressibleAsyncDataTreeRenderer.prototype.renderTemplate = function (container) {
        var templateData = this.renderer.renderTemplate(container);
        return { templateData: templateData };
    };
    CompressibleAsyncDataTreeRenderer.prototype.renderElement = function (node, index, templateData, height) {
        this.renderer.renderElement(this.nodeMapper.map(node), index, templateData.templateData, height);
    };
    CompressibleAsyncDataTreeRenderer.prototype.renderCompressedElements = function (node, index, templateData, height) {
        this.renderer.renderCompressedElements(this.compressibleNodeMapperProvider().map(node), index, templateData.templateData, height);
    };
    CompressibleAsyncDataTreeRenderer.prototype.renderTwistie = function (element, twistieElement) {
        toggleClass(twistieElement, 'codicon-loading', element.slow);
        return false;
    };
    CompressibleAsyncDataTreeRenderer.prototype.disposeElement = function (node, index, templateData, height) {
        if (this.renderer.disposeElement) {
            this.renderer.disposeElement(this.nodeMapper.map(node), index, templateData.templateData, height);
        }
    };
    CompressibleAsyncDataTreeRenderer.prototype.disposeCompressedElements = function (node, index, templateData, height) {
        if (this.renderer.disposeCompressedElements) {
            this.renderer.disposeCompressedElements(this.compressibleNodeMapperProvider().map(node), index, templateData.templateData, height);
        }
    };
    CompressibleAsyncDataTreeRenderer.prototype.disposeTemplate = function (templateData) {
        this.renderer.disposeTemplate(templateData.templateData);
    };
    CompressibleAsyncDataTreeRenderer.prototype.dispose = function () {
        this.renderedNodes.clear();
        this.disposables = dispose(this.disposables);
    };
    return CompressibleAsyncDataTreeRenderer;
}());
function asCompressibleObjectTreeOptions(options) {
    var objectTreeOptions = options && asObjectTreeOptions(options);
    return objectTreeOptions && __assign(__assign({}, objectTreeOptions), { keyboardNavigationLabelProvider: objectTreeOptions.keyboardNavigationLabelProvider && __assign(__assign({}, objectTreeOptions.keyboardNavigationLabelProvider), { getCompressedNodeKeyboardNavigationLabel: function (els) {
                return options.keyboardNavigationLabelProvider.getCompressedNodeKeyboardNavigationLabel(els.map(function (e) { return e.element; }));
            } }) });
}
var CompressibleAsyncDataTree = /** @class */ (function (_super) {
    __extends(CompressibleAsyncDataTree, _super);
    function CompressibleAsyncDataTree(user, container, virtualDelegate, compressionDelegate, renderers, dataSource, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, user, container, virtualDelegate, renderers, dataSource, options) || this;
        _this.compressionDelegate = compressionDelegate;
        _this.compressibleNodeMapper = new WeakMapper(function (node) { return new CompressibleAsyncDataTreeNodeWrapper(node); });
        _this.filter = options.filter;
        return _this;
    }
    CompressibleAsyncDataTree.prototype.createTree = function (user, container, delegate, renderers, options) {
        var _this = this;
        var objectTreeDelegate = new ComposedTreeDelegate(delegate);
        var objectTreeRenderers = renderers.map(function (r) { return new CompressibleAsyncDataTreeRenderer(r, _this.nodeMapper, function () { return _this.compressibleNodeMapper; }, _this._onDidChangeNodeSlowState.event); });
        var objectTreeOptions = asCompressibleObjectTreeOptions(options) || {};
        return new CompressibleObjectTree(user, container, objectTreeDelegate, objectTreeRenderers, objectTreeOptions);
    };
    CompressibleAsyncDataTree.prototype.asTreeElement = function (node, viewStateContext) {
        return __assign({ incompressible: this.compressionDelegate.isIncompressible(node.element) }, _super.prototype.asTreeElement.call(this, node, viewStateContext));
    };
    CompressibleAsyncDataTree.prototype.updateOptions = function (options) {
        if (options === void 0) { options = {}; }
        this.tree.updateOptions(options);
    };
    CompressibleAsyncDataTree.prototype.render = function (node, viewStateContext) {
        var _this = this;
        if (!this.identityProvider) {
            return _super.prototype.render.call(this, node, viewStateContext);
        }
        // Preserve traits across compressions. Hacky but does the trick.
        // This is hard to fix properly since it requires rewriting the traits
        // across trees and lists. Let's just keep it this way for now.
        var getId = function (element) { return _this.identityProvider.getId(element).toString(); };
        var getUncompressedIds = function (nodes) {
            var result = new Set();
            for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
                var node_2 = nodes_1[_i];
                var compressedNode = _this.tree.getCompressedTreeNode(node_2 === _this.root ? null : node_2);
                if (!compressedNode.element) {
                    continue;
                }
                for (var _a = 0, _b = compressedNode.element.elements; _a < _b.length; _a++) {
                    var node_3 = _b[_a];
                    result.add(getId(node_3.element));
                }
            }
            return result;
        };
        var oldSelection = getUncompressedIds(this.tree.getSelection());
        var oldFocus = getUncompressedIds(this.tree.getFocus());
        _super.prototype.render.call(this, node, viewStateContext);
        var selection = this.getSelection();
        var didChangeSelection = false;
        var focus = this.getFocus();
        var didChangeFocus = false;
        var visit = function (node) {
            var compressedNode = node.element;
            if (compressedNode) {
                for (var i = 0; i < compressedNode.elements.length; i++) {
                    var id = getId(compressedNode.elements[i].element);
                    var element = compressedNode.elements[compressedNode.elements.length - 1].element;
                    // github.com/microsoft/vscode/issues/85938
                    if (oldSelection.has(id) && selection.indexOf(element) === -1) {
                        selection.push(element);
                        didChangeSelection = true;
                    }
                    if (oldFocus.has(id) && focus.indexOf(element) === -1) {
                        focus.push(element);
                        didChangeFocus = true;
                    }
                }
            }
            node.children.forEach(visit);
        };
        visit(this.tree.getCompressedTreeNode(node === this.root ? null : node));
        if (didChangeSelection) {
            this.setSelection(selection);
        }
        if (didChangeFocus) {
            this.setFocus(focus);
        }
    };
    // For compressed async data trees, `TreeVisibility.Recurse` doesn't currently work
    // and we have to filter everything beforehand
    // Related to #85193 and #85835
    CompressibleAsyncDataTree.prototype.processChildren = function (children) {
        var _this = this;
        if (this.filter) {
            children = children.filter(function (e) {
                var result = _this.filter.filter(e, 1 /* Visible */);
                var visibility = getVisibility(result);
                if (visibility === 2 /* Recurse */) {
                    throw new Error('Recursive tree visibility not supported in async data compressed trees');
                }
                return visibility === 1 /* Visible */;
            });
        }
        return _super.prototype.processChildren.call(this, children);
    };
    return CompressibleAsyncDataTree;
}(AsyncDataTree));
export { CompressibleAsyncDataTree };
function getVisibility(filterResult) {
    if (typeof filterResult === 'boolean') {
        return filterResult ? 1 /* Visible */ : 0 /* Hidden */;
    }
    else if (isFilterResult(filterResult)) {
        return getVisibleState(filterResult.visibility);
    }
    else {
        return getVisibleState(filterResult);
    }
}
