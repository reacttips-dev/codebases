'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsx as _jsx } from "react/jsx-runtime";

var _panelToComponent;

import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Panels, DrawerTypes } from '../../Constants';
import { getActivePanel } from '../../selectors/Panel';
import FromUrlPanelContainer from '../../containers/browser/FromUrlPanelContainer';
import BulkImportFromUrlPanel from '../image-import/BulkImportFromUrlPanel';
import BrowsePanel from './BrowsePanel';
import FolderPanel from './FolderPanel';
import SearchPanel from './SearchPanel';
var panelToComponent = (_panelToComponent = {}, _defineProperty(_panelToComponent, Panels.BROWSE, BrowsePanel), _defineProperty(_panelToComponent, Panels.FOLDER, FolderPanel), _defineProperty(_panelToComponent, Panels.SEARCH, SearchPanel), _defineProperty(_panelToComponent, Panels.FROM_URL, FromUrlPanelContainer), _defineProperty(_panelToComponent, Panels.BULK_IMPORT_FROM_URL, BulkImportFromUrlPanel), _panelToComponent);

var getPanel = function getPanel(panel) {
  return panelToComponent[panel] ? panelToComponent[panel] : BrowsePanel;
};

var ActivePanel = /*#__PURE__*/function (_Component) {
  _inherits(ActivePanel, _Component);

  function ActivePanel() {
    _classCallCheck(this, ActivePanel);

    return _possibleConstructorReturn(this, _getPrototypeOf(ActivePanel).apply(this, arguments));
  }

  _createClass(ActivePanel, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          activePanel = _this$props.activePanel,
          rest = _objectWithoutProperties(_this$props, ["activePanel"]);

      var Panel = getPanel(activePanel);
      return /*#__PURE__*/_jsx(Panel, Object.assign({}, rest));
    }
  }]);

  return ActivePanel;
}(Component);

ActivePanel.propTypes = {
  type: PropTypes.oneOf(Object.keys(DrawerTypes)).isRequired,
  activePanel: PropTypes.oneOf(Object.keys(Panels)).isRequired,
  onInsert: PropTypes.func.isRequired,
  isPanelInactive: PropTypes.bool,
  disableUpload: PropTypes.bool.isRequired
};
ActivePanel.defaultProps = {
  isPanelInactive: false
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    activePanel: getActivePanel(state)
  };
};

export default connect(mapStateToProps)(ActivePanel);