'use es6';
/* eslint-disable react/prefer-stateless-function, react/no-multi-comp */

/*
 * This plugin removes the UI for plugins (i.e. buttons and overlays)
 */

import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap } from 'immutable';
import omit from 'transmute/omit';
import createReactClass from 'create-react-class';
import { compose } from 'draft-extend';

var omitButtonAndOverlayProps = function omitButtonAndOverlayProps(WrappingComponent) {
  return createReactClass({
    blur: function blur() {
      if (this._child.blur) {
        this._child.blur();
      }
    },
    focus: function focus() {
      if (this._child.focus) {
        this._child.focus();
      }
    },
    render: function render() {
      var _this = this;

      var updatedProps = omit(['buttons', 'overlays'], ImmutableMap(this.props)).toObject();
      return /*#__PURE__*/_jsx(WrappingComponent, Object.assign({
        ref: function ref(c) {
          _this._child = c;
        }
      }, updatedProps));
    }
  });
};

export default (function () {
  for (var _len = arguments.length, plugins = new Array(_len), _key = 0; _key < _len; _key++) {
    plugins[_key] = arguments[_key];
  }

  return function (WrappingComponent) {
    if (plugins.length === 0) {
      return WrappingComponent;
    }

    if (WrappingComponent.prototype && WrappingComponent.prototype.isReactComponent) {
      return compose.apply(void 0, plugins.concat([omitButtonAndOverlayProps]))(WrappingComponent);
    } // not an Editor component, so accumulate as usual


    return compose.apply(void 0, plugins)(WrappingComponent);
  };
});