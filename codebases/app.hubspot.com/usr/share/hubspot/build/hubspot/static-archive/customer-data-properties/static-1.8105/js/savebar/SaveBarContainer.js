'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import * as Atom from 'atom';
import get from 'transmute/get';
import I18n from 'I18n';
export var SaveBarContainer = function SaveBarContainer(Wrapper, editableAreas) {
  var SaveBar = /*#__PURE__*/function (_Component) {
    _inherits(SaveBar, _Component);

    function SaveBar() {
      var _this;

      _classCallCheck(this, SaveBar);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(SaveBar).call(this));

      _this.handleAreasChange = function (areas) {
        _this.setState({
          areas: areas
        });
      };

      _this.handleCancel = function (evt) {
        _this.state.areas.forEach(function (_ref) {
          var changes = _ref.changes,
              onCancel = _ref.onCancel;

          if (changes) {
            onCancel(evt);
          }
        });
      };

      _this.handleSave = function (evt) {
        _this.state.areas.forEach(function (_ref2) {
          var changes = _ref2.changes,
              onSave = _ref2.onSave;

          if (changes) {
            onSave(evt);
          }
        });
      };

      _this.state = {
        areas: Atom.deref(editableAreas)
      };
      return _this;
    }

    _createClass(SaveBar, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        Atom.watch(editableAreas, this.handleAreasChange);
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        Atom.unwatch(editableAreas, this.handleAreasChange);
      }
    }, {
      key: "getWatchedAreasByKeyName",
      value: function getWatchedAreasByKeyName(areaName) {
        var areas = this.state.areas;
        return areas.toSeq().filter(get(areaName)).map(get(areaName)).toArray();
      }
    }, {
      key: "render",
      value: function render() {
        var areas = this.state.areas;
        var hasChanges = areas.some(function (_ref3) {
          var changes = _ref3.changes;
          return !!changes;
        });
        var hasErrors = areas.some(function (_ref4) {
          var errors = _ref4.errors;
          return !!errors;
        });

        if (!hasChanges && !this.props.alwaysShowSaveBar) {
          return null;
        }

        var formattedChanges = I18n.formatList([].concat(_toConsumableArray(this.getWatchedAreasByKeyName('changes')), _toConsumableArray(this.getWatchedAreasByKeyName('errors')), _toConsumableArray(this.getWatchedAreasByKeyName('warnings'))));
        return /*#__PURE__*/_jsx(Wrapper, Object.assign({}, this.props, {
          hasErrors: hasErrors,
          hasChanges: hasChanges,
          areas: areas,
          formattedChanges: formattedChanges,
          handleSave: this.handleSave,
          handleCancel: this.handleCancel
        }));
      }
    }]);

    return SaveBar;
  }(Component);

  SaveBar.defaultProps = {
    alwaysShowSaveBar: false
  };
  SaveBar.propTypes = {
    alwaysShowSaveBar: PropTypes.bool
  };
  return SaveBar;
};