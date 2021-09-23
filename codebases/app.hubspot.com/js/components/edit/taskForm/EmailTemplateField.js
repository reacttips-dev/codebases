'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import I18n from 'I18n';
import formatName from 'I18n/utils/formatName';
import { Map as ImmutableMap } from 'immutable';
import { isLoading, isEmpty } from 'SequencesUI/util/LoadingStatus';
import { tracker } from 'SequencesUI/util/UsageTracker';
import { canWriteTemplates } from 'SequencesUI/lib/permissions';
import { WILL_NAVIGATE_AWAY } from 'SequencesUI/util/taskDataObjects';
import { SCHEDULE_TASK } from 'SequencesUI/constants/SequenceStepTypes';
import * as TemplateApi from 'SequencesUI/api/TemplateApi';
import TemplateModal from 'SequencesUI/components/edit/TemplateModal';
import Small from 'UIComponents/elements/Small';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import { rethrowError } from 'UIComponents/core/PromiseHandlers';
import UIButton from 'UIComponents/button/UIButton';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import UITile from 'UIComponents/tile/UITile';
import UITileSection from 'UIComponents/tile/UITileSection';
import UITruncateString from 'UIComponents/text/UITruncateString';
import UIDropdown from 'UIComponents/dropdown/UIDropdown';
import UIList from 'UIComponents/list/UIList';

