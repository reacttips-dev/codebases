/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
import { Iterator } from '../../../common/iterator.js';
import { Event } from '../../../common/event.js';
import { TreeError, WeakMapper } from './tree.js';
import { ObjectTreeModel } from './objectTreeModel.js';
function noCompress(element) {
    var elements = [element.element];
    var incompressible = element.incompressible || false;
    return {
        element: { elements: elements, incompressible: incompressible },
        children: Iterator.map(Iterator.from(element.children), noCompress),
        collapsible: element.collapsible,
        collapsed: element.collapsed
    };
}
// Exported only for test reasons, do not use directly
export function compress(element) {
    var elements = [element.element];
    var incompressible = element.incompressible || false;
    var childrenIterator;
    var children;
    while (true) {
        childrenIterator = Iterator.from(element.children);
        children = Iterator.collect(childrenIterator, 2);
        if (children.length !== 1) {
            break;
        }
        element = children[0];
        if (element.incompressible) {
            break;
        }
        elements.push(element.element);
    }
    return {
        element: { elements: elements, incompressible: incompressible },
        children: Iterator.map(Iterator.concat(Iterator.fromArray(children), childrenIterator), compress),
        collapsible: element.collapsible,
        collapsed: element.collapsed
    };
}
function _decompress(element, index) {
    if (index === void 0) { index = 0; }
    var children;
    if (index < element.element.elements.length - 1) {
        children = Iterator.single(_decompress(element, index + 1));
    }
    else {
        children = Iterator.map(Iterator.from(element.children), function (el) { return _decompress(el, 0); });
    }
    if (index === 0 && element.element.incompressible) {
        return {
            element: element.element.elements[index],
            children: children,
            incompressible: true,
            collapsible: element.collapsible,
            collapsed: element.collapsed
        };
    }
    return {
        element: element.element.elements[index],
        children: children,
        collapsible: element.collapsible,
        collapsed: element.collapsed
    };
}
// Exported only for test reasons, do not use directly
export function decompress(element) {
    return _decompress(element, 0);
}
function splice(treeElement, element, children) {
    if (treeElement.element === element) {
        return __assign(__assign({}, treeElement), { children: children });
    }
    return __assign(__assign({}, treeElement), { children: Iterator.map(Iterator.from(treeElement.children), function (e) { return splice(e, element, children); }) });
}
// Exported only for test reasons, do not use directly
var CompressedObjectTreeModel = /** @class */ (function () {
    function CompressedObjectTreeModel(user, list, options) {
        if (options === void 0) { options = {}; }
        this.user = user;
        this.nodes = new Map();
        this.model = new ObjectTreeModel(user, list, options);
        this.enabled = typeof options.compressionEnabled === 'undefined' ? true : options.compressionEnabled;
    }
    Object.defineProperty(CompressedObjectTreeModel.prototype, "onDidSplice", {
        get: function () { return this.model.onDidSplice; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompressedObjectTreeModel.prototype, "onDidChangeCollapseState", {
        get: function () { return this.model.onDidChangeCollapseState; },
        enumerable: true,
        configurable: true
    });
    CompressedObjectTreeModel.prototype.setChildren = function (element, children) {
        if (element === null) {
            var compressedChildren = Iterator.map(Iterator.from(children), this.enabled ? compress : noCompress);
            this._setChildren(null, compressedChildren);
            return;
        }
        var compressedNode = this.nodes.get(element);
        if (!compressedNode) {
            throw new Error('Unknown compressed tree node');
        }
        var node = this.model.getNode(compressedNode);
        var compressedParentNode = this.model.getParentNodeLocation(compressedNode);
        var parent = this.model.getNode(compressedParentNode);
        var decompressedElement = decompress(node);
        var splicedElement = splice(decompressedElement, element, Iterator.from(children));
        var recompressedElement = (this.enabled ? compress : noCompress)(splicedElement);
        var parentChildren = parent.children
            .map(function (child) { return child === node ? recompressedElement : child; });
        this._setChildren(parent.element, parentChildren);
    };
    CompressedObjectTreeModel.prototype.setCompressionEnabled = function (enabled) {
        if (enabled === this.enabled) {
            return;
        }
        this.enabled = enabled;
        var root = this.model.getNode();
        var rootChildren = Iterator.from(root.children);
        var decompressedRootChildren = Iterator.map(rootChildren, decompress);
        var recompressedRootChildren = Iterator.map(decompressedRootChildren, enabled ? compress : noCompress);
        this._setChildren(null, recompressedRootChildren);
    };
    CompressedObjectTreeModel.prototype._setChildren = function (node, children) {
        var _this = this;
        var insertedElements = new Set();
        var _onDidCreateNode = function (node) {
            for (var _i = 0, _a = node.element.elements; _i < _a.length; _i++) {
                var element = _a[_i];
                insertedElements.add(element);
                _this.nodes.set(element, node.element);
            }
        };
        var _onDidDeleteNode = function (node) {
            for (var _i = 0, _a = node.element.elements; _i < _a.length; _i++) {
                var element = _a[_i];
                if (!insertedElements.has(element)) {
                    _this.nodes.delete(element);
                }
            }
        };
        this.model.setChildren(node, children, _onDidCreateNode, _onDidDeleteNode);
    };
    CompressedObjectTreeModel.prototype.has = function (element) {
        return this.nodes.has(element);
    };
    CompressedObjectTreeModel.prototype.getListIndex = function (location) {
        var node = this.getCompressedNode(location);
        return this.model.getListIndex(node);
    };
    CompressedObjectTreeModel.prototype.getListRenderCount = function (location) {
        var node = this.getCompressedNode(location);
        return this.model.getListRenderCount(node);
    };
    CompressedObjectTreeModel.prototype.getNode = function (location) {
        if (typeof location === 'undefined') {
            return this.model.getNode();
        }
        var node = this.getCompressedNode(location);
        return this.model.getNode(node);
    };
    // TODO: review this
    CompressedObjectTreeModel.prototype.getNodeLocation = function (node) {
        var compressedNode = this.model.getNodeLocation(node);
        if (compressedNode === null) {
            return null;
        }
        return compressedNode.elements[compressedNode.elements.length - 1];
    };
    // TODO: review this
    CompressedObjectTreeModel.prototype.getParentNodeLocation = function (location) {
        var compressedNode = this.getCompressedNode(location);
        var parentNode = this.model.getParentNodeLocation(compressedNode);
        if (parentNode === null) {
            return null;
        }
        return parentNode.elements[parentNode.elements.length - 1];
    };
    CompressedObjectTreeModel.prototype.isCollapsible = function (location) {
        var compressedNode = this.getCompressedNode(location);
        return this.model.isCollapsible(compressedNode);
    };
    CompressedObjectTreeModel.prototype.setCollapsible = function (location, collapsible) {
        var compressedNode = this.getCompressedNode(location);
        return this.model.setCollapsible(compressedNode, collapsible);
    };
    CompressedObjectTreeModel.prototype.isCollapsed = function (location) {
        var compressedNode = this.getCompressedNode(location);
        return this.model.isCollapsed(compressedNode);
    };
    CompressedObjectTreeModel.prototype.setCollapsed = function (location, collapsed, recursive) {
        var compressedNode = this.getCompressedNode(location);
        return this.model.setCollapsed(compressedNode, collapsed, recursive);
    };
    CompressedObjectTreeModel.prototype.expandTo = function (location) {
        var compressedNode = this.getCompressedNode(location);
        this.model.expandTo(compressedNode);
    };
    CompressedObjectTreeModel.prototype.rerender = function (location) {
        var compressedNode = this.getCompressedNode(location);
        this.model.rerender(compressedNode);
    };
    CompressedObjectTreeModel.prototype.refilter = function () {
        this.model.refilter();
    };
    CompressedObjectTreeModel.prototype.getCompressedNode = function (element) {
        if (element === null) {
            return null;
        }
        var node = this.nodes.get(element);
        if (!node) {
            throw new TreeError(this.user, "Tree element not found: " + element);
        }
        return node;
    };
    return CompressedObjectTreeModel;
}());
export { CompressedObjectTreeModel };
export var DefaultElementMapper = function (elements) { return elements[elements.length - 1]; };
var CompressedTreeNodeWrapper = /** @class */ (function () {
    function CompressedTreeNodeWrapper(unwrapper, node) {
        this.unwrapper = unwrapper;
        this.node = node;
    }
    Object.defineProperty(CompressedTreeNodeWrapper.prototype, "element", {
        get: function () { return this.node.element === null ? null : this.unwrapper(this.node.element); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompressedTreeNodeWrapper.prototype, "children", {
        get: function () {
            var _this = this;
            return this.node.children.map(function (node) { return new CompressedTreeNodeWrapper(_this.unwrapper, node); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompressedTreeNodeWrapper.prototype, "depth", {
        get: function () { return this.node.depth; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompressedTreeNodeWrapper.prototype, "visibleChildrenCount", {
        get: function () { return this.node.visibleChildrenCount; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompressedTreeNodeWrapper.prototype, "visibleChildIndex", {
        get: function () { return this.node.visibleChildIndex; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompressedTreeNodeWrapper.prototype, "collapsible", {
        get: function () { return this.node.collapsible; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompressedTreeNodeWrapper.prototype, "collapsed", {
        get: function () { return this.node.collapsed; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompressedTreeNodeWrapper.prototype, "visible", {
        get: function () { return this.node.visible; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompressedTreeNodeWrapper.prototype, "filterData", {
        get: function () { return this.node.filterData; },
        enumerable: true,
        configurable: true
    });
    return CompressedTreeNodeWrapper;
}());
function mapList(nodeMapper, list) {
    return {
        splice: function (start, deleteCount, toInsert) {
            list.splice(start, deleteCount, toInsert.map(function (node) { return nodeMapper.map(node); }));
        }
    };
}
function mapOptions(compressedNodeUnwrapper, options) {
    return __assign(__assign({}, options), { sorter: options.sorter && {
            compare: function (node, otherNode) {
                return options.sorter.compare(node.elements[0], otherNode.elements[0]);
            }
        }, identityProvider: options.identityProvider && {
            getId: function (node) {
                return options.identityProvider.getId(compressedNodeUnwrapper(node));
            }
        }, filter: options.filter && {
            filter: function (node, parentVisibility) {
                return options.filter.filter(compressedNodeUnwrapper(node), parentVisibility);
            }
        } });
}
var CompressibleObjectTreeModel = /** @class */ (function () {
    function CompressibleObjectTreeModel(user, list, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.elementMapper = options.elementMapper || DefaultElementMapper;
        var compressedNodeUnwrapper = function (node) { return _this.elementMapper(node.elements); };
        this.nodeMapper = new WeakMapper(function (node) { return new CompressedTreeNodeWrapper(compressedNodeUnwrapper, node); });
        this.model = new CompressedObjectTreeModel(user, mapList(this.nodeMapper, list), mapOptions(compressedNodeUnwrapper, options));
    }
    Object.defineProperty(CompressibleObjectTreeModel.prototype, "onDidSplice", {
        get: function () {
            var _this = this;
            return Event.map(this.model.onDidSplice, function (_a) {
                var insertedNodes = _a.insertedNodes, deletedNodes = _a.deletedNodes;
                return ({
                    insertedNodes: insertedNodes.map(function (node) { return _this.nodeMapper.map(node); }),
                    deletedNodes: deletedNodes.map(function (node) { return _this.nodeMapper.map(node); }),
                });
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompressibleObjectTreeModel.prototype, "onDidChangeCollapseState", {
        get: function () {
            var _this = this;
            return Event.map(this.model.onDidChangeCollapseState, function (_a) {
                var node = _a.node, deep = _a.deep;
                return ({
                    node: _this.nodeMapper.map(node),
                    deep: deep
                });
            });
        },
        enumerable: true,
        configurable: true
    });
    CompressibleObjectTreeModel.prototype.setChildren = function (element, children) {
        this.model.setChildren(element, children);
    };
    CompressibleObjectTreeModel.prototype.setCompressionEnabled = function (enabled) {
        this.model.setCompressionEnabled(enabled);
    };
    CompressibleObjectTreeModel.prototype.has = function (location) {
        return this.model.has(location);
    };
    CompressibleObjectTreeModel.prototype.getListIndex = function (location) {
        return this.model.getListIndex(location);
    };
    CompressibleObjectTreeModel.prototype.getListRenderCount = function (location) {
        return this.model.getListRenderCount(location);
    };
    CompressibleObjectTreeModel.prototype.getNode = function (location) {
        return this.nodeMapper.map(this.model.getNode(location));
    };
    CompressibleObjectTreeModel.prototype.getNodeLocation = function (node) {
        return node.element;
    };
    CompressibleObjectTreeModel.prototype.getParentNodeLocation = function (location) {
        return this.model.getParentNodeLocation(location);
    };
    CompressibleObjectTreeModel.prototype.isCollapsible = function (location) {
        return this.model.isCollapsible(location);
    };
    CompressibleObjectTreeModel.prototype.setCollapsible = function (location, collapsed) {
        return this.model.setCollapsible(location, collapsed);
    };
    CompressibleObjectTreeModel.prototype.isCollapsed = function (location) {
        return this.model.isCollapsed(location);
    };
    CompressibleObjectTreeModel.prototype.setCollapsed = function (location, collapsed, recursive) {
        return this.model.setCollapsed(location, collapsed, recursive);
    };
    CompressibleObjectTreeModel.prototype.expandTo = function (location) {
        return this.model.expandTo(location);
    };
    CompressibleObjectTreeModel.prototype.rerender = function (location) {
        return this.model.rerender(location);
    };
    CompressibleObjectTreeModel.prototype.refilter = function () {
        return this.model.refilter();
    };
    CompressibleObjectTreeModel.prototype.getCompressedTreeNode = function (location) {
        if (location === void 0) { location = null; }
        return this.model.getNode(location);
    };
    return CompressibleObjectTreeModel;
}());
export { CompressibleObjectTreeModel };
