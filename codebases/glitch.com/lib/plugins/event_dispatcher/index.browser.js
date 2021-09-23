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
var POST_METHOD = 'POST';
var GET_METHOD = 'GET';
var READYSTATE_COMPLETE = 4;

/**
 * Sample event dispatcher implementation for tracking impression and conversions
 * Users of the SDK can provide their own implementation
 * @param  {Object} eventObj
 * @param  {Function} callback
 */
export var dispatchEvent = function(eventObj, callback) {
    var url = eventObj.url;
    var params = eventObj.params;
    var req;
    if (eventObj.httpVerb === POST_METHOD) {
        req = new XMLHttpRequest();
        req.open(POST_METHOD, url, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.onreadystatechange = function() {
            if (req.readyState === READYSTATE_COMPLETE && callback && typeof callback === 'function') {
                try {
                    callback({
                        statusCode: req.status
                    });
                } catch (e) {
                    // TODO: Log this somehow (consider adding a logger to the EventDispatcher interface)
                }
            }
        };
        req.send(JSON.stringify(params));
    } else {
        // add param for cors headers to be sent by the log endpoint
        url += '?wxhr=true';
        if (params) {
            url += '&' + toQueryString(params);
        }

        req = new XMLHttpRequest();
        req.open(GET_METHOD, url, true);
        req.onreadystatechange = function() {
            if (req.readyState === READYSTATE_COMPLETE && callback && typeof callback === 'function') {
                try {
                    callback();
                } catch (e) {
                    // TODO: Log this somehow (consider adding a logger to the EventDispatcher interface)
                }
            }
        };
        req.send();
    }
}

var toQueryString = function(obj) {
    return Object.keys(obj)
        .map(function(k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);
        })
        .join('&');
};

export default {
    dispatchEvent,
};