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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AbstractTree } from './abstractTree.js';
import { ObjectTreeModel } from './objectTreeModel.js';
import { CompressibleObjectTreeModel } from './compressedObjectTreeModel.js';
import { memoize } from '../../../common/decorators.js';
var ObjectTree = /** @class */ (function (_super) {
    __extends(ObjectTree, _super);
    function ObjectTree(user, container, delegate, renderers, options) {
        if (options === void 0) { options = {}; }
        return _super.call(this, user, container, delegate, renderers, options) || this;
    }
    Object.defineProperty(ObjectTree.prototype, "onDidChangeCollapseState", {
        get: function () { return this.model.onDidChangeCollapseState; },
        enumerable: true,
        configurable: true
    });
    ObjectTree.prototype.setChildren = function (element, children) {
        this.model.setChildren(element, children);
    };
    ObjectTree.prototype.rerender = function (element) {
        if (element === undefined) {
            this.view.rerender();
            return;
        }
        this.model.rerender(element);
    };
    ObjectTree.prototype.hasElement = function (element) {
        return this.model.has(element);
    };
    ObjectTree.prototype.createModel = function (user, view, options) {
        return new ObjectTreeModel(user, view, options);
    };
    return ObjectTree;
}(AbstractTree));
export { ObjectTree };
var CompressibleRenderer = /** @class */ (function () {
    function CompressibleRenderer(_compressedTreeNodeProvider, renderer) {
        this._compressedTreeNodeProvider = _compressedTreeNodeProvider;
        this.renderer = renderer;
        this.templateId = renderer.templateId;
        if (renderer.onDidChangeTwistieState) {
            this.onDidChangeTwistieState = renderer.onDidChangeTwistieState;
        }
    }
    Object.defineProperty(CompressibleRenderer.prototype, "compressedTreeNodeProvider", {
        get: function () {
            return this._compressedTreeNodeProvider();
        },
        enumerable: true,
        configurable: true
    });
    CompressibleRenderer.prototype.renderTemplate = function (container) {
        var data = this.renderer.renderTemplate(container);
        return { compressedTreeNode: undefined, data: data };
    };
    CompressibleRenderer.prototype.renderElement = function (node, index, templateData, height) {
        var compressedTreeNode = this.compressedTreeNodeProvider.getCompressedTreeNode(node.element);
        if (compressedTreeNode.element.elements.length === 1) {
            templateData.compressedTreeNode = undefined;
            this.renderer.renderElement(node, index, templateData.data, height);
        }
        else {
            templateData.compressedTreeNode = compressedTreeNode;
            this.renderer.renderCompressedElements(compressedTreeNode, index, templateData.data, height);
        }
    };
    CompressibleRenderer.prototype.disposeElement = function (node, index, templateData, height) {
        if (templateData.compressedTreeNode) {
            if (this.renderer.disposeCompressedElements) {
                this.renderer.disposeCompressedElements(templateData.compressedTreeNode, index, templateData.data, height);
            }
        }
        else {
            if (this.renderer.disposeElement) {
                this.renderer.disposeElement(node, index, templateData.data, height);
            }
        }
    };
    CompressibleRenderer.prototype.disposeTemplate = function (templateData) {
        this.renderer.disposeTemplate(templateData.data);
    };
    CompressibleRenderer.prototype.renderTwistie = function (element, twistieElement) {
        if (this.renderer.renderTwistie) {
            this.renderer.renderTwistie(element, twistieElement);
        }
    };
    __decorate([
        memoize
    ], CompressibleRenderer.prototype, "compressedTreeNodeProvider", null);
    return CompressibleRenderer;
}());
function asObjectTreeOptions(compressedTreeNodeProvider, options) {
    return options && __assign(__assign({}, options), { keyboardNavigationLabelProvider: options.keyboardNavigationLabelProvider && {
            getKeyboardNavigationLabel: function (e) {
                var compressedTreeNode;
                try {
                    compressedTreeNode = compressedTreeNodeProvider().getCompressedTreeNode(e);
                }
                catch (_a) {
                    return options.keyboardNavigationLabelProvider.getKeyboardNavigationLabel(e);
                }
                if (compressedTreeNode.element.elements.length === 1) {
                    return options.keyboardNavigationLabelProvider.getKeyboardNavigationLabel(e);
                }
                else {
                    return options.keyboardNavigationLabelProvider.getCompressedNodeKeyboardNavigationLabel(compressedTreeNode.element.elements);
                }
            }
        } });
}
var CompressibleObjectTree = /** @class */ (function (_super) {
    __extends(CompressibleObjectTree, _super);
    function CompressibleObjectTree(user, container, delegate, renderers, options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        var compressedTreeNodeProvider = function () { return _this; };
        var compressibleRenderers = renderers.map(function (r) { return new CompressibleRenderer(compressedTreeNodeProvider, r); });
        _this = _super.call(this, user, container, delegate, compressibleRenderers, asObjectTreeOptions(compressedTreeNodeProvider, options)) || this;
        return _this;
    }
    CompressibleObjectTree.prototype.setChildren = function (element, children) {
        this.model.setChildren(element, children);
    };
    CompressibleObjectTree.prototype.createModel = function (user, view, options) {
        return new CompressibleObjectTreeModel(user, view, options);
    };
    CompressibleObjectTree.prototype.updateOptions = function (optionsUpdate) {
        if (optionsUpdate === void 0) { optionsUpdate = {}; }
        _super.prototype.updateOptions.call(this, optionsUpdate);
        if (typeof optionsUpdate.compressionEnabled !== 'undefined') {
            this.model.setCompressionEnabled(optionsUpdate.compressionEnabled);
        }
    };
    CompressibleObjectTree.prototype.getCompressedTreeNode = function (element) {
        if (element === void 0) { element = null; }
        return this.model.getCompressedTreeNode(element);
    };
    return CompressibleObjectTree;
}(ObjectTree));
export { CompressibleObjectTree };
