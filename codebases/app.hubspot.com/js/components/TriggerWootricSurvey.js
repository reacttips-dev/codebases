'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Component } from 'react';
import PropTypes from 'prop-types';
import { triggerWootricSurveyWhenAvailable } from '../util/triggerWootric'; // Adapted from https://git.hubteam.com/HubSpot/content-detail-ui/pull/853/files

var TriggerWootricSurvey = /*#__PURE__*/function (_Component) {
  _inherits(TriggerWootricSurvey, _Component);

  function TriggerWootricSurvey() {
    _classCallCheck(this, TriggerWootricSurvey);

    return _possibleConstructorReturn(this, _getPrototypeOf(TriggerWootricSurvey).apply(this, arguments));
  }

  _createClass(TriggerWootricSurvey, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.enabled) {
        triggerWootricSurveyWhenAvailable();
      }
    }
  }, {
    key: "render",
    value: function render() {
      return null;
    }
  }]);

  return TriggerWootricSurvey;
}(Component);

TriggerWootricSurvey.propTypes = {
  enabled: PropTypes.bool.isRequired
};
export { TriggerWootricSurvey as default };