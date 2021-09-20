/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as dom from './dom.js';
import * as platform from '../common/platform.js';
import * as browser from './browser.js';
import { IframeUtils } from './iframe.js';
import { StandardMouseEvent } from './mouseEvent.js';
import { DisposableStore } from '../common/lifecycle.js';
import { BrowserFeatures } from './canIUse.js';
export function standardMouseMoveMerger(lastEvent, currentEvent) {
    var ev = new StandardMouseEvent(currentEvent);
    ev.preventDefault();
    return {
        leftButton: ev.leftButton,
        buttons: ev.buttons,
        posx: ev.posx,
        posy: ev.posy
    };
}
var GlobalMouseMoveMonitor = /** @class */ (function () {
    function GlobalMouseMoveMonitor() {
        this._hooks = new DisposableStore();
        this._mouseMoveEventMerger = null;
        this._mouseMoveCallback = null;
        this._onStopCallback = null;
    }
    GlobalMouseMoveMonitor.prototype.dispose = function () {
        this.stopMonitoring(false);
        this._hooks.dispose();
    };
    GlobalMouseMoveMonitor.prototype.stopMonitoring = function (invokeStopCallback) {
        if (!this.isMonitoring()) {
            // Not monitoring
            return;
        }
        // Unhook
        this._hooks.clear();
        this._mouseMoveEventMerger = null;
        this._mouseMoveCallback = null;
        var onStopCallback = this._onStopCallback;
        this._onStopCallback = null;
        if (invokeStopCallback && onStopCallback) {
            onStopCallback();
        }
    };
    GlobalMouseMoveMonitor.prototype.isMonitoring = function () {
        return !!this._mouseMoveEventMerger;
    };
    GlobalMouseMoveMonitor.prototype.startMonitoring = function (initialElement, initialButtons, mouseMoveEventMerger, mouseMoveCallback, onStopCallback) {
        var _this = this;
        if (this.isMonitoring()) {
            // I am already hooked
            return;
        }
        this._mouseMoveEventMerger = mouseMoveEventMerger;
        this._mouseMoveCallback = mouseMoveCallback;
        this._onStopCallback = onStopCallback;
        var windowChain = IframeUtils.getSameOriginWindowChain();
        var mouseMove = platform.isIOS && BrowserFeatures.pointerEvents ? 'pointermove' : 'mousemove';
        var mouseUp = platform.isIOS && BrowserFeatures.pointerEvents ? 'pointerup' : 'mouseup';
        var listenTo = windowChain.map(function (element) { return element.window.document; });
        var shadowRoot = dom.getShadowRoot(initialElement);
        if (shadowRoot) {
            listenTo.unshift(shadowRoot);
        }
        for (var _i = 0, listenTo_1 = listenTo; _i < listenTo_1.length; _i++) {
            var element = listenTo_1[_i];
            this._hooks.add(dom.addDisposableThrottledListener(element, mouseMove, function (data) {
                if (!browser.isIE && data.buttons !== initialButtons) {
                    // Buttons state has changed in the meantime
                    _this.stopMonitoring(true);
                    return;
                }
                _this._mouseMoveCallback(data);
            }, function (lastEvent, currentEvent) { return _this._mouseMoveEventMerger(lastEvent, currentEvent); }));
            this._hooks.add(dom.addDisposableListener(element, mouseUp, function (e) { return _this.stopMonitoring(true); }));
        }
        if (IframeUtils.hasDifferentOriginAncestor()) {
            var lastSameOriginAncestor = windowChain[windowChain.length - 1];
            // We might miss a mouse up if it happens outside the iframe
            // This one is for Chrome
            this._hooks.add(dom.addDisposableListener(lastSameOriginAncestor.window.document, 'mouseout', function (browserEvent) {
                var e = new StandardMouseEvent(browserEvent);
                if (e.target.tagName.toLowerCase() === 'html') {
                    _this.stopMonitoring(true);
                }
            }));
            // This one is for FF
            this._hooks.add(dom.addDisposableListener(lastSameOriginAncestor.window.document, 'mouseover', function (browserEvent) {
                var e = new StandardMouseEvent(browserEvent);
                if (e.target.tagName.toLowerCase() === 'html') {
                    _this.stopMonitoring(true);
                }
            }));
            // This one is for IE
            this._hooks.add(dom.addDisposableListener(lastSameOriginAncestor.window.document.body, 'mouseleave', function (browserEvent) {
                _this.stopMonitoring(true);
            }));
        }
    };
    return GlobalMouseMoveMonitor;
}());
export { GlobalMouseMoveMonitor };
