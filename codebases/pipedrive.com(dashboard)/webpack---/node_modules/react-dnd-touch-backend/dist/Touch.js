/**
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
'use strict';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a;
var invariant = require("invariant");
function isTouchEvent(e) {
    return !!e.targetTouches;
}
function getEventClientTouchOffset(e) {
    if (e.targetTouches.length === 1) {
        return getEventClientOffset(e.targetTouches[0]);
    }
}
function getEventClientOffset(e) {
    if (isTouchEvent(e)) {
        return getEventClientTouchOffset(e);
    }
    else {
        return {
            x: e.clientX,
            y: e.clientY
        };
    }
}
// Used for MouseEvent.buttons (note the s on the end).
var MouseButtons = {
    Left: 1,
    Right: 2,
    Center: 4
};
// Used for e.button (note the lack of an s on the end).
var MouseButton = {
    Left: 0,
    Center: 1,
    Right: 2
};
/**
 * Only touch events and mouse events where the left button is pressed should initiate a drag.
 * @param {MouseEvent | TouchEvent} e The event
 */
function eventShouldStartDrag(e) {
    // For touch events, button will be undefined. If e.button is defined,
    // then it should be MouseButton.Left.
    return e.button === undefined || e.button === MouseButton.Left;
}
/**
 * Only touch events and mouse events where the left mouse button is no longer held should end a drag.
 * It's possible the user mouse downs with the left mouse button, then mouse down and ups with the right mouse button.
 * We don't want releasing the right mouse button to end the drag.
 * @param {MouseEvent | TouchEvent} e The event
 */
function eventShouldEndDrag(e) {
    // Touch events will have buttons be undefined, while mouse events will have e.buttons's left button
    // bit field unset if the left mouse button has been released
    return e.buttons === undefined || (e.buttons & MouseButtons.Left) === 0;
}
// Polyfill for document.elementsFromPoint
var elementsFromPoint = ((typeof document !== 'undefined' && document.elementsFromPoint) ||
    function (x, y) {
        if (document.msElementsFromPoint) {
            // msElementsFromPoint is much faster but returns a node-list, so convert it to an array
            var msElements = document.msElementsFromPoint(x, y);
            return msElements && Array.prototype.slice.call(msElements, 0);
        }
        var elements = [], previousPointerEvents = [], current, i, d;
        // get all elements via elementFromPoint, and remove them from hit-testing in order
        while ((current = document.elementFromPoint(x, y)) &&
            elements.indexOf(current) === -1 &&
            current !== null) {
            // push the element and its current style
            elements.push(current);
            previousPointerEvents.push({
                value: current.style.getPropertyValue('pointer-events'),
                priority: current.style.getPropertyPriority('pointer-events')
            });
            // add "pointer-events: none", to get to the underlying element
            current.style.setProperty('pointer-events', 'none', 'important');
        }
        // restore the previous pointer-events values
        for (i = previousPointerEvents.length; (d = previousPointerEvents[--i]);) {
            elements[i].style.setProperty('pointer-events', d.value ? d.value : '', d.priority);
        }
        // return our results
        return elements;
    }).bind(typeof document !== 'undefined' ? document : null);
var supportsPassive = (function () {
    // simular to jQuery's test
    var supported = false;
    try {
        addEventListener('test', null, Object.defineProperty({}, 'passive', {
            get: function () {
                supported = true;
            }
        }));
    }
    catch (e) { }
    return supported;
})();
var ELEMENT_NODE = 1;
function getNodeClientOffset(node) {
    var el = node.nodeType === ELEMENT_NODE ? node : node.parentElement;
    if (!el) {
        return null;
    }
    var _a = el.getBoundingClientRect(), top = _a.top, left = _a.left;
    return { x: left, y: top };
}
var eventNames = (_a = {},
    _a["mouse" /* mouse */] = {
        start: 'mousedown',
        move: 'mousemove',
        end: 'mouseup',
        contextmenu: 'contextmenu'
    },
    _a["touch" /* touch */] = {
        start: 'touchstart',
        move: 'touchmove',
        end: 'touchend'
    },
    _a["keyboard" /* keyboard */] = {
        keydown: 'keydown'
    },
    _a);
