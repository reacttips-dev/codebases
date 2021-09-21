"use strict";
/**
 * Copyright 2019-2020, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.listeners = {};
        this.listenerId = 1;
    }
    EventEmitter.prototype.on = function (eventName, listener) {
        var _this = this;
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = {};
        }
        var currentListenerId = String(this.listenerId);
        this.listenerId++;
        this.listeners[eventName][currentListenerId] = listener;
        return function () {
            if (_this.listeners[eventName]) {
                delete _this.listeners[eventName][currentListenerId];
            }
        };
    };
    EventEmitter.prototype.emit = function (eventName, arg) {
        var listeners = this.listeners[eventName];
        if (listeners) {
            Object.keys(listeners).forEach(function (listenerId) {
                var listener = listeners[listenerId];
                listener(arg);
            });
        }
    };
    EventEmitter.prototype.removeAllListeners = function () {
        this.listeners = {};
    };
    return EventEmitter;
}());
exports.default = EventEmitter;
// TODO: Create a typed event emitter for use in TS only (not JS)