var EmailTemplateField = function EmailTemplateField(_ref) {
  var manualEmailMeta = _ref.value,
      onChange = _ref.onChange,
      handleAddTemplateClick = _ref.handleAddTemplateClick,
      templatesById = _ref.templatesById,
      templateData = _ref.templateData,
      updateTaskWithNewTemplate = _ref.updateTaskWithNewTemplate,
      updateTemplateMap = _ref.updateTemplateMap;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      templateModalOpen = _useState2[0],
      setTemplateModalOpen = _useState2[1];

  var _useState3 = useState(null),
      _useState4 = _slicedToArray(_useState3, 2),
      newlyAddedTemplate = _useState4[0],
      setNewlyAddedTemplate = _useState4[1];

  function onEditTemplateConfirm(_ref2) {
    var template = _ref2.template;
    var templateId = template.get('id');
    setTemplateModalOpen(false);
    updateTaskWithNewTemplate({
      template: template,
      templateId: templateId
    });
    onChange(SyntheticEvent(manualEmailMeta.set('templateId', templateId)));

    if (templatesById.has(templateId)) {
      updateTemplateMap(templateId, template);
    }
  }

  function onEditTemplateReject(err) {
    rethrowError(err);
    setTemplateModalOpen(false);
    setNewlyAddedTemplate(null);
  }

  function handleClickAdd() {
    tracker.track('createOrEditSequence', {
      action: 'Insert email into task'
    });
    onChange(SyntheticEvent(manualEmailMeta.set(WILL_NAVIGATE_AWAY, true)));
    handleAddTemplateClick();
  }

  function handleClickEdit() {
    tracker.track('createOrEditSequence', {
      action: "Edited " + SCHEDULE_TASK + " step"
    });
    var currentTemplate = templatesById.get(manualEmailMeta.get('templateId'));

    if (currentTemplate) {
      setTemplateModalOpen(true);
    } else {
      TemplateApi.fetchTemplate(manualEmailMeta.get('templateId')).then(function (fetchedTemplate) {
        setNewlyAddedTemplate(fetchedTemplate);
        setTemplateModalOpen(true);
      });
    }
  }

  function handleClickReplace() {
    tracker.track('createOrEditSequence', {
      action: "Replace email on " + SCHEDULE_TASK + " step"
    });
    onChange(SyntheticEvent(manualEmailMeta.set(WILL_NAVIGATE_AWAY, true)));
    handleAddTemplateClick();
  }

  function handleRemoveTemplate() {
    onChange(SyntheticEvent(ImmutableMap()));
  }

  function renderAddTemplate() {
    return /*#__PURE__*/_jsx(UITileSection, {
      children: /*#__PURE__*/_jsx(UIButton, {
        use: "link",
        onClick: handleClickAdd,
        "data-unit-test": "add-template",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "edit.taskPanel.emailTemplate.add"
        })
      })
    });
  }

  function renderTemplateNameActions(template) {
    return /*#__PURE__*/_jsxs("b", {
      children: [templateModalOpen && /*#__PURE__*/_jsx(TemplateModal, {
        originalTemplate: newlyAddedTemplate !== null ? newlyAddedTemplate : template,
        edit: true,
        onConfirm: onEditTemplateConfirm,
        onReject: onEditTemplateReject
      }), /*#__PURE__*/_jsx(UITruncateString, {
        "data-unit-test": "template-name-actions",
        useFlex: true,
        children: /*#__PURE__*/_jsx(UIDropdown, {
          "data-selenium-test": "template-name-actions-dropdown",
          "data-unit-test": "template-name-actions-dropdown",
          buttonUse: "link",
          buttonText: template.get('name'),
          placement: "bottom",
          menuWidth: "auto",
          children: /*#__PURE__*/_jsxs(UIList, {
            children: [/*#__PURE__*/_jsx(UIButton, {
              onClick: handleClickEdit,
              disabled: !canWriteTemplates(),
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "edit.taskPanel.emailTemplate.edit"
              })
            }, "templateEditAction"), /*#__PURE__*/_jsx(UIButton, {
              onClick: handleClickReplace,
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "edit.taskPanel.emailTemplate.replace"
              })
            }, "templateReplaceAction"), /*#__PURE__*/_jsx(UIButton, {
              onClick: handleRemoveTemplate,
              "data-unit-test": "template-remove",
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "edit.taskPanel.emailTemplate.remove"
              })
            }, "templateRemoveAction")]
          })
        })
      })]
    });
  }

  function renderTemplateDetails() {
    var id = manualEmailMeta.get('templateId');
    var template = templatesById.has(id) ? templatesById.get(id) : templateData;

    if (isEmpty(template)) {
      return /*#__PURE__*/_jsx(UITileSection, {
        "data-unit-test": "template-empty",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "edit.templateErrorNode.noAccessBody"
        })
      });
    } else if (isLoading(template)) {
      return /*#__PURE__*/_jsx(UITileSection, {
        children: /*#__PURE__*/_jsx(UILoadingSpinner, {
          grow: true
        })
      });
    }

    var updatedAt = template.get('updatedAt');
    var firstName = template.getIn(['userView', 'firstName']);
    var lastName = template.getIn(['userView', 'lastName']);
    return /*#__PURE__*/_jsxs(UITileSection, {
      "data-unit-test": "template-info",
      children: [renderTemplateNameActions(template), /*#__PURE__*/_jsx(Small, {
        className: "display-block",
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "edit.sidebarTemplateList.row.lastModified",
          options: {
            date: I18n.moment.userTz(updatedAt).fromNow(),
            owner: formatName({
              firstName: firstName,
              lastName: lastName
            })
          }
        })
      })]
    });
  }

  var hasTemplate = manualEmailMeta.get('templateId', false);
  return /*#__PURE__*/_jsx(_Fragment, {
    children: /*#__PURE__*/_jsx(UITile, {
      compact: true,
      children: hasTemplate ? renderTemplateDetails() : renderAddTemplate()
    })
  });
};

EmailTemplateField.propTypes = {
  value: PropTypes.instanceOf(ImmutableMap).isRequired,
  onChange: PropTypes.func,
  handleAddTemplateClick: PropTypes.func.isRequired,
  templatesById: PropTypes.instanceOf(ImmutableMap).isRequired,
  templateData: PropTypes.instanceOf(ImmutableMap),
  updateTaskWithNewTemplate: PropTypes.func.isRequired,
  updateTemplateMap: PropTypes.func.isRequired
};
export default EmailTemplateField;