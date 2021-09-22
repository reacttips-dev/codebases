"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var checkDecoratorArguments_1 = require("./utils/checkDecoratorArguments");
var decorateHandler_1 = require("./decorateHandler");
var registerSource_1 = require("./registerSource");
var createSourceFactory_1 = require("./createSourceFactory");
var DragSourceMonitorImpl_1 = require("./DragSourceMonitorImpl");
var SourceConnector_1 = require("./SourceConnector");
var isValidType_1 = require("./utils/isValidType");
var discount_lodash_1 = require("./utils/discount_lodash");
var invariant = require('invariant');
/**
 * Decorates a component as a dragsource
 * @param type The dragsource type
 * @param spec The drag source specification
 * @param collect The props collector function
 * @param options DnD options
 */
function DragSource(type, spec, collect, options) {
    if (options === void 0) { options = {}; }
    checkDecoratorArguments_1.default('DragSource', 'type, spec, collect[, options]', type, spec, collect, options);
    var getType = type;
    if (typeof type !== 'function') {
        invariant(isValidType_1.default(type), 'Expected "type" provided as the first argument to DragSource to be ' +
            'a string, or a function that returns a string given the current props. ' +
            'Instead, received %s. ' +
            'Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source', type);
        getType = function () { return type; };
    }
    invariant(discount_lodash_1.isPlainObject(spec), 'Expected "spec" provided as the second argument to DragSource to be ' +
        'a plain object. Instead, received %s. ' +
        'Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source', spec);
    var createSource = createSourceFactory_1.default(spec);
    invariant(typeof collect === 'function', 'Expected "collect" provided as the third argument to DragSource to be ' +
        'a function that returns a plain object of props to inject. ' +
        'Instead, received %s. ' +
        'Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source', collect);
    invariant(discount_lodash_1.isPlainObject(options), 'Expected "options" provided as the fourth argument to DragSource to be ' +
        'a plain object when specified. ' +
        'Instead, received %s. ' +
        'Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source', collect);
    return function decorateSource(DecoratedComponent) {
        return decorateHandler_1.default({
            containerDisplayName: 'DragSource',
            createHandler: createSource,
            registerHandler: registerSource_1.default,
            createConnector: function (backend) { return new SourceConnector_1.default(backend); },
            createMonitor: function (manager) {
                return new DragSourceMonitorImpl_1.default(manager);
            },
            DecoratedComponent: DecoratedComponent,
            getType: getType,
            collect: collect,
            options: options,
        });
    };
}
exports.default = DragSource;
