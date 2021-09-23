'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap, List } from 'immutable';
import I18n from 'I18n';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Fragment } from 'react';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import { tracker } from 'SequencesUI/util/UsageTracker';
import * as links from 'SequencesUI/lib/links';
import * as EditorTabNames from 'SequencesUI/constants/EditorTabNames';
import getQueryParams from 'SalesContentIndexUI/data/utils/getQueryParams';
import { getCurrentUserView } from 'SequencesUI/util/convertToSearchResult';
import { getOwnerName } from 'SequencesUI/util/owner';
import { GYPSUM, OLAF } from 'HubStyleTokens/colors';
import UIEditorPage from 'UIComponents/page/UIEditorPage';
import EditorHeader from './header/EditorHeader';
import EditorTabs from './EditorTabs';
import EditorMain from './editorMain/EditorMain';
import EditorPage from './EditorPage';
import EditorSettings from './EditorSettings';
import EditorAutomationTab from './EditorAutomationTab';
var ENTER = 13;
var SequenceEditor = createReactClass({
  displayName: "SequenceEditor",
  propTypes: {
    sequence: PropTypes.instanceOf(ImmutableMap).isRequired,
    counts: PropTypes.instanceOf(ImmutableMap),
    templateFolders: PropTypes.instanceOf(List).isRequired,
    sequenceEditor: PropTypes.instanceOf(ImmutableMap).isRequired,
    location: PropTypes.object.isRequired,
    updateSettings: PropTypes.func.isRequired,
    updateName: PropTypes.func.isRequired,
    saveSequence: PropTypes.func.isRequired,
    portalIsAtLimit: PropTypes.bool
  },
  contextTypes: {
    router: PropTypes.object.isRequired
  },
  getInitialState: function getInitialState() {
    var sequence = this.props.sequence;
    return {
      selectedTab: EditorTabNames.STEPS,
      sequenceSettings: sequence.get('sequenceSettings'),
      readOnlyEditorLoaded: false
    };
  },
  componentDidMount: function componentDidMount() {
    var _this = this;

    import(
    /* webpackChunkName: "draft-sales-modal-bundle" */
    'SequencesUI/components/edit/cards/ReadOnlyEditor').then(function () {
      _this.setState({
        readOnlyEditorLoaded: true
      });
    });
    tracker.track('pageView', {
      subscreen: 'sequence-editor'
    });
    window.onbeforeunload = this.beforeUnloadHandler;
  },
  componentWillUnmount: function componentWillUnmount() {
    window.onbeforeunload = undefined;
  },
  beforeUnloadHandler: function beforeUnloadHandler() {
    var saved = this.props.sequenceEditor.get('saved');

    if (!saved) {
      return I18n.text('edit.sequenceEditor.notSaved');
    }

    return null;
  },
  handleCancel: function handleCancel() {
    var sequence = this.props.sequence;
    var sequenceId = sequence.get('id');
    this.context.router.push({
      pathname: sequenceId === 'new' ? links.index() : links.summary(sequenceId),
      query: getQueryParams()
    });
  },
  handleEditName: function handleEditName(_ref) {
    var target = _ref.target;
    this.props.updateName(target.value);
  },
  handleEnterPress: function handleEnterPress(event) {
    if (event.keyCode === ENTER) {
      document.activeElement.blur();
    }
  },
  handleTabChange: function handleTabChange(_ref2) {
    var value = _ref2.target.value;
    this.setState({
      selectedTab: value
    });
  },
  getPageBackgroundColor: function getPageBackgroundColor() {
    var selectedTab = this.state.selectedTab;

    if (selectedTab === EditorTabNames.STEPS) {
      return GYPSUM;
    }

    return OLAF;
  },
  renderOwner: function renderOwner() {
    var sequence = this.props.sequence;
    var userView = sequence.get('id') === 'new' ? getCurrentUserView() : sequence.get('userView');
    return /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      className: "m-right-4",
      message: "edit.owner",
      options: {
        owner: getOwnerName(userView)
      }
    });
  },
  renderSettingsPage: function renderSettingsPage() {
    var selectedTab = this.state.selectedTab;
    var _this$props = this.props,
        sequence = _this$props.sequence,
        updateSettings = _this$props.updateSettings;

    if (selectedTab !== EditorTabNames.SETTINGS) {
      return null;
    }

    return /*#__PURE__*/_jsx(EditorPage, {
      tab: EditorTabNames.SETTINGS,
      selectedTab: selectedTab,
      children: /*#__PURE__*/_jsx(EditorSettings, {
        sequenceSettings: sequence.get('sequenceSettings'),
        updateSettings: updateSettings
      })
    });
  },
  renderAutomationPage: function renderAutomationPage() {
    var selectedTab = this.state.selectedTab;

    if (selectedTab !== EditorTabNames.AUTOMATION) {
      return null;
    }

    return /*#__PURE__*/_jsx(EditorPage, {
      tab: EditorTabNames.AUTOMATION,
      selectedTab: selectedTab,
      children: /*#__PURE__*/_jsx(EditorAutomationTab, {})
    });
  },
  renderPage: function renderPage() {
    var _this$props2 = this.props,
        sequence = _this$props2.sequence,
        counts = _this$props2.counts,
        sequenceEditor = _this$props2.sequenceEditor,
        templateFolders = _this$props2.templateFolders,
        location = _this$props2.location;
    var readOnlyEditorLoaded = this.state.readOnlyEditorLoaded;
    var selectedTab = this.state.selectedTab;
    var saved = sequenceEditor.get('saved');
    return /*#__PURE__*/_jsxs(Fragment, {
      children: [/*#__PURE__*/_jsx(EditorPage, {
        tab: EditorTabNames.STEPS,
        selectedTab: selectedTab,
        children: /*#__PURE__*/_jsx(EditorMain, {
          sequence: sequence,
          counts: counts,
          saved: saved,
          location: location,
          templateFolders: templateFolders,
          readOnlyEditorLoaded: readOnlyEditorLoaded
        })
      }), this.renderSettingsPage(), this.renderAutomationPage()]
    });
  },
  render: function render() {
    var _this$props3 = this.props,
        sequence = _this$props3.sequence,
        sequenceEditor = _this$props3.sequenceEditor,
        updateName = _this$props3.updateName,
        saveSequence = _this$props3.saveSequence,
        portalIsAtLimit = _this$props3.portalIsAtLimit,
        location = _this$props3.location;
    var selectedTab = this.state.selectedTab;
    return /*#__PURE__*/_jsx(UIEditorPage, {
      headerComponent: /*#__PURE__*/_jsx(EditorHeader, {
        sequence: sequence,
        sequenceEditor: sequenceEditor,
        location: location,
        updateName: updateName,
        saveSequence: saveSequence,
        portalIsAtLimit: portalIsAtLimit
      }),
      tabs: /*#__PURE__*/_jsx(EditorTabs, {
        selectedTab: selectedTab,
        handleTabChange: this.handleTabChange
      }),
      mainSectionFlush: true,
      mainBackgroundColor: this.getPageBackgroundColor(),
      children: this.renderPage()
    });
  }
});
export default SequenceEditor;