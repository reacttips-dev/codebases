'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import FormattedMessage from 'I18n/components/FormattedMessage';
import SearchResultRecord from 'SalesContentIndexUI/data/records/SearchResultRecord';
import UIBreadcrumbs from 'UIComponents/nav/UIBreadcrumbs';
import UILink from 'UIComponents/link/UILink';
export default createReactClass({
  displayName: "IndexTableBreadcrumbs",
  propTypes: {
    selectedFolder: PropTypes.instanceOf(SearchResultRecord),
    setSelectedFolder: PropTypes.func.isRequired
  },
  renderHome: function renderHome() {
    var _this$props = this.props,
        selectedFolder = _this$props.selectedFolder,
        setSelectedFolder = _this$props.setSelectedFolder;

    var home = /*#__PURE__*/_jsx(FormattedMessage, {
      message: "salesContentIndexUI.tableNavigation.breadcrumbs.home"
    });

    if (selectedFolder) {
      return /*#__PURE__*/_jsx(UILink, {
        onClick: function onClick() {
          return setSelectedFolder();
        },
        children: home
      });
    }

    return /*#__PURE__*/_jsx("span", {
      children: home
    });
  },
  renderFolder: function renderFolder() {
    var selectedFolder = this.props.selectedFolder;
    return /*#__PURE__*/_jsx("span", {
      children: selectedFolder.name
    });
  },
  render: function render() {
    var selectedFolder = this.props.selectedFolder;

    if (!selectedFolder) {
      return null;
    }

    return /*#__PURE__*/_jsxs(UIBreadcrumbs, {
      flush: true,
      singleBreadcrumbIsBackLink: false,
      className: "m-bottom-2 m-top-0",
      children: [this.renderHome(), this.renderFolder()]
    });
  }
});