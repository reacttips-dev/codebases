'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsx as _jsx } from "react/jsx-runtime";

var _matchDataByStatus2;

import * as MatchStatus from 'customer-data-filters/filterQueryFormat/MatchStatus';
import FormattedMessage from 'I18n/components/FormattedMessage';
import MatchStatusType from '../propTypes/MatchStatusType';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import UIStatusTag from 'UIComponents/tag/UIStatusTag';

var _matchDataByStatus = (_matchDataByStatus2 = {}, _defineProperty(_matchDataByStatus2, MatchStatus.FAIL, {
  name: 'removed',
  text: 'customerDataFilters.FilterEditorLogicGroupStatusTag.textFail'
}), _defineProperty(_matchDataByStatus2, MatchStatus.PASS, {
  name: 'success',
  text: 'customerDataFilters.FilterEditorLogicGroupStatusTag.textPass'
}), _defineProperty(_matchDataByStatus2, MatchStatus.PENDING, {
  name: 'paused',
  text: 'customerDataFilters.FilterEditorLogicGroupStatusTag.textPending'
}), _matchDataByStatus2);

var FilterEditorLogicGroupStatusTag = /*#__PURE__*/function (_PureComponent) {
  _inherits(FilterEditorLogicGroupStatusTag, _PureComponent);

  function FilterEditorLogicGroupStatusTag() {
    _classCallCheck(this, FilterEditorLogicGroupStatusTag);

    return _possibleConstructorReturn(this, _getPrototypeOf(FilterEditorLogicGroupStatusTag).apply(this, arguments));
  }

  _createClass(FilterEditorLogicGroupStatusTag, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          filterFamily = _this$props.filterFamily,
          getFilterFamilyObjectName = _this$props.getFilterFamilyObjectName,
          matchStatus = _this$props.matchStatus;
      var matchData = _matchDataByStatus[matchStatus];

      if (!matchData) {
        return null;
      } // note: this will not work for custom objects


      var objectName = getFilterFamilyObjectName(filterFamily);
      return /*#__PURE__*/_jsx(UIStatusTag, {
        className: "m-left-1 m-top-2",
        use: matchData.name,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: matchData.text,
          options: {
            objectName: objectName
          }
        })
      });
    }
  }]);

  return FilterEditorLogicGroupStatusTag;
}(PureComponent);

export { FilterEditorLogicGroupStatusTag as default };
FilterEditorLogicGroupStatusTag.propTypes = {
  filterFamily: PropTypes.string.isRequired,
  getFilterFamilyObjectName: PropTypes.func.isRequired,
  matchStatus: MatchStatusType
};
FilterEditorLogicGroupStatusTag.defaultProps = {
  matchStatus: 'PENDING'
};