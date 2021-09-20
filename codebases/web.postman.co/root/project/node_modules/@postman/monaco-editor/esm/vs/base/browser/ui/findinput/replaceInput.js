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
import './findInput.css';
import * as nls from '../../../../nls.js';
import * as dom from '../../dom.js';
import { HistoryInputBox } from '../inputbox/inputBox.js';
import { Widget } from '../widget.js';
import { Emitter } from '../../../common/event.js';
import { Checkbox } from '../checkbox/checkbox.js';
var NLS_DEFAULT_LABEL = nls.localize('defaultLabel', "input");
var NLS_PRESERVE_CASE_LABEL = nls.localize('label.preserveCaseCheckbox', "Preserve Case");
var PreserveCaseCheckbox = /** @class */ (function (_super) {
    __extends(PreserveCaseCheckbox, _super);
    function PreserveCaseCheckbox(opts) {
        return _super.call(this, {
            // TODO: does this need its own icon?
            actionClassName: 'codicon-preserve-case',
            title: NLS_PRESERVE_CASE_LABEL + opts.appendTitle,
            isChecked: opts.isChecked,
            inputActiveOptionBorder: opts.inputActiveOptionBorder,
            inputActiveOptionBackground: opts.inputActiveOptionBackground
        }) || this;
    }
    return PreserveCaseCheckbox;
}(Checkbox));
export { PreserveCaseCheckbox };
var ReplaceInput = /** @class */ (function (_super) {
    __extends(ReplaceInput, _super);
    function ReplaceInput(parent, contextViewProvider, _showOptionButtons, options) {
        var _this = _super.call(this) || this;
        _this._showOptionButtons = _showOptionButtons;
        _this.fixFocusOnOptionClickEnabled = true;
        _this.cachedOptionsWidth = 0;
        _this._onDidOptionChange = _this._register(new Emitter());
        _this.onDidOptionChange = _this._onDidOptionChange.event;
        _this._onKeyDown = _this._register(new Emitter());
        _this.onKeyDown = _this._onKeyDown.event;
        _this._onMouseDown = _this._register(new Emitter());
        _this._onInput = _this._register(new Emitter());
        _this._onKeyUp = _this._register(new Emitter());
        _this._onPreserveCaseKeyDown = _this._register(new Emitter());
        _this.onPreserveCaseKeyDown = _this._onPreserveCaseKeyDown.event;
        _this.contextViewProvider = contextViewProvider;
        _this.placeholder = options.placeholder || '';
        _this.validation = options.validation;
        _this.label = options.label || NLS_DEFAULT_LABEL;
        _this.inputActiveOptionBorder = options.inputActiveOptionBorder;
        _this.inputActiveOptionBackground = options.inputActiveOptionBackground;
        _this.inputBackground = options.inputBackground;
        _this.inputForeground = options.inputForeground;
        _this.inputBorder = options.inputBorder;
        _this.inputValidationInfoBorder = options.inputValidationInfoBorder;
        _this.inputValidationInfoBackground = options.inputValidationInfoBackground;
        _this.inputValidationInfoForeground = options.inputValidationInfoForeground;
        _this.inputValidationWarningBorder = options.inputValidationWarningBorder;
        _this.inputValidationWarningBackground = options.inputValidationWarningBackground;
        _this.inputValidationWarningForeground = options.inputValidationWarningForeground;
        _this.inputValidationErrorBorder = options.inputValidationErrorBorder;
        _this.inputValidationErrorBackground = options.inputValidationErrorBackground;
        _this.inputValidationErrorForeground = options.inputValidationErrorForeground;
        var history = options.history || [];
        var flexibleHeight = !!options.flexibleHeight;
        var flexibleWidth = !!options.flexibleWidth;
        var flexibleMaxHeight = options.flexibleMaxHeight;
        _this.domNode = document.createElement('div');
        dom.addClass(_this.domNode, 'monaco-findInput');
        _this.inputBox = _this._register(new HistoryInputBox(_this.domNode, _this.contextViewProvider, {
            ariaLabel: _this.label || '',
            placeholder: _this.placeholder || '',
            validationOptions: {
                validation: _this.validation
            },
            inputBackground: _this.inputBackground,
            inputForeground: _this.inputForeground,
            inputBorder: _this.inputBorder,
            inputValidationInfoBackground: _this.inputValidationInfoBackground,
            inputValidationInfoForeground: _this.inputValidationInfoForeground,
            inputValidationInfoBorder: _this.inputValidationInfoBorder,
            inputValidationWarningBackground: _this.inputValidationWarningBackground,
            inputValidationWarningForeground: _this.inputValidationWarningForeground,
            inputValidationWarningBorder: _this.inputValidationWarningBorder,
            inputValidationErrorBackground: _this.inputValidationErrorBackground,
            inputValidationErrorForeground: _this.inputValidationErrorForeground,
            inputValidationErrorBorder: _this.inputValidationErrorBorder,
            history: history,
            flexibleHeight: flexibleHeight,
            flexibleWidth: flexibleWidth,
            flexibleMaxHeight: flexibleMaxHeight
        }));
        _this.preserveCase = _this._register(new PreserveCaseCheckbox({
            appendTitle: '',
            isChecked: false,
            inputActiveOptionBorder: _this.inputActiveOptionBorder,
            inputActiveOptionBackground: _this.inputActiveOptionBackground,
        }));
        _this._register(_this.preserveCase.onChange(function (viaKeyboard) {
            _this._onDidOptionChange.fire(viaKeyboard);
            if (!viaKeyboard && _this.fixFocusOnOptionClickEnabled) {
                _this.inputBox.focus();
            }
            _this.validate();
        }));
        _this._register(_this.preserveCase.onKeyDown(function (e) {
            _this._onPreserveCaseKeyDown.fire(e);
        }));
        if (_this._showOptionButtons) {
            _this.cachedOptionsWidth = _this.preserveCase.width();
        }
        else {
            _this.cachedOptionsWidth = 0;
        }
        // Arrow-Key support to navigate between options
        var indexes = [_this.preserveCase.domNode];
        _this.onkeydown(_this.domNode, function (event) {
            if (event.equals(15 /* LeftArrow */) || event.equals(17 /* RightArrow */) || event.equals(9 /* Escape */)) {
                var index = indexes.indexOf(document.activeElement);
                if (index >= 0) {
                    var newIndex = -1;
                    if (event.equals(17 /* RightArrow */)) {
                        newIndex = (index + 1) % indexes.length;
                    }
                    else if (event.equals(15 /* LeftArrow */)) {
                        if (index === 0) {
                            newIndex = indexes.length - 1;
                        }
                        else {
                            newIndex = index - 1;
                        }
                    }
                    if (event.equals(9 /* Escape */)) {
                        indexes[index].blur();
                    }
                    else if (newIndex >= 0) {
                        indexes[newIndex].focus();
                    }
                    dom.EventHelper.stop(event, true);
                }
            }
        });
        var controls = document.createElement('div');
        controls.className = 'controls';
        controls.style.display = _this._showOptionButtons ? 'block' : 'none';
        controls.appendChild(_this.preserveCase.domNode);
        _this.domNode.appendChild(controls);
        if (parent) {
            parent.appendChild(_this.domNode);
        }
        _this.onkeydown(_this.inputBox.inputElement, function (e) { return _this._onKeyDown.fire(e); });
        _this.onkeyup(_this.inputBox.inputElement, function (e) { return _this._onKeyUp.fire(e); });
        _this.oninput(_this.inputBox.inputElement, function (e) { return _this._onInput.fire(); });
        _this.onmousedown(_this.inputBox.inputElement, function (e) { return _this._onMouseDown.fire(e); });
        return _this;
    }
    ReplaceInput.prototype.enable = function () {
        dom.removeClass(this.domNode, 'disabled');
        this.inputBox.enable();
        this.preserveCase.enable();
    };
    ReplaceInput.prototype.disable = function () {
        dom.addClass(this.domNode, 'disabled');
        this.inputBox.disable();
        this.preserveCase.disable();
    };
    ReplaceInput.prototype.setEnabled = function (enabled) {
        if (enabled) {
            this.enable();
        }
        else {
            this.disable();
        }
    };
    ReplaceInput.prototype.style = function (styles) {
        this.inputActiveOptionBorder = styles.inputActiveOptionBorder;
        this.inputActiveOptionBackground = styles.inputActiveOptionBackground;
        this.inputBackground = styles.inputBackground;
        this.inputForeground = styles.inputForeground;
        this.inputBorder = styles.inputBorder;
        this.inputValidationInfoBackground = styles.inputValidationInfoBackground;
        this.inputValidationInfoForeground = styles.inputValidationInfoForeground;
        this.inputValidationInfoBorder = styles.inputValidationInfoBorder;
        this.inputValidationWarningBackground = styles.inputValidationWarningBackground;
        this.inputValidationWarningForeground = styles.inputValidationWarningForeground;
        this.inputValidationWarningBorder = styles.inputValidationWarningBorder;
        this.inputValidationErrorBackground = styles.inputValidationErrorBackground;
        this.inputValidationErrorForeground = styles.inputValidationErrorForeground;
        this.inputValidationErrorBorder = styles.inputValidationErrorBorder;
        this.applyStyles();
    };
    ReplaceInput.prototype.applyStyles = function () {
        if (this.domNode) {
            var checkBoxStyles = {
                inputActiveOptionBorder: this.inputActiveOptionBorder,
                inputActiveOptionBackground: this.inputActiveOptionBackground,
            };
            this.preserveCase.style(checkBoxStyles);
            var inputBoxStyles = {
                inputBackground: this.inputBackground,
                inputForeground: this.inputForeground,
                inputBorder: this.inputBorder,
                inputValidationInfoBackground: this.inputValidationInfoBackground,
                inputValidationInfoForeground: this.inputValidationInfoForeground,
                inputValidationInfoBorder: this.inputValidationInfoBorder,
                inputValidationWarningBackground: this.inputValidationWarningBackground,
                inputValidationWarningForeground: this.inputValidationWarningForeground,
                inputValidationWarningBorder: this.inputValidationWarningBorder,
                inputValidationErrorBackground: this.inputValidationErrorBackground,
                inputValidationErrorForeground: this.inputValidationErrorForeground,
                inputValidationErrorBorder: this.inputValidationErrorBorder
            };
            this.inputBox.style(inputBoxStyles);
        }
    };
    ReplaceInput.prototype.select = function () {
        this.inputBox.select();
    };
    ReplaceInput.prototype.focus = function () {
        this.inputBox.focus();
    };
    ReplaceInput.prototype.getPreserveCase = function () {
        return this.preserveCase.checked;
    };
    ReplaceInput.prototype.setPreserveCase = function (value) {
        this.preserveCase.checked = value;
    };
    ReplaceInput.prototype.focusOnPreserve = function () {
        this.preserveCase.focus();
    };
    ReplaceInput.prototype.validate = function () {
        if (this.inputBox) {
            this.inputBox.validate();
        }
    };
    Object.defineProperty(ReplaceInput.prototype, "width", {
        set: function (newWidth) {
            this.inputBox.paddingRight = this.cachedOptionsWidth;
            this.inputBox.width = newWidth;
            this.domNode.style.width = newWidth + 'px';
        },
        enumerable: true,
        configurable: true
    });
    ReplaceInput.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
    };
    return ReplaceInput;
}(Widget));
export { ReplaceInput };
