'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Fragment } from 'react';
import { Map as ImmutableMap } from 'immutable';
import { connect } from 'react-redux';
import { NavMarker } from 'react-rhumb';
import { canWrite } from 'SequencesUI/lib/permissions';
import { index } from 'SequencesUI/lib/links';
import * as RequestStatusTypes from 'SequencesUI/constants/RequestStatusTypes';
import * as TemplateActions from 'SequencesUI/actions/TemplateActions';
import * as SequenceActions from 'SequencesUI/actions/SequenceActions';
import * as SequenceEditorActions from 'SequencesUI/actions/SequenceEditorActions';
import { getPortalIsAtLimit } from 'SequencesUI/selectors/usageSelectors';
import { isLoading, isEmpty } from 'SequencesUI/util/LoadingStatus';
import SequenceEditor from 'SequencesUI/components/edit/SequenceEditor';
import NotFound from '../components/NotFound';
import UIErrorMessage from 'UIComponents/error/UIErrorMessage';
import FormattedMessage from 'I18n/components/FormattedMessage';
import withSequencesStatus from './withSequencesStatus';
var SequenceEditContainer = createReactClass({
  displayName: "SequenceEditContainer",
  propTypes: {
    route: PropTypes.object,
    location: PropTypes.object.isRequired,
    sequenceData: PropTypes.instanceOf(ImmutableMap),
    counts: PropTypes.instanceOf(ImmutableMap),
    sequenceEditor: PropTypes.instanceOf(ImmutableMap).isRequired,
    templateFolders: PropTypes.instanceOf(ImmutableMap),
    fetchTemplateFolders: PropTypes.func.isRequired,
    fetchSummaryCount: PropTypes.func.isRequired,
    params: PropTypes.object,
    updateSettings: PropTypes.func.isRequired,
    updateName: PropTypes.func.isRequired,
    saveSequence: PropTypes.func.isRequired,
    initializeSequenceEditor: PropTypes.func.isRequired,
    clearSequence: PropTypes.func.isRequired,
    portalIsAtLimit: PropTypes.bool,
    fetchTemplateUsage: PropTypes.func.isRequired
  },
  contextTypes: {
    router: PropTypes.object.isRequired
  },
  componentDidMount: function componentDidMount() {
    var _this$props = this.props,
        counts = _this$props.counts,
        fetchSummaryCount = _this$props.fetchSummaryCount,
        sequenceId = _this$props.params.sequenceId,
        fetchTemplateFolders = _this$props.fetchTemplateFolders,
        initializeSequenceEditor = _this$props.initializeSequenceEditor,
        fetchTemplateUsage = _this$props.fetchTemplateUsage;
    var location = this.context.router.location;

    if (sequenceId === 'new' && !canWrite()) {
      this.context.router.replace(index());
      return;
    }

    fetchTemplateFolders();
    fetchTemplateUsage();
    initializeSequenceEditor(sequenceId, location.query.folder);

    if (sequenceId && sequenceId !== 'new' && !counts) {
      fetchSummaryCount(sequenceId);
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    this.props.clearSequence();
  },
  render: function render() {
    var _this$props2 = this.props,
        route = _this$props2.route,
        location = _this$props2.location,
        sequenceData = _this$props2.sequenceData,
        counts = _this$props2.counts,
        sequenceEditor = _this$props2.sequenceEditor,
        updateSettings = _this$props2.updateSettings,
        updateName = _this$props2.updateName,
        saveSequence = _this$props2.saveSequence,
        templateFolders = _this$props2.templateFolders,
        portalIsAtLimit = _this$props2.portalIsAtLimit;

    if (isLoading(sequenceData.get('sequence')) || templateFolders.get('requestStatus') === RequestStatusTypes.LOADING) {
      return /*#__PURE__*/_jsx("div", {});
    }

    if (isEmpty(sequenceData.get('sequence'))) {
      return /*#__PURE__*/_jsxs(Fragment, {
        children: [/*#__PURE__*/_jsx(NavMarker, {
          name: "EDITOR_FAIL"
        }), /*#__PURE__*/_jsx(NotFound, {})]
      });
    }

    if (templateFolders.get('requestStatus') === RequestStatusTypes.FAILED) {
      return /*#__PURE__*/_jsxs(UIErrorMessage, {
        children: [/*#__PURE__*/_jsx(NavMarker, {
          name: "EDITOR_FAIL"
        }), /*#__PURE__*/_jsxs("p", {
          children: [/*#__PURE__*/_jsx(FormattedMessage, {
            message: "sequencesui.fetchFailedGenericErrorMessage.title"
          }), /*#__PURE__*/_jsx("br", {}), /*#__PURE__*/_jsx(FormattedMessage, {
            message: "sequencesui.fetchFailedGenericErrorMessage.CTA"
          })]
        })]
      });
    }

    return /*#__PURE__*/_jsx(SequenceEditor, {
      sequence: sequenceData.get('sequence'),
      counts: counts,
      templateFolders: templateFolders.get('results'),
      sequenceEditor: sequenceEditor,
      route: route,
      location: location,
      updateSettings: updateSettings,
      updateName: updateName,
      saveSequence: saveSequence,
      portalIsAtLimit: portalIsAtLimit
    });
  }
});
export default withSequencesStatus(connect(function (state, props) {
  return {
    templateFolders: state.templateFolders,
    counts: state.summaryCount.get(props.params.sequenceId),
    sequenceEditor: state.sequenceEditor,
    sequenceData: state.sequenceEditor,
    portalIsAtLimit: getPortalIsAtLimit(state)
  };
}, {
  fetchTemplateFolders: TemplateActions.fetchTemplateFolders,
  fetchSummaryCount: SequenceActions.fetchSummaryCount,
  updateSettings: SequenceEditorActions.updateSettings,
  updateName: SequenceEditorActions.updateName,
  saveSequence: SequenceEditorActions.saveSequence,
  fetchSequence: SequenceActions.fetchSequence,
  initializeSequenceEditor: SequenceEditorActions.initializeSequenceEditor,
  clearSequence: SequenceEditorActions.clearSequence,
  fetchTemplateUsage: TemplateActions.fetchTemplateUsage
})(SequenceEditContainer));