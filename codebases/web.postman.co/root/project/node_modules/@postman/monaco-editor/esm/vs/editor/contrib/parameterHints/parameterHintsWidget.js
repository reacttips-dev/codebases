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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import * as dom from '../../../base/browser/dom.js';
import { domEvent, stop } from '../../../base/browser/event.js';
import * as aria from '../../../base/browser/ui/aria/aria.js';
import { DomScrollableElement } from '../../../base/browser/ui/scrollbar/scrollableElement.js';
import { Event } from '../../../base/common/event.js';
import { Disposable, DisposableStore } from '../../../base/common/lifecycle.js';
import './parameterHints.css';
import { IModeService } from '../../common/services/modeService.js';
import { MarkdownRenderer } from '../markdown/markdownRenderer.js';
import { Context } from './provideSignatureHelp.js';
import * as nls from '../../../nls.js';
import { IContextKeyService } from '../../../platform/contextkey/common/contextkey.js';
import { IOpenerService } from '../../../platform/opener/common/opener.js';
import { editorHoverBackground, editorHoverBorder, textCodeBlockBackground, textLinkForeground, editorHoverForeground } from '../../../platform/theme/common/colorRegistry.js';
import { HIGH_CONTRAST, registerThemingParticipant } from '../../../platform/theme/common/themeService.js';
import { ParameterHintsModel } from './parameterHintsModel.js';
import { pad } from '../../../base/common/strings.js';
var $ = dom.$;
var ParameterHintsWidget = /** @class */ (function (_super) {
    __extends(ParameterHintsWidget, _super);
    function ParameterHintsWidget(editor, contextKeyService, openerService, modeService) {
        var _this = _super.call(this) || this;
        _this.editor = editor;
        _this.renderDisposeables = _this._register(new DisposableStore());
        _this.visible = false;
        _this.announcedLabel = null;
        // Editor.IContentWidget.allowEditorOverflow
        _this.allowEditorOverflow = true;
        _this.markdownRenderer = _this._register(new MarkdownRenderer(editor, modeService, openerService));
        _this.model = _this._register(new ParameterHintsModel(editor));
        _this.keyVisible = Context.Visible.bindTo(contextKeyService);
        _this.keyMultipleSignatures = Context.MultipleSignatures.bindTo(contextKeyService);
        _this._register(_this.model.onChangedHints(function (newParameterHints) {
            if (newParameterHints) {
                _this.show();
                _this.render(newParameterHints);
            }
            else {
                _this.hide();
            }
        }));
        return _this;
    }
    ParameterHintsWidget.prototype.createParamaterHintDOMNodes = function () {
        var _this = this;
        var element = $('.editor-widget.parameter-hints-widget');
        var wrapper = dom.append(element, $('.wrapper'));
        wrapper.tabIndex = -1;
        var controls = dom.append(wrapper, $('.controls'));
        var previous = dom.append(controls, $('.button.codicon.codicon-chevron-up'));
        var overloads = dom.append(controls, $('.overloads'));
        var next = dom.append(controls, $('.button.codicon.codicon-chevron-down'));
        var onPreviousClick = stop(domEvent(previous, 'click'));
        this._register(onPreviousClick(this.previous, this));
        var onNextClick = stop(domEvent(next, 'click'));
        this._register(onNextClick(this.next, this));
        var body = $('.body');
        var scrollbar = new DomScrollableElement(body, {});
        this._register(scrollbar);
        wrapper.appendChild(scrollbar.getDomNode());
        var signature = dom.append(body, $('.signature'));
        var docs = dom.append(body, $('.docs'));
        element.style.userSelect = 'text';
        this.domNodes = {
            element: element,
            signature: signature,
            overloads: overloads,
            docs: docs,
            scrollbar: scrollbar,
        };
        this.editor.addContentWidget(this);
        this.hide();
        this._register(this.editor.onDidChangeCursorSelection(function (e) {
            if (_this.visible) {
                _this.editor.layoutContentWidget(_this);
            }
        }));
        var updateFont = function () {
            if (!_this.domNodes) {
                return;
            }
            var fontInfo = _this.editor.getOption(34 /* fontInfo */);
            _this.domNodes.element.style.fontSize = fontInfo.fontSize + "px";
        };
        updateFont();
        this._register(Event.chain(this.editor.onDidChangeConfiguration.bind(this.editor))
            .filter(function (e) { return e.hasChanged(34 /* fontInfo */); })
            .on(updateFont, null));
        this._register(this.editor.onDidLayoutChange(function (e) { return _this.updateMaxHeight(); }));
        this.updateMaxHeight();
    };
    ParameterHintsWidget.prototype.show = function () {
        var _this = this;
        if (this.visible) {
            return;
        }
        if (!this.domNodes) {
            this.createParamaterHintDOMNodes();
        }
        this.keyVisible.set(true);
        this.visible = true;
        setTimeout(function () {
            if (_this.domNodes) {
                dom.addClass(_this.domNodes.element, 'visible');
            }
        }, 100);
        this.editor.layoutContentWidget(this);
    };
    ParameterHintsWidget.prototype.hide = function () {
        if (!this.visible) {
            return;
        }
        this.keyVisible.reset();
        this.visible = false;
        this.announcedLabel = null;
        if (this.domNodes) {
            dom.removeClass(this.domNodes.element, 'visible');
        }
        this.editor.layoutContentWidget(this);
    };
    ParameterHintsWidget.prototype.getPosition = function () {
        if (this.visible) {
            return {
                position: this.editor.getPosition(),
                preference: [1 /* ABOVE */, 2 /* BELOW */]
            };
        }
        return null;
    };
    ParameterHintsWidget.prototype.render = function (hints) {
        if (!this.domNodes) {
            return;
        }
        var multiple = hints.signatures.length > 1;
        dom.toggleClass(this.domNodes.element, 'multiple', multiple);
        this.keyMultipleSignatures.set(multiple);
        this.domNodes.signature.innerHTML = '';
        this.domNodes.docs.innerHTML = '';
        var signature = hints.signatures[hints.activeSignature];
        if (!signature) {
            return;
        }
        var code = dom.append(this.domNodes.signature, $('.code'));
        var hasParameters = signature.parameters.length > 0;
        var fontInfo = this.editor.getOption(34 /* fontInfo */);
        code.style.fontSize = fontInfo.fontSize + "px";
        code.style.fontFamily = fontInfo.fontFamily;
        if (!hasParameters) {
            var label = dom.append(code, $('span'));
            label.textContent = signature.label;
        }
        else {
            this.renderParameters(code, signature, hints.activeParameter);
        }
        this.renderDisposeables.clear();
        var activeParameter = signature.parameters[hints.activeParameter];
        if (activeParameter && activeParameter.documentation) {
            var documentation = $('span.documentation');
            if (typeof activeParameter.documentation === 'string') {
                documentation.textContent = activeParameter.documentation;
            }
            else {
                var renderedContents = this.markdownRenderer.render(activeParameter.documentation);
                dom.addClass(renderedContents.element, 'markdown-docs');
                this.renderDisposeables.add(renderedContents);
                documentation.appendChild(renderedContents.element);
            }
            dom.append(this.domNodes.docs, $('p', {}, documentation));
        }
        if (signature.documentation === undefined) { /** no op */ }
        else if (typeof signature.documentation === 'string') {
            dom.append(this.domNodes.docs, $('p', {}, signature.documentation));
        }
        else {
            var renderedContents = this.markdownRenderer.render(signature.documentation);
            dom.addClass(renderedContents.element, 'markdown-docs');
            this.renderDisposeables.add(renderedContents);
            dom.append(this.domNodes.docs, renderedContents.element);
        }
        var hasDocs = this.hasDocs(signature, activeParameter);
        dom.toggleClass(this.domNodes.signature, 'has-docs', hasDocs);
        dom.toggleClass(this.domNodes.docs, 'empty', !hasDocs);
        this.domNodes.overloads.textContent =
            pad(hints.activeSignature + 1, hints.signatures.length.toString().length) + '/' + hints.signatures.length;
        if (activeParameter) {
            var labelToAnnounce = this.getParameterLabel(signature, hints.activeParameter);
            // Select method gets called on every user type while parameter hints are visible.
            // We do not want to spam the user with same announcements, so we only announce if the current parameter changed.
            if (this.announcedLabel !== labelToAnnounce) {
                aria.alert(nls.localize('hint', "{0}, hint", labelToAnnounce));
                this.announcedLabel = labelToAnnounce;
            }
        }
        this.editor.layoutContentWidget(this);
        this.domNodes.scrollbar.scanDomNode();
    };
    ParameterHintsWidget.prototype.hasDocs = function (signature, activeParameter) {
        if (activeParameter && typeof (activeParameter.documentation) === 'string' && activeParameter.documentation.length > 0) {
            return true;
        }
        if (activeParameter && typeof (activeParameter.documentation) === 'object' && activeParameter.documentation.value.length > 0) {
            return true;
        }
        if (typeof (signature.documentation) === 'string' && signature.documentation.length > 0) {
            return true;
        }
        if (typeof (signature.documentation) === 'object' && signature.documentation.value.length > 0) {
            return true;
        }
        return false;
    };
    ParameterHintsWidget.prototype.renderParameters = function (parent, signature, currentParameter) {
        var _a = this.getParameterLabelOffsets(signature, currentParameter), start = _a[0], end = _a[1];
        var beforeSpan = document.createElement('span');
        beforeSpan.textContent = signature.label.substring(0, start);
        var paramSpan = document.createElement('span');
        paramSpan.textContent = signature.label.substring(start, end);
        paramSpan.className = 'parameter active';
        var afterSpan = document.createElement('span');
        afterSpan.textContent = signature.label.substring(end);
        dom.append(parent, beforeSpan, paramSpan, afterSpan);
    };
    ParameterHintsWidget.prototype.getParameterLabel = function (signature, paramIdx) {
        var param = signature.parameters[paramIdx];
        if (typeof param.label === 'string') {
            return param.label;
        }
        else {
            return signature.label.substring(param.label[0], param.label[1]);
        }
    };
    ParameterHintsWidget.prototype.getParameterLabelOffsets = function (signature, paramIdx) {
        var param = signature.parameters[paramIdx];
        if (!param) {
            return [0, 0];
        }
        else if (Array.isArray(param.label)) {
            return param.label;
        }
        else {
            var idx = signature.label.lastIndexOf(param.label);
            return idx >= 0
                ? [idx, idx + param.label.length]
                : [0, 0];
        }
    };
    ParameterHintsWidget.prototype.next = function () {
        this.editor.focus();
        this.model.next();
    };
    ParameterHintsWidget.prototype.previous = function () {
        this.editor.focus();
        this.model.previous();
    };
    ParameterHintsWidget.prototype.cancel = function () {
        this.model.cancel();
    };
    ParameterHintsWidget.prototype.getDomNode = function () {
        if (!this.domNodes) {
            this.createParamaterHintDOMNodes();
        }
        return this.domNodes.element;
    };
    ParameterHintsWidget.prototype.getId = function () {
        return ParameterHintsWidget.ID;
    };
    ParameterHintsWidget.prototype.trigger = function (context) {
        this.model.trigger(context, 0);
    };
    ParameterHintsWidget.prototype.updateMaxHeight = function () {
        if (!this.domNodes) {
            return;
        }
        var height = Math.max(this.editor.getLayoutInfo().height / 4, 250);
        var maxHeight = height + "px";
        this.domNodes.element.style.maxHeight = maxHeight;
        var wrapper = this.domNodes.element.getElementsByClassName('wrapper');
        if (wrapper.length) {
            wrapper[0].style.maxHeight = maxHeight;
        }
    };
    ParameterHintsWidget.ID = 'editor.widget.parameterHintsWidget';
    ParameterHintsWidget = __decorate([
        __param(1, IContextKeyService),
        __param(2, IOpenerService),
        __param(3, IModeService)
    ], ParameterHintsWidget);
    return ParameterHintsWidget;
}(Disposable));
export { ParameterHintsWidget };
registerThemingParticipant(function (theme, collector) {
    var border = theme.getColor(editorHoverBorder);
    if (border) {
        var borderWidth = theme.type === HIGH_CONTRAST ? 2 : 1;
        collector.addRule(".monaco-editor .parameter-hints-widget { border: " + borderWidth + "px solid " + border + "; }");
        collector.addRule(".monaco-editor .parameter-hints-widget.multiple .body { border-left: 1px solid " + border.transparent(0.5) + "; }");
        collector.addRule(".monaco-editor .parameter-hints-widget .signature.has-docs { border-bottom: 1px solid " + border.transparent(0.5) + "; }");
    }
    var background = theme.getColor(editorHoverBackground);
    if (background) {
        collector.addRule(".monaco-editor .parameter-hints-widget { background-color: " + background + "; }");
    }
    var link = theme.getColor(textLinkForeground);
    if (link) {
        collector.addRule(".monaco-editor .parameter-hints-widget a { color: " + link + "; }");
    }
    var foreground = theme.getColor(editorHoverForeground);
    if (foreground) {
        collector.addRule(".monaco-editor .parameter-hints-widget { color: " + foreground + "; }");
    }
    var codeBackground = theme.getColor(textCodeBlockBackground);
    if (codeBackground) {
        collector.addRule(".monaco-editor .parameter-hints-widget code { background-color: " + codeBackground + "; }");
    }
});