var TouchBackend = /** @class */ (function () {
    function TouchBackend(manager, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.getSourceClientOffset = function (sourceId) {
            return getNodeClientOffset(_this.sourceNodes[sourceId]);
        };
        this.handleTopMoveStartCapture = function (e) {
            if (!eventShouldStartDrag(e)) {
                return;
            }
            _this.moveStartSourceIds = [];
        };
        this.handleMoveStart = function (sourceId) {
            // Just because we received an event doesn't necessarily mean we need to collect drag sources.
            // We only collect start collecting drag sources on touch and left mouse events.
            if (Array.isArray(_this.moveStartSourceIds)) {
                _this.moveStartSourceIds.unshift(sourceId);
            }
        };
        this.handleTopMoveStart = function (e) {
            if (!eventShouldStartDrag(e)) {
                return;
            }
            // Don't prematurely preventDefault() here since it might:
            // 1. Mess up scrolling
            // 2. Mess up long tap (which brings up context menu)
            // 3. If there's an anchor link as a child, tap won't be triggered on link
            var clientOffset = getEventClientOffset(e);
            if (clientOffset) {
                _this._mouseClientOffset = clientOffset;
            }
            _this.waitingForDelay = false;
        };
        this.handleTopMoveStartDelay = function (e) {
            if (!eventShouldStartDrag(e)) {
                return;
            }
            var delay = e.type === eventNames.touch.start
                ? _this.delayTouchStart
                : _this.delayMouseStart;
            _this.timeout = setTimeout(_this.handleTopMoveStart.bind(_this, e), delay);
            _this.waitingForDelay = true;
        };
        this.handleTopMoveCapture = function () {
            _this.dragOverTargetIds = [];
        };
        this.handleMove = function (_, targetId) {
            _this.dragOverTargetIds.unshift(targetId);
        };
        this.handleTopMove = function (e) {
            clearTimeout(_this.timeout);
            if (_this.waitingForDelay) {
                return;
            }
            var _a = _this, moveStartSourceIds = _a.moveStartSourceIds, dragOverTargetIds = _a.dragOverTargetIds, enableHoverOutsideTarget = _a.enableHoverOutsideTarget;
            var clientOffset = getEventClientOffset(e);
            if (!clientOffset) {
                return;
            }
            // If the touch move started as a scroll, or is is between the scroll angles
            if (_this._isScrolling ||
                (!_this.monitor.isDragging() &&
                    inAngleRanges(_this._mouseClientOffset.x, _this._mouseClientOffset.y, clientOffset.x, clientOffset.y, _this.scrollAngleRanges))) {
                _this._isScrolling = true;
                return;
            }
            // If we're not dragging and we've moved a little, that counts as a drag start
            if (!_this.monitor.isDragging() &&
                _this._mouseClientOffset.hasOwnProperty('x') &&
                moveStartSourceIds &&
                distance(_this._mouseClientOffset.x, _this._mouseClientOffset.y, clientOffset.x, clientOffset.y) > (_this.touchSlop ? _this.touchSlop : 0)) {
                _this.moveStartSourceIds = null;
                _this.actions.beginDrag(moveStartSourceIds, {
                    clientOffset: _this._mouseClientOffset,
                    getSourceClientOffset: _this.getSourceClientOffset,
                    publishSource: false
                });
            }
            if (!_this.monitor.isDragging()) {
                return;
            }
            var sourceNode = _this.sourceNodes[_this.monitor.getSourceId()];
            _this.installSourceNodeRemovalObserver(sourceNode);
            _this.actions.publishDragSource();
            e.preventDefault();
            // Get the node elements of the hovered DropTargets
            var dragOverTargetNodes = dragOverTargetIds.map(function (key) { return _this.targetNodes[key]; });
            // Get the a ordered list of nodes that are touched by
            var elementsAtPoint = _this.getDropTargetElementsAtPoint
                ? _this.getDropTargetElementsAtPoint(clientOffset.x, clientOffset.y, dragOverTargetNodes)
                : elementsFromPoint(clientOffset.x, clientOffset.y);
            // Extend list with parents that are not receiving elementsFromPoint events (size 0 elements and svg groups)
            var elementsAtPointExtended = [];
            for (var nodeId in elementsAtPoint) {
                if (!elementsAtPoint.hasOwnProperty(nodeId)) {
                    continue;
                }
                var currentNode = elementsAtPoint[nodeId];
                elementsAtPointExtended.push(currentNode);
                while (currentNode) {
                    currentNode = currentNode.parentElement;
                    if (elementsAtPointExtended.indexOf(currentNode) === -1) {
                        elementsAtPointExtended.push(currentNode);
                    }
                }
            }
            var orderedDragOverTargetIds = elementsAtPointExtended
                // Filter off nodes that arent a hovered DropTargets nodes
                .filter(function (node) { return dragOverTargetNodes.indexOf(node) > -1; })
                // Map back the nodes elements to targetIds
                .map(function (node) {
                for (var targetId in _this.targetNodes) {
                    if (node === _this.targetNodes[targetId]) {
                        return targetId;
                    }
                }
                return null;
            })
                // Filter off possible null rows
                .filter(function (node) { return !!node; })
                .filter(function (id, index, ids) { return ids.indexOf(id) === index; });
            // Invoke hover for drop targets when source node is still over and pointer is outside
            if (enableHoverOutsideTarget) {
                for (var targetId in _this.targetNodes) {
                    if (_this.targetNodes[targetId] &&
                        _this.targetNodes[targetId].contains(sourceNode) &&
                        orderedDragOverTargetIds.indexOf(targetId) === -1) {
                        orderedDragOverTargetIds.unshift(targetId);
                        break;
                    }
                }
            }
            // Reverse order because dnd-core reverse it before calling the DropTarget drop methods
            orderedDragOverTargetIds.reverse();
            _this.actions.hover(orderedDragOverTargetIds, {
                clientOffset: clientOffset
            });
        };
        this.handleTopMoveEndCapture = function (e) {
            _this._isScrolling = false;
            if (!eventShouldEndDrag(e)) {
                return;
            }
            if (!_this.monitor.isDragging() || _this.monitor.didDrop()) {
                _this.moveStartSourceIds = null;
                return;
            }
            e.preventDefault();
            _this._mouseClientOffset = {};
            _this.uninstallSourceNodeRemovalObserver();
            _this.actions.drop();
            _this.actions.endDrag();
        };
        this.handleCancelOnEscape = function (e) {
            if (e.key === 'Escape' && _this.monitor.isDragging()) {
                _this._mouseClientOffset = {};
                _this.uninstallSourceNodeRemovalObserver();
                _this.actions.endDrag();
            }
        };
        options.delayTouchStart = options.delayTouchStart || options.delay;
        options = __assign({ enableTouchEvents: true, enableMouseEvents: false, enableKeyboardEvents: false, ignoreContextMenu: false, enableHoverOutsideTarget: false, delayTouchStart: 0, delayMouseStart: 0, touchSlop: 0, scrollAngleRanges: undefined }, options);
        this.actions = manager.getActions();
        this.monitor = manager.getMonitor();
        this.registry = manager.getRegistry();
        this.enableKeyboardEvents = options.enableKeyboardEvents;
        this.enableMouseEvents = options.enableMouseEvents;
        this.delayTouchStart = options.delayTouchStart;
        this.delayMouseStart = options.delayMouseStart;
        this.ignoreContextMenu = options.ignoreContextMenu;
        this.touchSlop = options.touchSlop;
        this.scrollAngleRanges = options.scrollAngleRanges;
        this.enableHoverOutsideTarget = options.enableHoverOutsideTarget;
        this.sourceNodes = {};
        this.sourceNodeOptions = {};
        this.sourcePreviewNodes = {};
        this.sourcePreviewNodeOptions = {};
        this.targetNodes = {};
        this.targetNodeOptions = {};
        this.listenerTypes = [];
        this._mouseClientOffset = {};
        this._isScrolling = false;
        if (options.enableMouseEvents) {
            this.listenerTypes.push("mouse" /* mouse */);
        }
        if (options.enableTouchEvents) {
            this.listenerTypes.push("touch" /* touch */);
        }
        if (options.enableKeyboardEvents) {
            this.listenerTypes.push("keyboard" /* keyboard */);
        }
        if (options.getDropTargetElementsAtPoint) {
            this.getDropTargetElementsAtPoint = options.getDropTargetElementsAtPoint;
        }
    }
    TouchBackend.prototype.setup = function () {
        if (typeof window === 'undefined') {
            return;
        }
        invariant(!TouchBackend.isSetUp, 'Cannot have two Touch backends at the same time.');
        TouchBackend.isSetUp = true;
        this.addEventListener(window, 'start', this.getTopMoveStartHandler());
        this.addEventListener(window, 'start', this.handleTopMoveStartCapture, true);
        this.addEventListener(window, 'move', this.handleTopMove);
        this.addEventListener(window, 'move', this.handleTopMoveCapture, true);
        this.addEventListener(window, 'end', this.handleTopMoveEndCapture, true);
        if (this.enableMouseEvents && !this.ignoreContextMenu) {
            this.addEventListener(window, 'contextmenu', this.handleTopMoveEndCapture);
        }
        if (this.enableKeyboardEvents) {
            this.addEventListener(window, 'keydown', this.handleCancelOnEscape, true);
        }
    };
    TouchBackend.prototype.teardown = function () {
        if (typeof window === 'undefined') {
            return;
        }
        TouchBackend.isSetUp = false;
        this._mouseClientOffset = {};
        this.removeEventListener(window, 'start', this.handleTopMoveStartCapture, true);
        this.removeEventListener(window, 'start', this.handleTopMoveStart);
        this.removeEventListener(window, 'move', this.handleTopMoveCapture, true);
        this.removeEventListener(window, 'move', this.handleTopMove);
        this.removeEventListener(window, 'end', this.handleTopMoveEndCapture, true);
        if (this.enableMouseEvents && !this.ignoreContextMenu) {
            this.removeEventListener(window, 'contextmenu', this.handleTopMoveEndCapture);
        }
        if (this.enableKeyboardEvents) {
            this.removeEventListener(window, 'keydown', this.handleCancelOnEscape, true);
        }
        this.uninstallSourceNodeRemovalObserver();
    };
    TouchBackend.prototype.addEventListener = function (subject, event, handler, capture) {
        var options = supportsPassive ? { capture: capture, passive: false } : capture;
        this.listenerTypes.forEach(function (listenerType) {
            var evt = eventNames[listenerType][event];
            if (evt) {
                subject.addEventListener(evt, handler, options);
            }
        });
    };
    TouchBackend.prototype.removeEventListener = function (subject, event, handler, capture) {
        var options = supportsPassive ? { capture: capture, passive: false } : capture;
        this.listenerTypes.forEach(function (listenerType) {
            var evt = eventNames[listenerType][event];
            if (evt) {
                subject.removeEventListener(evt, handler, options);
            }
        });
    };
    TouchBackend.prototype.connectDragSource = function (sourceId, node) {
        var _this = this;
        var handleMoveStart = this.handleMoveStart.bind(this, sourceId);
        this.sourceNodes[sourceId] = node;
        this.addEventListener(node, 'start', handleMoveStart);
        return function () {
            delete _this.sourceNodes[sourceId];
            _this.removeEventListener(node, 'start', handleMoveStart);
        };
    };
    TouchBackend.prototype.connectDragPreview = function (sourceId, node, options) {
        var _this = this;
        this.sourcePreviewNodeOptions[sourceId] = options;
        this.sourcePreviewNodes[sourceId] = node;
        return function () {
            delete _this.sourcePreviewNodes[sourceId];
            delete _this.sourcePreviewNodeOptions[sourceId];
        };
    };
    TouchBackend.prototype.connectDropTarget = function (targetId, node) {
        var _this = this;
        var handleMove = function (e) {
            var coords;
            if (!_this.monitor.isDragging()) {
                return;
            }
            /**
             * Grab the coordinates for the current mouse/touch position
             */
            switch (e.type) {
                case eventNames.mouse.move:
                    coords = {
                        x: e.clientX,
                        y: e.clientY
                    };
                    break;
                case eventNames.touch.move:
                    coords = {
                        x: e.touches[0].clientX,
                        y: e.touches[0].clientY
                    };
                    break;
            }
            /**
             * Use the coordinates to grab the element the drag ended on.
             * If the element is the same as the target node (or any of it's children) then we have hit a drop target and can handle the move.
             */
            var droppedOn = document.elementFromPoint(coords.x, coords.y);
            var childMatch = node.contains(droppedOn);
            if (droppedOn === node || childMatch) {
                return _this.handleMove(e, targetId);
            }
        };
        /**
         * Attaching the event listener to the body so that touchmove will work while dragging over multiple target elements.
         */
        this.addEventListener(document.body, 'move', handleMove);
        this.targetNodes[targetId] = node;
        return function () {
            delete _this.targetNodes[targetId];
            _this.removeEventListener(document.body, 'move', handleMove);
        };
    };
    TouchBackend.prototype.getTopMoveStartHandler = function () {
        if (!this.delayTouchStart && !this.delayMouseStart) {
            return this.handleTopMoveStart;
        }
        return this.handleTopMoveStartDelay;
    };
    TouchBackend.prototype.installSourceNodeRemovalObserver = function (node) {
        var _this = this;
        this.uninstallSourceNodeRemovalObserver();
        this.draggedSourceNode = node;
        this.draggedSourceNodeRemovalObserver = new MutationObserver(function () {
            if (!node.parentElement) {
                _this.resurrectSourceNode();
                _this.uninstallSourceNodeRemovalObserver();
            }
        });
        if (!node || !node.parentElement) {
            return;
        }
        this.draggedSourceNodeRemovalObserver.observe(node.parentElement, {
            childList: true
        });
    };
    TouchBackend.prototype.resurrectSourceNode = function () {
        this.draggedSourceNode.style.display = 'none';
        this.draggedSourceNode.removeAttribute('data-reactid');
        document.body.appendChild(this.draggedSourceNode);
    };
    TouchBackend.prototype.uninstallSourceNodeRemovalObserver = function () {
        if (this.draggedSourceNodeRemovalObserver) {
            this.draggedSourceNodeRemovalObserver.disconnect();
        }
        this.draggedSourceNodeRemovalObserver = null;
        this.draggedSourceNode = null;
    };
    return TouchBackend;
}());
exports.TouchBackend = TouchBackend;
function isDragDropManager(optionsOrManager) {
    return !!optionsOrManager.getMonitor;
}
function createTouchBackend(optionsOrManager) {
    var touchBackendFactory = function (manager) {
        return new TouchBackend(manager, optionsOrManager);
    };
    if (isDragDropManager(optionsOrManager)) {
        return touchBackendFactory(optionsOrManager);
    }
    else {
        return touchBackendFactory;
    }
}
exports.default = createTouchBackend;
function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(Math.abs(x2 - x1), 2) + Math.pow(Math.abs(y2 - y1), 2));
}
function inAngleRanges(x1, y1, x2, y2, angleRanges) {
    if (!angleRanges) {
        return false;
    }
    var angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI + 180;
    for (var i = 0; i < angleRanges.length; ++i) {
        if ((angleRanges[i].start == null || angle >= angleRanges[i].start) &&
            (angleRanges[i].end == null || angle <= angleRanges[i].end)) {
            return true;
        }
    }
    return false;
}
