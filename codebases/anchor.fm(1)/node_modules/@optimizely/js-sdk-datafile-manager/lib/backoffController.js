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
var config_1 = require("./config");
function randomMilliseconds() {
    return Math.round(Math.random() * 1000);
}
var BackoffController = /** @class */ (function () {
    function BackoffController() {
        this.errorCount = 0;
    }
    BackoffController.prototype.getDelay = function () {
        if (this.errorCount === 0) {
            return 0;
        }
        var baseWaitSeconds = config_1.BACKOFF_BASE_WAIT_SECONDS_BY_ERROR_COUNT[Math.min(config_1.BACKOFF_BASE_WAIT_SECONDS_BY_ERROR_COUNT.length - 1, this.errorCount)];
        return baseWaitSeconds * 1000 + randomMilliseconds();
    };
    BackoffController.prototype.countError = function () {
        if (this.errorCount < config_1.BACKOFF_BASE_WAIT_SECONDS_BY_ERROR_COUNT.length - 1) {
            this.errorCount++;
        }
    };
    BackoffController.prototype.reset = function () {
        this.errorCount = 0;
    };
    return BackoffController;
}());
exports.default = BackoffController;
