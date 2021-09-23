'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment, useCallback, useEffect, useState } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { connect } from 'react-redux';
import { getPortalIsAtTemplatesLimit, getUserIsAtTemplatesLimit } from 'SequencesUI/selectors/usageSelectors';
import * as TemplateActions from 'SequencesUI/actions/TemplateActions';
import { canWriteTemplates } from 'SequencesUI/lib/permissions';
import { tracker, trackViewTemplatesPermissionTooltip } from 'SequencesUI/util/UsageTracker';
import UITable from 'UIComponents/table/UITable';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UIButton from 'UIComponents/button/UIButton';
import { getCreateTemplateTooltip } from 'SequencesUI/util/creationTooltips';
import TemplateModal from 'SequencesUI/components/edit/TemplateModal';

var SidebarTemplateListCreateTemplateButton = function SidebarTemplateListCreateTemplateButton(_ref) {
  var selectTemplate = _ref.selectTemplate,
      templatesUsage = _ref.templatesUsage,
      portalIsAtTemplatesLimit = _ref.portalIsAtTemplatesLimit,
      userIsAtTemplatesLimit = _ref.userIsAtTemplatesLimit,
      createNewTemplate = _ref.createNewTemplate,
      fetchTemplateUsage = _ref.fetchTemplateUsage;
  useEffect(function () {
    fetchTemplateUsage();
  }, [fetchTemplateUsage]);

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      templateModalOpen = _useState2[0],
      setTemplateModalOpen = _useState2[1];

  function onCreateTemplateConfirm(_ref2) {
    var template = _ref2.template;
    createNewTemplate(template);
    tracker.track('createOrEditSequence', {
      action: 'Created template from scratch'
    });
    setTemplateModalOpen(false);
    selectTemplate({
      template: template,
      templateId: template.get('id'),
      isCustomTemplate: true
    });
  }

  function handleCreateNewTemplate() {
    setTemplateModalOpen(true);
  }

  function handleReject(err) {
    if (!err) {
      setTemplateModalOpen(false);
    }
  }

  var isCreateTemplateDisabled = !canWriteTemplates() || portalIsAtTemplatesLimit || userIsAtTemplatesLimit;
  var createTemplateTooltip = getCreateTemplateTooltip({
    templatesUsage: templatesUsage,
    portalIsAtTemplatesLimit: portalIsAtTemplatesLimit,
    userIsAtTemplatesLimit: userIsAtTemplatesLimit
  });
  var handlePermissionTooltipOpenChange = useCallback(function (_ref3) {
    var open = _ref3.target.value;
    if (open) trackViewTemplatesPermissionTooltip();
  }, []);
  var onOpenChange = canWriteTemplates() ? undefined : handlePermissionTooltipOpenChange;
  return /*#__PURE__*/_jsxs(Fragment, {
    children: [templateModalOpen && /*#__PURE__*/_jsx(TemplateModal, {
      edit: false,
      onConfirm: onCreateTemplateConfirm,
      onReject: handleReject
    }), /*#__PURE__*/_jsx(UITooltip, {
      title: createTemplateTooltip,
      disabled: !createTemplateTooltip,
      placement: "left",
      onOpenChange: onOpenChange,
      children: /*#__PURE__*/_jsx(UITable, {
        bordered: true,
        children: /*#__PURE__*/_jsx("tbody", {
          children: /*#__PURE__*/_jsx("tr", {
            children: /*#__PURE__*/_jsx("td", {
              children: /*#__PURE__*/_jsx(UIButton, {
                use: "link",
                onClick: handleCreateNewTemplate,
                "data-selenium-test": "create-template-button",
                disabled: isCreateTemplateDisabled,
                children: /*#__PURE__*/_jsx(FormattedMessage, {
                  message: "edit.sidebarTemplateList.createNew"
                })
              })
            })
          })
        })
      })
    })]
  });
};

export default connect(function (state) {
  return {
    templatesUsage: state.templatesUsage,
    portalIsAtTemplatesLimit: getPortalIsAtTemplatesLimit(state),
    userIsAtTemplatesLimit: getUserIsAtTemplatesLimit(state)
  };
}, {
  createNewTemplate: TemplateActions.createNewTemplate,
  fetchTemplateUsage: TemplateActions.fetchTemplateUsage
})(SidebarTemplateListCreateTemplateButton);