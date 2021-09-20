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
import './iconlabel.css';
import * as dom from '../../dom.js';
import { HighlightedLabel } from '../highlightedlabel/highlightedLabel.js';
import { Disposable } from '../../../common/lifecycle.js';
import { Range } from '../../../common/range.js';
import { equals } from '../../../common/objects.js';
var FastLabelNode = /** @class */ (function () {
    function FastLabelNode(_element) {
        this._element = _element;
    }
    Object.defineProperty(FastLabelNode.prototype, "element", {
        get: function () {
            return this._element;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FastLabelNode.prototype, "textContent", {
        set: function (content) {
            if (this.disposed || content === this._textContent) {
                return;
            }
            this._textContent = content;
            this._element.textContent = content;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FastLabelNode.prototype, "className", {
        set: function (className) {
            if (this.disposed || className === this._className) {
                return;
            }
            this._className = className;
            this._element.className = className;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FastLabelNode.prototype, "title", {
        set: function (title) {
            if (this.disposed || title === this._title) {
                return;
            }
            this._title = title;
            if (this._title) {
                this._element.title = title;
            }
            else {
                this._element.removeAttribute('title');
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FastLabelNode.prototype, "empty", {
        set: function (empty) {
            if (this.disposed || empty === this._empty) {
                return;
            }
            this._empty = empty;
            this._element.style.marginLeft = empty ? '0' : '';
        },
        enumerable: true,
        configurable: true
    });
    FastLabelNode.prototype.dispose = function () {
        this.disposed = true;
    };
    return FastLabelNode;
}());
var IconLabel = /** @class */ (function (_super) {
    __extends(IconLabel, _super);
    function IconLabel(container, options) {
        var _this = _super.call(this) || this;
        _this.domNode = _this._register(new FastLabelNode(dom.append(container, dom.$('.monaco-icon-label'))));
        var labelContainer = dom.append(_this.domNode.element, dom.$('.monaco-icon-label-container'));
        var nameContainer = dom.append(labelContainer, dom.$('span.monaco-icon-name-container'));
        _this.descriptionContainer = _this._register(new FastLabelNode(dom.append(labelContainer, dom.$('span.monaco-icon-description-container'))));
        if (options === null || options === void 0 ? void 0 : options.supportHighlights) {
            _this.nameNode = new LabelWithHighlights(nameContainer, !!options.supportCodicons);
        }
        else {
            _this.nameNode = new Label(nameContainer);
        }
        if (options === null || options === void 0 ? void 0 : options.supportDescriptionHighlights) {
            _this.descriptionNodeFactory = function () { return new HighlightedLabel(dom.append(_this.descriptionContainer.element, dom.$('span.label-description')), !!options.supportCodicons); };
        }
        else {
            _this.descriptionNodeFactory = function () { return _this._register(new FastLabelNode(dom.append(_this.descriptionContainer.element, dom.$('span.label-description')))); };
        }
        return _this;
    }
    IconLabel.prototype.setLabel = function (label, description, options) {
        var classes = ['monaco-icon-label'];
        if (options) {
            if (options.extraClasses) {
                classes.push.apply(classes, options.extraClasses);
            }
            if (options.italic) {
                classes.push('italic');
            }
        }
        this.domNode.className = classes.join(' ');
        this.domNode.title = (options === null || options === void 0 ? void 0 : options.title) || '';
        this.nameNode.setLabel(label, options);
        if (description || this.descriptionNode) {
            if (!this.descriptionNode) {
                this.descriptionNode = this.descriptionNodeFactory(); // description node is created lazily on demand
            }
            if (this.descriptionNode instanceof HighlightedLabel) {
                this.descriptionNode.set(description || '', options ? options.descriptionMatches : undefined);
                if (options === null || options === void 0 ? void 0 : options.descriptionTitle) {
                    this.descriptionNode.element.title = options.descriptionTitle;
                }
                else {
                    this.descriptionNode.element.removeAttribute('title');
                }
            }
            else {
                this.descriptionNode.textContent = description || '';
                this.descriptionNode.title = (options === null || options === void 0 ? void 0 : options.descriptionTitle) || '';
                this.descriptionNode.empty = !description;
            }
        }
    };
    return IconLabel;
}(Disposable));
export { IconLabel };
var Label = /** @class */ (function () {
    function Label(container) {
        this.container = container;
        this.label = undefined;
        this.singleLabel = undefined;
    }
    Label.prototype.setLabel = function (label, options) {
        if (this.label === label && equals(this.options, options)) {
            return;
        }
        this.label = label;
        this.options = options;
        if (typeof label === 'string') {
            if (!this.singleLabel) {
                this.container.innerHTML = '';
                dom.removeClass(this.container, 'multiple');
                this.singleLabel = dom.append(this.container, dom.$('a.label-name', { id: options === null || options === void 0 ? void 0 : options.domId }));
            }
            this.singleLabel.textContent = label;
        }
        else {
            this.container.innerHTML = '';
            dom.addClass(this.container, 'multiple');
            this.singleLabel = undefined;
            for (var i = 0; i < label.length; i++) {
                var l = label[i];
                var id = (options === null || options === void 0 ? void 0 : options.domId) && (options === null || options === void 0 ? void 0 : options.domId) + "_" + i;
                dom.append(this.container, dom.$('a.label-name', { id: id, 'data-icon-label-count': label.length, 'data-icon-label-index': i }, l));
                if (i < label.length - 1) {
                    dom.append(this.container, dom.$('span.label-separator', undefined, (options === null || options === void 0 ? void 0 : options.separator) || '/'));
                }
            }
        }
    };
    return Label;
}());
function splitMatches(labels, separator, matches) {
    if (!matches) {
        return undefined;
    }
    var labelStart = 0;
    return labels.map(function (label) {
        var labelRange = { start: labelStart, end: labelStart + label.length };
        var result = matches
            .map(function (match) { return Range.intersect(labelRange, match); })
            .filter(function (range) { return !Range.isEmpty(range); })
            .map(function (_a) {
            var start = _a.start, end = _a.end;
            return ({ start: start - labelStart, end: end - labelStart });
        });
        labelStart = labelRange.end + separator.length;
        return result;
    });
}
var LabelWithHighlights = /** @class */ (function () {
    function LabelWithHighlights(container, supportCodicons) {
        this.container = container;
        this.supportCodicons = supportCodicons;
        this.label = undefined;
        this.singleLabel = undefined;
    }
    LabelWithHighlights.prototype.setLabel = function (label, options) {
        if (this.label === label && equals(this.options, options)) {
            return;
        }
        this.label = label;
        this.options = options;
        if (typeof label === 'string') {
            if (!this.singleLabel) {
                this.container.innerHTML = '';
                dom.removeClass(this.container, 'multiple');
                this.singleLabel = new HighlightedLabel(dom.append(this.container, dom.$('a.label-name', { id: options === null || options === void 0 ? void 0 : options.domId })), this.supportCodicons);
            }
            this.singleLabel.set(label, options === null || options === void 0 ? void 0 : options.matches, options === null || options === void 0 ? void 0 : options.title, options === null || options === void 0 ? void 0 : options.labelEscapeNewLines);
        }
        else {
            this.container.innerHTML = '';
            dom.addClass(this.container, 'multiple');
            this.singleLabel = undefined;
            var separator = (options === null || options === void 0 ? void 0 : options.separator) || '/';
            var matches = splitMatches(label, separator, options === null || options === void 0 ? void 0 : options.matches);
            for (var i = 0; i < label.length; i++) {
                var l = label[i];
                var m = matches ? matches[i] : undefined;
                var id = (options === null || options === void 0 ? void 0 : options.domId) && (options === null || options === void 0 ? void 0 : options.domId) + "_" + i;
                var name_1 = dom.$('a.label-name', { id: id, 'data-icon-label-count': label.length, 'data-icon-label-index': i });
                var highlightedLabel = new HighlightedLabel(dom.append(this.container, name_1), this.supportCodicons);
                highlightedLabel.set(l, m, options === null || options === void 0 ? void 0 : options.title, options === null || options === void 0 ? void 0 : options.labelEscapeNewLines);
                if (i < label.length - 1) {
                    dom.append(name_1, dom.$('span.label-separator', undefined, separator));
                }
            }
        }
    };
    return LabelWithHighlights;
}());
