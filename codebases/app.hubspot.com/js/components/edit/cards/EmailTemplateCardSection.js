'use es6';

import _taggedTemplateLiteralLoose from "@babel/runtime/helpers/esm/taggedTemplateLiteralLoose";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";

function _templateObject3() {
  var data = _taggedTemplateLiteralLoose(["Replace email on ", " step"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteralLoose(["Replace email on ", " step"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteralLoose(["Edited ", " step"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

import { Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { tracker, buildCreateOrEditSequenceActionString as buildString, trackViewTemplatesPermissionTooltip } from 'SequencesUI/util/UsageTracker';
import { SCHEDULE_TASK, SEND_TEMPLATE } from 'SequencesUI/constants/SequenceStepTypes';
import { rethrowError } from 'UIComponents/core/PromiseHandlers';
import { connect } from 'react-redux';
import { isLoading, isEmpty } from 'SequencesUI/util/LoadingStatus';
import { canWriteTemplates, canWrite } from 'SequencesUI/lib/permissions';
import { escape } from 'draft-plugins/lib/escapers';
import Small from 'UIComponents/elements/Small';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import UIExpandableText from 'UIComponents/text/UIExpandableText';
import UIFlex from 'UIComponents/layout/UIFlex';
import UITruncateString from 'UIComponents/text/UITruncateString';
import UIButton from 'UIComponents/button/UIButton';
import UIDropdown from 'UIComponents/dropdown/UIDropdown';
import UIList from 'UIComponents/list/UIList';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import * as SequenceEditorActions from 'SequencesUI/actions/SequenceEditorActions';
import ReadOnlyEditor from 'SequencesUI/components/async/AsyncReadOnlyEditor';
import TemplateModal from 'SequencesUI/components/edit/TemplateModal';
import { getCurrentUserView } from 'SequencesUI/util/convertToSearchResult';
import { getOwnerName } from 'SequencesUI/util/owner';
var EmailTemplateCardSection = createReactClass({
  displayName: "EmailTemplateCardSection",
  propTypes: {
    data: PropTypes.instanceOf(ImmutableMap),
    index: PropTypes.number.isRequired,
    firstTemplateStepIndex: PropTypes.number.isRequired,
    useThreadedFollowUps: PropTypes.bool,
    readOnly: PropTypes.bool,
    readOnlyEditorLoaded: PropTypes.bool.isRequired,
    isTaskStep: PropTypes.bool,
    fromCreatePage: PropTypes.bool,
    updateTemplate: PropTypes.func.isRequired,
    // only for task steps
    payload: PropTypes.instanceOf(ImmutableMap),
    openEditTaskPanel: PropTypes.func,
    openReplaceTemplatePanel: PropTypes.func,
    updateTask: PropTypes.func
  },
  getInitialState: function getInitialState() {
    return {
      templateModalOpen: false
    };
  },
  closeTemplateModal: function closeTemplateModal() {
    this.setState({
      templateModalOpen: false
    });
  },
  onEditTemplateConfirm: function onEditTemplateConfirm(_ref) {
    var template = _ref.template,
        savedAsNew = _ref.savedAsNew;
    var _this$props = this.props,
        index = _this$props.index,
        updateTemplate = _this$props.updateTemplate;
    this.closeTemplateModal();
    updateTemplate(index, template, savedAsNew);
  },
  onEditTemplateReject: function onEditTemplateReject(err) {
    rethrowError(err);
    this.closeTemplateModal();
  },
  handleEdit: function handleEdit() {
    var _this$props2 = this.props,
        readOnly = _this$props2.readOnly,
        isTaskStep = _this$props2.isTaskStep;

    if (readOnly) {
      return;
    }

    tracker.track('createOrEditSequence', {
      action: buildString(_templateObject(), isTaskStep ? SCHEDULE_TASK : SEND_TEMPLATE)
    });
    this.setState({
      templateModalOpen: true
    });
  },
  handleReplace: function handleReplace() {
    var _this$props3 = this.props,
        index = _this$props3.index,
        isTaskStep = _this$props3.isTaskStep,
        openEditTaskPanel = _this$props3.openEditTaskPanel,
        payload = _this$props3.payload,
        openReplaceTemplatePanel = _this$props3.openReplaceTemplatePanel;

    if (isTaskStep) {
      tracker.track('createOrEditSequence', {
        action: buildString(_templateObject2(), SCHEDULE_TASK)
      });
      openEditTaskPanel({
        index: index,
        payload: payload,
        showTaskForm: false
      });
    } else {
      tracker.track('createOrEditSequence', {
        action: buildString(_templateObject3(), SEND_TEMPLATE)
      });
      openReplaceTemplatePanel({
        index: index
      });
    }
  },
  handleRemove: function handleRemove() {
    var _this$props4 = this.props,
        isTaskStep = _this$props4.isTaskStep,
        updateTask = _this$props4.updateTask,
        index = _this$props4.index,
        payload = _this$props4.payload;

    if (isTaskStep) {
      var taskMeta = payload.getIn(['actionMeta', 'taskMeta']);
      var taskMetaTemplateRemoved = taskMeta.setIn(['manualEmailMeta', 'templateId'], null);
      updateTask(index, taskMetaTemplateRemoved.toObject());
    }
  },
  handlePermissionTooltipOpenChange: function handlePermissionTooltipOpenChange(_ref2) {
    var open = _ref2.target.value;
    if (open) trackViewTemplatesPermissionTooltip();
  },
  getActionsForStep: function getActionsForStep() {
    var isTaskStep = this.props.isTaskStep;
    return /*#__PURE__*/_jsxs(UIList, {
      children: [/*#__PURE__*/_jsx(UITooltip, {
        title: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequences.missingTemplatesWriteScope.editTemplate"
        }),
        disabled: canWriteTemplates(),
        onOpenChange: this.handlePermissionTooltipOpenChange,
        children: /*#__PURE__*/_jsx(UIButton, {
          onClick: this.handleEdit,
          disabled: !canWriteTemplates(),
          "data-selenium-test": "actions-dropdown-edit-template",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "edit.templateNode.templateNameActions.edit"
          })
        }, "templateEditAction")
      }), /*#__PURE__*/_jsx(UIButton, {
        onClick: this.handleReplace,
        disabled: !canWrite(),
        "data-selenium-test": "actions-dropdown-replace-template",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "edit.templateNode.templateNameActions.replace"
        })
      }, "templateReplaceAction"), isTaskStep && /*#__PURE__*/_jsx(UIButton, {
        onClick: this.handleRemove,
        disabled: !canWrite(),
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "edit.templateNode.templateNameActions.remove"
        })
      }, "templateRemoveAction")]
    });
  },
  renderTemplateName: function renderTemplateName() {
    var _this$props5 = this.props,
        data = _this$props5.data,
        readOnly = _this$props5.readOnly;
    var name = data.get('name');

    if (readOnly) {
      return /*#__PURE__*/_jsxs(UIFlex, {
        align: "center",
        children: [/*#__PURE__*/_jsx("strong", {
          className: "m-right-1",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "edit.templateNode.templateLine.template"
          })
        }), name]
      });
    }

    return /*#__PURE__*/_jsxs(UIFlex, {
      className: "editor-list-card-template-name",
      align: "center",
      children: [/*#__PURE__*/_jsx("strong", {
        className: "m-right-1",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "edit.templateNode.templateLine.template"
        })
      }), /*#__PURE__*/_jsx(UITruncateString, {
        useFlex: true,
        children: /*#__PURE__*/_jsx(UIDropdown, {
          "data-selenium-test": "template-name-actions-dropdown",
          buttonUse: "link",
          buttonText: name,
          placement: "bottom",
          menuWidth: "auto",
          children: this.getActionsForStep()
        })
      })]
    });
  },
  renderTemplateOwner: function renderTemplateOwner() {
    var userView = this.props.fromCreatePage ? getCurrentUserView() : this.props.data.get('userView');
    return /*#__PURE__*/_jsxs("span", {
      children: [/*#__PURE__*/_jsx("strong", {
        className: "m-right-1",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "edit.templateNode.templateLine.templateOwner"
        })
      }), getOwnerName(userView)]
    });
  },
  renderTemplateInfo: function renderTemplateInfo() {
    return /*#__PURE__*/_jsxs(UIFlex, {
      className: "editor-list-card-template-info editor-list-card-section",
      justify: "between",
      align: "end",
      children: [this.renderTemplateName(), this.renderTemplateOwner()]
    });
  },
  renderTemplateSubject: function renderTemplateSubject() {
    var _this$props6 = this.props,
        data = _this$props6.data,
        useThreadedFollowUps = _this$props6.useThreadedFollowUps,
        index = _this$props6.index,
        firstTemplateStepIndex = _this$props6.firstTemplateStepIndex;

    if (useThreadedFollowUps && index > firstTemplateStepIndex) {
      return /*#__PURE__*/_jsx("div", {
        className: "editor-list-card-subject",
        children: /*#__PURE__*/_jsx(Small, {
          use: "help",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "edit.templateNode.threadedSubject"
          })
        })
      });
    }

    var subject = escape(data.get('subject'));
    var subjectEditorState = data.get('subjectEditorState');
    return /*#__PURE__*/_jsxs(UIFlex, {
      align: "baseline",
      className: "editor-list-card-subject",
      children: [/*#__PURE__*/_jsx("strong", {
        className: "m-right-2",
        children: "Subject:"
      }), /*#__PURE__*/_jsx(ReadOnlyEditor, {
        text: subject,
        pluginType: "subject",
        editorState: subjectEditorState
      })]
    });
  },
  renderTemplateBody: function renderTemplateBody() {
    var _this$props7 = this.props,
        data = _this$props7.data,
        fromCreatePage = _this$props7.fromCreatePage;
    var body = data.get('body');
    var bodyEditorState = data.get('bodyEditorState');

    var editor = /*#__PURE__*/_jsx(ReadOnlyEditor, {
      text: body,
      pluginType: "body",
      editorState: bodyEditorState
    });

    if (fromCreatePage) {
      return editor;
    }

    return /*#__PURE__*/_jsx(UIExpandableText, {
      className: "editor-list-card-body-expandable",
      children: editor
    });
  },
  renderTemplateModal: function renderTemplateModal() {
    var data = this.props.data;

    if (this.state.templateModalOpen) {
      return /*#__PURE__*/_jsx(TemplateModal, {
        originalTemplate: data,
        edit: true,
        onConfirm: this.onEditTemplateConfirm,
        onReject: this.onEditTemplateReject,
        closeTemplateModal: this.closeTemplateModal
      });
    }

    return null;
  },
  render: function render() {
    var _this$props8 = this.props,
        data = _this$props8.data,
        readOnlyEditorLoaded = _this$props8.readOnlyEditorLoaded;

    if (isEmpty(data)) {
      return /*#__PURE__*/_jsx("div", {
        className: "editor-list-card-body p-top-0",
        style: {
          textAlign: 'center'
        },
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "edit.templateErrorNode.noAccessBody"
        })
      });
    }

    if (isLoading(data) || !readOnlyEditorLoaded) {
      return /*#__PURE__*/_jsx("div", {
        "data-shepherd": "template-node",
        className: "editor-list-card-section",
        children: /*#__PURE__*/_jsx(UILoadingSpinner, {
          grow: true
        })
      });
    }

    return /*#__PURE__*/_jsxs(_Fragment, {
      children: [this.renderTemplateInfo(), this.renderTemplateSubject(), /*#__PURE__*/_jsx("div", {
        className: "editor-list-card-body",
        children: this.renderTemplateBody()
      }), this.renderTemplateModal()]
    });
  }
});
export default connect(null, {
  deleteStep: SequenceEditorActions.deleteStep,
  updateTemplate: SequenceEditorActions.updateTemplate,
  updateTask: SequenceEditorActions.updateTask
})(EmailTemplateCardSection);