"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var checkDecoratorArguments_1 = require("./utils/checkDecoratorArguments");
var decorateHandler_1 = require("./decorateHandler");
var registerTarget_1 = require("./registerTarget");
var createTargetFactory_1 = require("./createTargetFactory");
var isValidType_1 = require("./utils/isValidType");
var DropTargetMonitorImpl_1 = require("./DropTargetMonitorImpl");
var TargetConnector_1 = require("./TargetConnector");
var discount_lodash_1 = require("./utils/discount_lodash");
var invariant = require('invariant');
function DropTarget(type, spec, collect, options) {
    if (options === void 0) { options = {}; }
    checkDecoratorArguments_1.default('DropTarget', 'type, spec, collect[, options]', type, spec, collect, options);
    var getType = type;
    if (typeof type !== 'function') {
        invariant(isValidType_1.default(type, true), 'Expected "type" provided as the first argument to DropTarget to be ' +
            'a string, an array of strings, or a function that returns either given ' +
            'the current props. Instead, received %s. ' +
            'Read more: http://react-dnd.github.io/react-dnd/docs/api/drop-target', type);
        getType = function () { return type; };
    }
    invariant(discount_lodash_1.isPlainObject(spec), 'Expected "spec" provided as the second argument to DropTarget to be ' +
        'a plain object. Instead, received %s. ' +
        'Read more: http://react-dnd.github.io/react-dnd/docs/api/drop-target', spec);
    var createTarget = createTargetFactory_1.default(spec);
    invariant(typeof collect === 'function', 'Expected "collect" provided as the third argument to DropTarget to be ' +
        'a function that returns a plain object of props to inject. ' +
        'Instead, received %s. ' +
        'Read more: http://react-dnd.github.io/react-dnd/docs/api/drop-target', collect);
    invariant(discount_lodash_1.isPlainObject(options), 'Expected "options" provided as the fourth argument to DropTarget to be ' +
        'a plain object when specified. ' +
        'Instead, received %s. ' +
        'Read more: http://react-dnd.github.io/react-dnd/docs/api/drop-target', collect);
    return function decorateTarget(DecoratedComponent) {
        return decorateHandler_1.default({
            containerDisplayName: 'DropTarget',
            createHandler: createTarget,
            registerHandler: registerTarget_1.default,
            createMonitor: function (manager) {
                return new DropTargetMonitorImpl_1.default(manager);
            },
            createConnector: function (backend) { return new TargetConnector_1.default(backend); },
            DecoratedComponent: DecoratedComponent,
            getType: getType,
            collect: collect,
            options: options,
        });
    };
}
exports.default = DropTarget;
