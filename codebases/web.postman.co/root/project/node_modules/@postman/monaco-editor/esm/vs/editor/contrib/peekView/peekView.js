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
import './media/peekViewWidget.css';
import * as dom from '../../../base/browser/dom.js';
import { ActionBar } from '../../../base/browser/ui/actionbar/actionbar.js';
import { Action } from '../../../base/common/actions.js';
import { Color } from '../../../base/common/color.js';
import { Emitter } from '../../../base/common/event.js';
import * as objects from '../../../base/common/objects.js';
import * as strings from '../../../base/common/strings.js';
import { ICodeEditorService } from '../../browser/services/codeEditorService.js';
import { EmbeddedCodeEditorWidget } from '../../browser/widget/embeddedCodeEditorWidget.js';
import { ZoneWidget } from '../zoneWidget/zoneWidget.js';
import * as nls from '../../../nls.js';
import { RawContextKey, IContextKeyService } from '../../../platform/contextkey/common/contextkey.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { registerSingleton } from '../../../platform/instantiation/common/extensions.js';
import { registerEditorContribution } from '../../browser/editorExtensions.js';
import { registerColor, contrastBorder, activeContrastBorder } from '../../../platform/theme/common/colorRegistry.js';
export var IPeekViewService = createDecorator('IPeekViewService');
registerSingleton(IPeekViewService, /** @class */ (function () {
    function class_1() {
        this._widgets = new Map();
    }
    class_1.prototype.addExclusiveWidget = function (editor, widget) {
        var _this = this;
        var existing = this._widgets.get(editor);
        if (existing) {
            existing.listener.dispose();
            existing.widget.dispose();
        }
        var remove = function () {
            var data = _this._widgets.get(editor);
            if (data && data.widget === widget) {
                data.listener.dispose();
                _this._widgets.delete(editor);
            }
        };
        this._widgets.set(editor, { widget: widget, listener: widget.onDidClose(remove) });
    };
    return class_1;
}()));
export var PeekContext;
(function (PeekContext) {
    PeekContext.inPeekEditor = new RawContextKey('inReferenceSearchEditor', true);
    PeekContext.notInPeekEditor = PeekContext.inPeekEditor.toNegated();
})(PeekContext || (PeekContext = {}));
var PeekContextController = /** @class */ (function () {
    function PeekContextController(editor, contextKeyService) {
        if (editor instanceof EmbeddedCodeEditorWidget) {
            PeekContext.inPeekEditor.bindTo(contextKeyService);
        }
    }
    PeekContextController.prototype.dispose = function () { };
    PeekContextController.ID = 'editor.contrib.referenceController';
    PeekContextController = __decorate([
        __param(1, IContextKeyService)
    ], PeekContextController);
    return PeekContextController;
}());
registerEditorContribution(PeekContextController.ID, PeekContextController);
export function getOuterEditor(accessor) {
    var editor = accessor.get(ICodeEditorService).getFocusedCodeEditor();
    if (editor instanceof EmbeddedCodeEditorWidget) {
        return editor.getParentEditor();
    }
    return editor;
}
var defaultOptions = {
    headerBackgroundColor: Color.white,
    primaryHeadingColor: Color.fromHex('#333333'),
    secondaryHeadingColor: Color.fromHex('#6c6c6cb3')
};
var PeekViewWidget = /** @class */ (function (_super) {
    __extends(PeekViewWidget, _super);
    function PeekViewWidget(editor, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, editor, options) || this;
        _this._onDidClose = new Emitter();
        _this.onDidClose = _this._onDidClose.event;
        objects.mixin(_this.options, defaultOptions, false);
        return _this;
    }
    PeekViewWidget.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this._onDidClose.fire(this);
    };
    PeekViewWidget.prototype.style = function (styles) {
        var options = this.options;
        if (styles.headerBackgroundColor) {
            options.headerBackgroundColor = styles.headerBackgroundColor;
        }
        if (styles.primaryHeadingColor) {
            options.primaryHeadingColor = styles.primaryHeadingColor;
        }
        if (styles.secondaryHeadingColor) {
            options.secondaryHeadingColor = styles.secondaryHeadingColor;
        }
        _super.prototype.style.call(this, styles);
    };
    PeekViewWidget.prototype._applyStyles = function () {
        _super.prototype._applyStyles.call(this);
        var options = this.options;
        if (this._headElement && options.headerBackgroundColor) {
            this._headElement.style.backgroundColor = options.headerBackgroundColor.toString();
        }
        if (this._primaryHeading && options.primaryHeadingColor) {
            this._primaryHeading.style.color = options.primaryHeadingColor.toString();
        }
        if (this._secondaryHeading && options.secondaryHeadingColor) {
            this._secondaryHeading.style.color = options.secondaryHeadingColor.toString();
        }
        if (this._bodyElement && options.frameColor) {
            this._bodyElement.style.borderColor = options.frameColor.toString();
        }
    };
    PeekViewWidget.prototype._fillContainer = function (container) {
        this.setCssClass('peekview-widget');
        this._headElement = dom.$('.head');
        this._bodyElement = dom.$('.body');
        this._fillHead(this._headElement);
        this._fillBody(this._bodyElement);
        container.appendChild(this._headElement);
        container.appendChild(this._bodyElement);
    };
    PeekViewWidget.prototype._fillHead = function (container) {
        var _this = this;
        var titleElement = dom.$('.peekview-title');
        dom.append(this._headElement, titleElement);
        dom.addStandardDisposableListener(titleElement, 'click', function (event) { return _this._onTitleClick(event); });
        this._fillTitleIcon(titleElement);
        this._primaryHeading = dom.$('span.filename');
        this._secondaryHeading = dom.$('span.dirname');
        this._metaHeading = dom.$('span.meta');
        dom.append(titleElement, this._primaryHeading, this._secondaryHeading, this._metaHeading);
        var actionsContainer = dom.$('.peekview-actions');
        dom.append(this._headElement, actionsContainer);
        var actionBarOptions = this._getActionBarOptions();
        this._actionbarWidget = new ActionBar(actionsContainer, actionBarOptions);
        this._disposables.add(this._actionbarWidget);
        this._actionbarWidget.push(new Action('peekview.close', nls.localize('label.close', "Close"), 'codicon-close', true, function () {
            _this.dispose();
            return Promise.resolve();
        }), { label: false, icon: true });
    };
    PeekViewWidget.prototype._fillTitleIcon = function (container) {
    };
    PeekViewWidget.prototype._getActionBarOptions = function () {
        return {};
    };
    PeekViewWidget.prototype._onTitleClick = function (event) {
        // implement me
    };
    PeekViewWidget.prototype.setTitle = function (primaryHeading, secondaryHeading) {
        if (this._primaryHeading && this._secondaryHeading) {
            this._primaryHeading.innerHTML = strings.escape(primaryHeading);
            this._primaryHeading.setAttribute('aria-label', primaryHeading);
            if (secondaryHeading) {
                this._secondaryHeading.innerHTML = strings.escape(secondaryHeading);
            }
            else {
                dom.clearNode(this._secondaryHeading);
            }
        }
    };
    PeekViewWidget.prototype.setMetaTitle = function (value) {
        if (this._metaHeading) {
            if (value) {
                this._metaHeading.innerHTML = strings.escape(value);
                dom.show(this._metaHeading);
            }
            else {
                dom.hide(this._metaHeading);
            }
        }
    };
    PeekViewWidget.prototype._doLayout = function (heightInPixel, widthInPixel) {
        if (!this._isShowing && heightInPixel < 0) {
            // Looks like the view zone got folded away!
            this.dispose();
            return;
        }
        var headHeight = Math.ceil(this.editor.getOption(49 /* lineHeight */) * 1.2);
        var bodyHeight = Math.round(heightInPixel - (headHeight + 2 /* the border-top/bottom width*/));
        this._doLayoutHead(headHeight, widthInPixel);
        this._doLayoutBody(bodyHeight, widthInPixel);
    };
    PeekViewWidget.prototype._doLayoutHead = function (heightInPixel, widthInPixel) {
        if (this._headElement) {
            this._headElement.style.height = heightInPixel + "px";
            this._headElement.style.lineHeight = this._headElement.style.height;
        }
    };
    PeekViewWidget.prototype._doLayoutBody = function (heightInPixel, widthInPixel) {
        if (this._bodyElement) {
            this._bodyElement.style.height = heightInPixel + "px";
        }
    };
    return PeekViewWidget;
}(ZoneWidget));
export { PeekViewWidget };
export var peekViewTitleBackground = registerColor('peekViewTitle.background', { dark: '#1E1E1E', light: '#FFFFFF', hc: '#0C141F' }, nls.localize('peekViewTitleBackground', 'Background color of the peek view title area.'));
export var peekViewTitleForeground = registerColor('peekViewTitleLabel.foreground', { dark: '#FFFFFF', light: '#333333', hc: '#FFFFFF' }, nls.localize('peekViewTitleForeground', 'Color of the peek view title.'));
export var peekViewTitleInfoForeground = registerColor('peekViewTitleDescription.foreground', { dark: '#ccccccb3', light: '#616161e6', hc: '#FFFFFF99' }, nls.localize('peekViewTitleInfoForeground', 'Color of the peek view title info.'));
export var peekViewBorder = registerColor('peekView.border', { dark: '#007acc', light: '#007acc', hc: contrastBorder }, nls.localize('peekViewBorder', 'Color of the peek view borders and arrow.'));
export var peekViewResultsBackground = registerColor('peekViewResult.background', { dark: '#252526', light: '#F3F3F3', hc: Color.black }, nls.localize('peekViewResultsBackground', 'Background color of the peek view result list.'));
export var peekViewResultsMatchForeground = registerColor('peekViewResult.lineForeground', { dark: '#bbbbbb', light: '#646465', hc: Color.white }, nls.localize('peekViewResultsMatchForeground', 'Foreground color for line nodes in the peek view result list.'));
export var peekViewResultsFileForeground = registerColor('peekViewResult.fileForeground', { dark: Color.white, light: '#1E1E1E', hc: Color.white }, nls.localize('peekViewResultsFileForeground', 'Foreground color for file nodes in the peek view result list.'));
export var peekViewResultsSelectionBackground = registerColor('peekViewResult.selectionBackground', { dark: '#3399ff33', light: '#3399ff33', hc: null }, nls.localize('peekViewResultsSelectionBackground', 'Background color of the selected entry in the peek view result list.'));
export var peekViewResultsSelectionForeground = registerColor('peekViewResult.selectionForeground', { dark: Color.white, light: '#6C6C6C', hc: Color.white }, nls.localize('peekViewResultsSelectionForeground', 'Foreground color of the selected entry in the peek view result list.'));
export var peekViewEditorBackground = registerColor('peekViewEditor.background', { dark: '#001F33', light: '#F2F8FC', hc: Color.black }, nls.localize('peekViewEditorBackground', 'Background color of the peek view editor.'));
export var peekViewEditorGutterBackground = registerColor('peekViewEditorGutter.background', { dark: peekViewEditorBackground, light: peekViewEditorBackground, hc: peekViewEditorBackground }, nls.localize('peekViewEditorGutterBackground', 'Background color of the gutter in the peek view editor.'));
export var peekViewResultsMatchHighlight = registerColor('peekViewResult.matchHighlightBackground', { dark: '#ea5c004d', light: '#ea5c004d', hc: null }, nls.localize('peekViewResultsMatchHighlight', 'Match highlight color in the peek view result list.'));
export var peekViewEditorMatchHighlight = registerColor('peekViewEditor.matchHighlightBackground', { dark: '#ff8f0099', light: '#f5d802de', hc: null }, nls.localize('peekViewEditorMatchHighlight', 'Match highlight color in the peek view editor.'));
export var peekViewEditorMatchHighlightBorder = registerColor('peekViewEditor.matchHighlightBorder', { dark: null, light: null, hc: activeContrastBorder }, nls.localize('peekViewEditorMatchHighlightBorder', 'Match highlight border in the peek view editor.'));
