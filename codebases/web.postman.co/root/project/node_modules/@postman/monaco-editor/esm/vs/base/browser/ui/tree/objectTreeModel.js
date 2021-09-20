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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { Iterator, getSequenceIterator } from '../../../common/iterator.js';
import { IndexTreeModel } from './indexTreeModel.js';
import { TreeError } from './tree.js';
import { mergeSort } from '../../../common/arrays.js';
var ObjectTreeModel = /** @class */ (function () {
    function ObjectTreeModel(user, list, options) {
        if (options === void 0) { options = {}; }
        this.user = user;
        this.nodes = new Map();
        this.nodesByIdentity = new Map();
        this.model = new IndexTreeModel(user, list, null, options);
        this.onDidSplice = this.model.onDidSplice;
        this.onDidChangeCollapseState = this.model.onDidChangeCollapseState;
        this.onDidChangeRenderNodeCount = this.model.onDidChangeRenderNodeCount;
        if (options.sorter) {
            this.sorter = {
                compare: function (a, b) {
                    return options.sorter.compare(a.element, b.element);
                }
            };
        }
        this.identityProvider = options.identityProvider;
    }
    ObjectTreeModel.prototype.setChildren = function (element, children, onDidCreateNode, onDidDeleteNode) {
        var location = this.getElementLocation(element);
        this._setChildren(location, this.preserveCollapseState(children), onDidCreateNode, onDidDeleteNode);
    };
    ObjectTreeModel.prototype._setChildren = function (location, children, onDidCreateNode, onDidDeleteNode) {
        var _this = this;
        var insertedElements = new Set();
        var insertedElementIds = new Set();
        var _onDidCreateNode = function (node) {
            insertedElements.add(node.element);
            _this.nodes.set(node.element, node);
            if (_this.identityProvider) {
                var id = _this.identityProvider.getId(node.element).toString();
                insertedElementIds.add(id);
                _this.nodesByIdentity.set(id, node);
            }
            if (onDidCreateNode) {
                onDidCreateNode(node);
            }
        };
        var _onDidDeleteNode = function (node) {
            if (!insertedElements.has(node.element)) {
                _this.nodes.delete(node.element);
            }
            if (_this.identityProvider) {
                var id = _this.identityProvider.getId(node.element).toString();
                if (!insertedElementIds.has(id)) {
                    _this.nodesByIdentity.delete(id);
                }
            }
            if (onDidDeleteNode) {
                onDidDeleteNode(node);
            }
        };
        this.model.splice(__spreadArrays(location, [0]), Number.MAX_VALUE, children, _onDidCreateNode, _onDidDeleteNode);
    };
    ObjectTreeModel.prototype.preserveCollapseState = function (elements) {
        var _this = this;
        var iterator = elements ? getSequenceIterator(elements) : Iterator.empty();
        if (this.sorter) {
            iterator = Iterator.fromArray(mergeSort(Iterator.collect(iterator), this.sorter.compare.bind(this.sorter)));
        }
        return Iterator.map(iterator, function (treeElement) {
            var node = _this.nodes.get(treeElement.element);
            if (!node && _this.identityProvider) {
                var id = _this.identityProvider.getId(treeElement.element).toString();
                node = _this.nodesByIdentity.get(id);
            }
            if (!node) {
                return __assign(__assign({}, treeElement), { children: _this.preserveCollapseState(treeElement.children) });
            }
            var collapsible = typeof treeElement.collapsible === 'boolean' ? treeElement.collapsible : node.collapsible;
            var collapsed = typeof treeElement.collapsed !== 'undefined' ? treeElement.collapsed : node.collapsed;
            return __assign(__assign({}, treeElement), { collapsible: collapsible,
                collapsed: collapsed, children: _this.preserveCollapseState(treeElement.children) });
        });
    };
    ObjectTreeModel.prototype.rerender = function (element) {
        var location = this.getElementLocation(element);
        this.model.rerender(location);
    };
    ObjectTreeModel.prototype.has = function (element) {
        return this.nodes.has(element);
    };
    ObjectTreeModel.prototype.getListIndex = function (element) {
        var location = this.getElementLocation(element);
        return this.model.getListIndex(location);
    };
    ObjectTreeModel.prototype.getListRenderCount = function (element) {
        var location = this.getElementLocation(element);
        return this.model.getListRenderCount(location);
    };
    ObjectTreeModel.prototype.isCollapsible = function (element) {
        var location = this.getElementLocation(element);
        return this.model.isCollapsible(location);
    };
    ObjectTreeModel.prototype.setCollapsible = function (element, collapsible) {
        var location = this.getElementLocation(element);
        return this.model.setCollapsible(location, collapsible);
    };
    ObjectTreeModel.prototype.isCollapsed = function (element) {
        var location = this.getElementLocation(element);
        return this.model.isCollapsed(location);
    };
    ObjectTreeModel.prototype.setCollapsed = function (element, collapsed, recursive) {
        var location = this.getElementLocation(element);
        return this.model.setCollapsed(location, collapsed, recursive);
    };
    ObjectTreeModel.prototype.expandTo = function (element) {
        var location = this.getElementLocation(element);
        this.model.expandTo(location);
    };
    ObjectTreeModel.prototype.refilter = function () {
        this.model.refilter();
    };
    ObjectTreeModel.prototype.getNode = function (element) {
        if (element === void 0) { element = null; }
        if (element === null) {
            return this.model.getNode(this.model.rootRef);
        }
        var node = this.nodes.get(element);
        if (!node) {
            throw new TreeError(this.user, "Tree element not found: " + element);
        }
        return node;
    };
    ObjectTreeModel.prototype.getNodeLocation = function (node) {
        return node.element;
    };
    ObjectTreeModel.prototype.getParentNodeLocation = function (element) {
        if (element === null) {
            throw new TreeError(this.user, "Invalid getParentNodeLocation call");
        }
        var node = this.nodes.get(element);
        if (!node) {
            throw new TreeError(this.user, "Tree element not found: " + element);
        }
        var location = this.model.getNodeLocation(node);
        var parentLocation = this.model.getParentNodeLocation(location);
        var parent = this.model.getNode(parentLocation);
        return parent.element;
    };
    ObjectTreeModel.prototype.getElementLocation = function (element) {
        if (element === null) {
            return [];
        }
        var node = this.nodes.get(element);
        if (!node) {
            throw new TreeError(this.user, "Tree element not found: " + element);
        }
        return this.model.getNodeLocation(node);
    };
    return ObjectTreeModel;
}());
export { ObjectTreeModel };
