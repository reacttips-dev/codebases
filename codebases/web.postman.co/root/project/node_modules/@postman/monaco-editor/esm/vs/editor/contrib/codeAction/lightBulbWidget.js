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
import { GlobalMouseMoveMonitor, standardMouseMoveMerger } from '../../../base/browser/globalMouseMoveMonitor.js';
import { Emitter } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import './lightBulbWidget.css';
import { TextModel } from '../../common/model/textModel.js';
import * as nls from '../../../nls.js';
import { IKeybindingService } from '../../../platform/keybinding/common/keybinding.js';
import { registerThemingParticipant } from '../../../platform/theme/common/themeService.js';
import { editorLightBulbForeground, editorLightBulbAutoFixForeground } from '../../../platform/theme/common/colorRegistry.js';
import { Gesture } from '../../../base/browser/touch.js';
var LightBulbState;
(function (LightBulbState) {
    LightBulbState.Hidden = { type: 0 /* Hidden */ };
    var Showing = /** @class */ (function () {
        function Showing(actions, trigger, editorPosition, widgetPosition) {
            this.actions = actions;
            this.trigger = trigger;
            this.editorPosition = editorPosition;
            this.widgetPosition = widgetPosition;
            this.type = 1 /* Showing */;
        }
        return Showing;
    }());
    LightBulbState.Showing = Showing;
})(LightBulbState || (LightBulbState = {}));
var LightBulbWidget = /** @class */ (function (_super) {
    __extends(LightBulbWidget, _super);
    function LightBulbWidget(_editor, _quickFixActionId, _preferredFixActionId, _keybindingService) {
        var _this = _super.call(this) || this;
        _this._editor = _editor;
        _this._quickFixActionId = _quickFixActionId;
        _this._preferredFixActionId = _preferredFixActionId;
        _this._keybindingService = _keybindingService;
        _this._onClick = _this._register(new Emitter());
        _this.onClick = _this._onClick.event;
        _this._state = LightBulbState.Hidden;
        _this._domNode = document.createElement('div');
        _this._domNode.className = 'codicon codicon-lightbulb';
        _this._editor.addContentWidget(_this);
        _this._register(_this._editor.onDidChangeModelContent(function (_) {
            // cancel when the line in question has been removed
            var editorModel = _this._editor.getModel();
            if (_this.state.type !== 1 /* Showing */ || !editorModel || _this.state.editorPosition.lineNumber >= editorModel.getLineCount()) {
                _this.hide();
            }
        }));
        Gesture.ignoreTarget(_this._domNode);
        _this._register(dom.addStandardDisposableGenericMouseDownListner(_this._domNode, function (e) {
            if (_this.state.type !== 1 /* Showing */) {
                return;
            }
            // Make sure that focus / cursor location is not lost when clicking widget icon
            _this._editor.focus();
            e.preventDefault();
            // a bit of extra work to make sure the menu
            // doesn't cover the line-text
            var _a = dom.getDomNodePagePosition(_this._domNode), top = _a.top, height = _a.height;
            var lineHeight = _this._editor.getOption(49 /* lineHeight */);
            var pad = Math.floor(lineHeight / 3);
            if (_this.state.widgetPosition.position !== null && _this.state.widgetPosition.position.lineNumber < _this.state.editorPosition.lineNumber) {
                pad += lineHeight;
            }
            _this._onClick.fire({
                x: e.posx,
                y: top + height + pad,
                actions: _this.state.actions,
                trigger: _this.state.trigger,
            });
        }));
        _this._register(dom.addDisposableListener(_this._domNode, 'mouseenter', function (e) {
            if ((e.buttons & 1) !== 1) {
                return;
            }
            // mouse enters lightbulb while the primary/left button
            // is being pressed -> hide the lightbulb and block future
            // showings until mouse is released
            _this.hide();
            var monitor = new GlobalMouseMoveMonitor();
            monitor.startMonitoring(e.target, e.buttons, standardMouseMoveMerger, function () { }, function () {
                monitor.dispose();
            });
        }));
        _this._register(_this._editor.onDidChangeConfiguration(function (e) {
            // hide when told to do so
            if (e.hasChanged(47 /* lightbulb */) && !_this._editor.getOption(47 /* lightbulb */).enabled) {
                _this.hide();
            }
        }));
        _this._updateLightBulbTitle();
        _this._register(_this._keybindingService.onDidUpdateKeybindings(_this._updateLightBulbTitle, _this));
        return _this;
    }
    LightBulbWidget.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this._editor.removeContentWidget(this);
    };
    LightBulbWidget.prototype.getId = function () {
        return 'LightBulbWidget';
    };
    LightBulbWidget.prototype.getDomNode = function () {
        return this._domNode;
    };
    LightBulbWidget.prototype.getPosition = function () {
        return this._state.type === 1 /* Showing */ ? this._state.widgetPosition : null;
    };
    LightBulbWidget.prototype.update = function (actions, trigger, atPosition) {
        var _this = this;
        if (actions.validActions.length <= 0) {
            return this.hide();
        }
        var options = this._editor.getOptions();
        if (!options.get(47 /* lightbulb */).enabled) {
            return this.hide();
        }
        var lineNumber = atPosition.lineNumber, column = atPosition.column;
        var model = this._editor.getModel();
        if (!model) {
            return this.hide();
        }
        var tabSize = model.getOptions().tabSize;
        var fontInfo = options.get(34 /* fontInfo */);
        var lineContent = model.getLineContent(lineNumber);
        var indent = TextModel.computeIndentLevel(lineContent, tabSize);
        var lineHasSpace = fontInfo.spaceWidth * indent > 22;
        var isFolded = function (lineNumber) {
            return lineNumber > 2 && _this._editor.getTopForLineNumber(lineNumber) === _this._editor.getTopForLineNumber(lineNumber - 1);
        };
        var effectiveLineNumber = lineNumber;
        if (!lineHasSpace) {
            if (lineNumber > 1 && !isFolded(lineNumber - 1)) {
                effectiveLineNumber -= 1;
            }
            else if (!isFolded(lineNumber + 1)) {
                effectiveLineNumber += 1;
            }
            else if (column * fontInfo.spaceWidth < 22) {
                // cannot show lightbulb above/below and showing
                // it inline would overlay the cursor...
                return this.hide();
            }
        }
        this.state = new LightBulbState.Showing(actions, trigger, atPosition, {
            position: { lineNumber: effectiveLineNumber, column: 1 },
            preference: LightBulbWidget._posPref
        });
        dom.toggleClass(this._domNode, 'codicon-lightbulb-autofix', actions.hasAutoFix);
        this._editor.layoutContentWidget(this);
    };
    LightBulbWidget.prototype.hide = function () {
        this.state = LightBulbState.Hidden;
        this._editor.layoutContentWidget(this);
    };
    Object.defineProperty(LightBulbWidget.prototype, "state", {
        get: function () { return this._state; },
        set: function (value) {
            this._state = value;
            this._updateLightBulbTitle();
        },
        enumerable: true,
        configurable: true
    });
    LightBulbWidget.prototype._updateLightBulbTitle = function () {
        if (this.state.type === 1 /* Showing */ && this.state.actions.hasAutoFix) {
            var preferredKb = this._keybindingService.lookupKeybinding(this._preferredFixActionId);
            if (preferredKb) {
                this.title = nls.localize('prefferedQuickFixWithKb', "Show Fixes. Preferred Fix Available ({0})", preferredKb.getLabel());
                return;
            }
        }
        var kb = this._keybindingService.lookupKeybinding(this._quickFixActionId);
        if (kb) {
            this.title = nls.localize('quickFixWithKb', "Show Fixes ({0})", kb.getLabel());
        }
        else {
            this.title = nls.localize('quickFix', "Show Fixes");
        }
    };
    Object.defineProperty(LightBulbWidget.prototype, "title", {
        set: function (value) {
            this._domNode.title = value;
        },
        enumerable: true,
        configurable: true
    });
    LightBulbWidget._posPref = [0 /* EXACT */];
    LightBulbWidget = __decorate([
        __param(3, IKeybindingService)
    ], LightBulbWidget);
    return LightBulbWidget;
}(Disposable));
export { LightBulbWidget };
registerThemingParticipant(function (theme, collector) {
    // Lightbulb Icon
    var editorLightBulbForegroundColor = theme.getColor(editorLightBulbForeground);
    if (editorLightBulbForegroundColor) {
        collector.addRule("\n\t\t.monaco-editor .contentWidgets .codicon-lightbulb {\n\t\t\tcolor: " + editorLightBulbForegroundColor + ";\n\t\t}");
    }
    // Lightbulb Auto Fix Icon
    var editorLightBulbAutoFixForegroundColor = theme.getColor(editorLightBulbAutoFixForeground);
    if (editorLightBulbAutoFixForegroundColor) {
        collector.addRule("\n\t\t.monaco-editor .contentWidgets .codicon-lightbulb-autofix {\n\t\t\tcolor: " + editorLightBulbAutoFixForegroundColor + ";\n\t\t}");
    }
});
