'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Map as ImmutableMap, List } from 'immutable';
import { NavMarker } from 'react-rhumb';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { connect } from 'react-redux';
import * as TemplateActions from 'SequencesUI/actions/TemplateActions';
import * as SequenceEditorActions from 'SequencesUI/actions/SequenceEditorActions';
import { getTemplateIdsFromSequence } from 'SequencesUI/util/templateUtils';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIAlert from 'UIComponents/alert/UIAlert';
import CardList from 'SequencesUI/components/edit/cards/CardList';
import SummaryBar from './SummaryBar';
import { getTemplatesById } from 'SequencesUI/selectors/templateSelectors';
var EditorMain = createReactClass({
  displayName: "EditorMain",
  propTypes: {
    counts: PropTypes.instanceOf(ImmutableMap),
    sequence: PropTypes.instanceOf(ImmutableMap).isRequired,
    templatesById: PropTypes.instanceOf(ImmutableMap).isRequired,
    saved: PropTypes.bool.isRequired,
    templateFolders: PropTypes.instanceOf(List).isRequired,
    readOnlyEditorLoaded: PropTypes.bool.isRequired,
    batchFetchTemplates: PropTypes.func.isRequired,
    insertStep: PropTypes.func.isRequired,
    toggleDependency: PropTypes.func.isRequired,
    switchStep: PropTypes.func.isRequired,
    replaceTemplate: PropTypes.func.isRequired
  },
  contextTypes: {
    router: PropTypes.object.isRequired
  },
  getDefaultProps: function getDefaultProps() {
    return {
      templatesById: ImmutableMap()
    };
  },
  getInitialState: function getInitialState() {
    return {
      showWarning: true
    };
  },
  componentDidMount: function componentDidMount() {
    var router = this.context.router;
    this.unbindRouteLeaveHook = router.setRouteLeaveHook(router.routes[1], this.transitionHook);
    var templateIds = getTemplateIdsFromSequence(this.props.sequence);
    this.props.batchFetchTemplates(templateIds);
  },
  componentWillUnmount: function componentWillUnmount() {
    this.unbindRouteLeaveHook();
  },
  transitionHook: function transitionHook() {
    var saved = this.props.saved;

    if (!saved) {
      return I18n.text('edit.editorMain.transitionHook');
    }

    return true;
  },
  hasActiveEnrollments: function hasActiveEnrollments() {
    var counts = this.props.counts;

    if (counts === null || counts === undefined || !counts.get('executing') || counts.get('executing') <= 0) {
      return false;
    }

    return true;
  },
  handleCloseWarning: function handleCloseWarning() {
    this.setState({
      showWarning: false
    });
  },
  renderEditWarning: function renderEditWarning() {
    var counts = this.props.counts;
    var showWarning = this.state.showWarning;

    if (!this.hasActiveEnrollments() || !showWarning) {
      return null;
    }

    var enrolled = counts.get('executing');
    return /*#__PURE__*/_jsx(UIAlert, {
      className: "sequence-editor-warning m-top-4 m-bottom-0",
      type: "warning",
      closeable: true,
      onClose: this.handleCloseWarning,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "edit.editorMain.editSequenceWarning",
        options: {
          count: enrolled
        }
      })
    });
  },
  render: function render() {
    var _this$props = this.props,
        templatesById = _this$props.templatesById,
        sequence = _this$props.sequence,
        templateFolders = _this$props.templateFolders,
        readOnlyEditorLoaded = _this$props.readOnlyEditorLoaded,
        insertStep = _this$props.insertStep,
        toggleDependency = _this$props.toggleDependency,
        switchStep = _this$props.switchStep,
        replaceTemplate = _this$props.replaceTemplate;
    return /*#__PURE__*/_jsxs(UIFlex, {
      direction: "row",
      style: {
        position: 'absolute',
        overflow: 'auto',
        height: '100%',
        width: '100%'
      },
      children: [/*#__PURE__*/_jsx(NavMarker, {
        name: "EDITOR_LOAD"
      }), /*#__PURE__*/_jsxs(UIFlex, {
        className: "sequence-card-list",
        align: "center",
        justify: "center",
        direction: "column",
        style: {
          width: '100%'
        },
        children: [this.renderEditWarning(), /*#__PURE__*/_jsx(SummaryBar, {
          sequence: sequence
        }), /*#__PURE__*/_jsx(CardList, {
          templatesById: templatesById,
          sequence: sequence,
          templateFolders: templateFolders,
          readOnlyEditorLoaded: readOnlyEditorLoaded,
          insertStep: insertStep,
          toggleDependency: toggleDependency,
          switchStep: switchStep,
          replaceTemplate: replaceTemplate
        })]
      })]
    });
  }
});
export default connect(function (state, props) {
  return {
    templatesById: getTemplatesById(state, props)
  };
}, {
  batchFetchTemplates: TemplateActions.batchFetchTemplates,
  insertStep: SequenceEditorActions.insertStep,
  toggleDependency: SequenceEditorActions.toggleDependency,
  switchStep: SequenceEditorActions.switchStep,
  replaceTemplate: SequenceEditorActions.replaceTemplate
})(EditorMain);