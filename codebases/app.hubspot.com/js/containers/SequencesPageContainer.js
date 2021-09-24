'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { updateTableContentState } from 'SequencesUI/actions/UIActions';
import { tracker } from 'SequencesUI/util/UsageTracker';
import { connect } from 'react-redux';
import IndexContainer from 'SalesContentIndexUI/containers/IndexContainer';
import * as SequenceActions from 'SequencesUI/actions/SequenceActions';
import { getPortalIsAtLimit } from 'SequencesUI/selectors/usageSelectors';
import SearchContentTypes from 'SalesContentIndexUI/data/constants/SearchContentTypes';
import * as IndexActions from 'SequencesUI/actions/IndexActions';
import IndexBodySlot from 'SalesContentIndexUI/slots/IndexBodySlot';
import IndexHeaderButtons from 'SalesContentIndexUI/components/header/IndexHeaderButtons';
import { getVisibleTabs } from 'SequencesUI/constants/TabNames';
import SequencesCreateButton from 'SequencesUI/components/create/SequencesCreateButton';
import SequencesActionsButton from 'SequencesUI/components/SequencesActionsButton.js';
import UIRouterTab from 'ui-addon-react-router/UIRouterTab';
import UITabs from 'UIComponents/nav/UITabs';
import { parse, stringify } from 'hub-http/helpers/params';
var SequencesPageContainer = createReactClass({
  displayName: "SequencesPageContainer",
  propTypes: {
    activeTab: PropTypes.object.isRequired,
    backgroundColor: PropTypes.string,
    children: PropTypes.node.isRequired,
    fetchSequencesUsage: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    portalIsAtLimit: PropTypes.bool,
    usage: PropTypes.shape({
      count: PropTypes.number,
      limit: PropTypes.number
    })
  },
  contextTypes: {
    router: PropTypes.object.isRequired
  },
  componentDidMount: function componentDidMount() {
    var location = this.props.location; // Handle redirect for old query string tab approach.

    var _parse = parse(location.search.replace('?', '')),
        tab = _parse.tab,
        otherQueryParams = _objectWithoutProperties(_parse, ["tab"]);

    if (tab) {
      var pathname = tab === 'scheduled' ? "/scheduled" : '';
      var search = "?" + stringify(otherQueryParams);
      this.context.router.replace({
        pathname: pathname,
        search: search
      });
    }

    this.props.fetchSequencesUsage();
  },
  handleCreateFolder: function handleCreateFolder(folder) {
    IndexActions.createFolder({
      name: folder.name
    });
    tracker.track('sequencesUsage', {
      action: 'Created a folder',
      subscreen: 'sequences-index'
    });
  },
  renderHeaderButtons: function renderHeaderButtons() {
    var _this$props = this.props,
        usage = _this$props.usage,
        portalIsAtLimit = _this$props.portalIsAtLimit,
        location = _this$props.location;
    return /*#__PURE__*/_jsx(IndexHeaderButtons, {
      createButton: /*#__PURE__*/_jsxs(_Fragment, {
        children: [/*#__PURE__*/_jsx(SequencesActionsButton, {}), /*#__PURE__*/_jsx(SequencesCreateButton, {
          portalIsAtLimit: portalIsAtLimit
        })]
      }),
      usage: usage,
      contentType: SearchContentTypes.SEQUENCE,
      saveFolder: this.handleCreateFolder,
      location: location,
      showNewFolderButton: false
    });
  },
  renderTabs: function renderTabs() {
    var _this$props2 = this.props,
        location = _this$props2.location,
        activeTab = _this$props2.activeTab;
    return /*#__PURE__*/_jsx(UITabs, {
      defaultSelected: activeTab.tabId,
      children: getVisibleTabs().map(function (_ref) {
        var pathname = _ref.pathname,
            tabId = _ref.tabId,
            title = _ref.title;
        return /*#__PURE__*/_jsx(UIRouterTab, {
          tabId: tabId,
          title: title,
          to: {
            pathname: pathname,
            search: location.search
          }
        }, tabId);
      })
    });
  },
  render: function render() {
    var _this$props3 = this.props,
        backgroundColor = _this$props3.backgroundColor,
        children = _this$props3.children,
        location = _this$props3.location;
    return /*#__PURE__*/_jsxs(IndexContainer, {
      backgroundColor: backgroundColor,
      location: location,
      title: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "index.sequenceIndex.title"
      }),
      tabs: this.renderTabs(),
      children: [this.renderHeaderButtons(), /*#__PURE__*/_jsx(IndexBodySlot, {
        children: children
      })]
    });
  }
});
export default connect(function (state) {
  return {
    usage: state.sequencesUsage,
    portalIsAtLimit: getPortalIsAtLimit(state)
  };
}, {
  updateTableContentState: updateTableContentState,
  fetchSequencesUsage: SequenceActions.fetchSequencesUsage
})(SequencesPageContainer);