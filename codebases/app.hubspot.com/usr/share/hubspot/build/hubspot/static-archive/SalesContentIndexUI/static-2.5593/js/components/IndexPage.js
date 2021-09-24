'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Children } from 'react';
import { fromJS } from 'immutable';
import { OLAF } from 'HubStyleTokens/colors';
import IndexHeaderButtonsSlot from 'SalesContentIndexUI/slots/IndexHeaderButtonsSlot';
import IndexAlertsSlot from 'SalesContentIndexUI/slots/IndexAlertsSlot';
import IndexBodySlot from 'SalesContentIndexUI/slots/IndexBodySlot';
import IndexHeaderButtons from 'SalesContentIndexUI/components/header/IndexHeaderButtons';
import UIListingPage from 'UIComponents/page/UIListingPage';
import UIHeader from 'UIComponents/layout/UIHeader';
export default createReactClass({
  displayName: "IndexPage",
  propTypes: {
    backgroundColor: PropTypes.string,
    children: PropTypes.any,
    tabs: PropTypes.object,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired
  },
  contextTypes: {
    location: PropTypes.object,
    updateRouterWithQuery: PropTypes.func
  },
  getChildMap: function getChildMap() {
    var childMap = fromJS({
      headerButtons: null,
      alerts: null,
      indexBody: null
    });
    Children.forEach(this.props.children, function (child) {
      var childType = child ? child.type : '';

      switch (childType) {
        case IndexHeaderButtonsSlot:
          childMap = childMap.set('headerButtons', child);
          break;

        case IndexHeaderButtons:
          childMap = childMap.set('headerButtons', child);
          break;

        case IndexAlertsSlot:
          childMap = childMap.set('alerts', child);
          break;

        case IndexBodySlot:
          childMap = childMap.set('indexBody', child);
          break;

        default:
          break;
      }
    });
    return childMap;
  },
  renderBody: function renderBody() {
    var childMap = this.getChildMap();
    return /*#__PURE__*/_jsxs("div", {
      children: [childMap.get('alerts'), childMap.get('indexBody')]
    });
  },
  renderHeader: function renderHeader() {
    var title = this.props.title;
    var childMap = this.getChildMap();
    return /*#__PURE__*/_jsx(UIHeader, {
      tabs: this.props.tabs,
      title: title,
      children: childMap.get('headerButtons')
    });
  },
  render: function render() {
    return /*#__PURE__*/_jsx(UIListingPage, {
      headerComponent: this.renderHeader(),
      mainSectionBackgroundColor: this.props.backgroundColor || OLAF,
      children: this.renderBody()
    });
  }
});