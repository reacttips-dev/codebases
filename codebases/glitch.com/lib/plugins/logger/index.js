/**
 * Copyright 2016-2017, 2020, Optimizely
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
import {
    ConsoleLogHandler
} from '@optimizely/js-sdk-logging';

function NoOpLogger() {}

NoOpLogger.prototype.log = function() {};

export var createLogger = function(opts) {
    return new ConsoleLogHandler(opts);
};

export var createNoOpLogger = function() {
    return new NoOpLogger();
};

export default {
    createLogger,
    createNoOpLogger,
};