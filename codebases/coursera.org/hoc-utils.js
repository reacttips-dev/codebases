var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from 'react';
var invariant = require('invariant');
import { DocumentType } from './parser';
export var defaultMapPropsToOptions = function () { return ({}); };
export var defaultMapResultToProps = function (props) { return props; };
export var defaultMapPropsToSkip = function () { return false; };
export function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
export function calculateVariablesFromProps(operation, props, graphQLDisplayName, wrapperName) {
    var variables = {};
    for (var _i = 0, _a = operation.variables; _i < _a.length; _i++) {
        var _b = _a[_i], variable = _b.variable, type = _b.type;
        if (!variable.name || !variable.name.value)
            continue;
        var variableName = variable.name.value;
        var variableProp = props[variableName];
        if (typeof variableProp !== 'undefined') {
            variables[variableName] = variableProp;
            continue;
        }
        if (type.kind !== 'NonNullType') {
            variables[variableName] = null;
            continue;
        }
        if (operation.type === DocumentType.Mutation)
            return;
        invariant(typeof variableProp !== 'undefined', "The operation '" + operation.name + "' wrapping '" + wrapperName + "' " +
            ("is expecting a variable: '" + variable.name.value + "' but it was not found in the props ") +
            ("passed to '" + graphQLDisplayName + "'"));
    }
    return variables;
}
var GraphQLBase = (function (_super) {
    __extends(GraphQLBase, _super);
    function GraphQLBase(props) {
        var _this = _super.call(this, props) || this;
        _this.withRef = false;
        _this.setWrappedInstance = _this.setWrappedInstance.bind(_this);
        return _this;
    }
    GraphQLBase.prototype.getWrappedInstance = function () {
        invariant(this.withRef, "To access the wrapped instance, you need to specify " + "{ withRef: true } in the options");
        return this.wrappedInstance;
    };
    GraphQLBase.prototype.setWrappedInstance = function (ref) {
        this.wrappedInstance = ref;
    };
    return GraphQLBase;
}(React.Component));
export { GraphQLBase };
//# sourceMappingURL=hoc-utils.js.map