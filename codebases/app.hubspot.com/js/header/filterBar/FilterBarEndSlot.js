'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import get from 'transmute/get';
import getPipelineIdFromView from '../../crm_ui/utils/getPipelineIdFromView';
import SaveViewButton from './SaveViewButton';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import PropTypes from 'prop-types';
import UIButton from 'UIComponents/button/UIButton';
import UIDropdown from 'UIComponents/dropdown/UIDropdown';
import UIList from 'UIComponents/list/UIList';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import ViewExportDialogPrompt from '../../crm_ui/prompts/view/ViewExportDialogPrompt';
import ViewRecord from 'customer-data-objects/view/ViewRecord';
import { useIsRewriteEnabled } from '../../rewrite/init/context/IsRewriteEnabledContext';
import { useHasAllScopes } from '../../rewrite/auth/hooks/useHasAllScopes';
import { isLegacyObjectType } from 'customer-data-objects/types/LegacyObjectType';
import { useModalActions } from '../../rewrite/overlay/hooks/useModalActions';
import { useSelectedObjectTypeDef } from '../../crmObjects/hooks/useSelectedObjectTypeDef';
import { getTypeHasExport } from '../../crmObjects/methods/getTypeHasExport';
import { normalizeTypeId } from '../../utils/normalizeTypeId';
import { useIsCurrentViewModified } from '../../rewrite/views/hooks/useIsCurrentViewModified';
import { EXPORT_PAGE_TYPES } from '../../rewrite/views/constants/ExportPageTypes';
import { getPipelineSettingsHref } from '../../utils/getPipelineSettingsHref';

var disabledTextViewExport = /*#__PURE__*/_jsx(FormattedMessage, {
  message: "indexPage.tabs.actions.disabledTooltip.export"
});

export var useHandleExportView = function useHandleExportView(_ref) {
  var ViewExportDialogPromptable = _ref.ViewExportDialogPromptable,
      view = _ref.view,
      objectType = _ref.objectType,
      query = _ref.query,
      user = _ref.user,
      pipelineId = _ref.pipelineId,
      exportPageType = _ref.exportPageType;
  var isRewriteEnabled = useIsRewriteEnabled();

  if (isRewriteEnabled) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    var isModified = useIsCurrentViewModified(); // eslint-disable-next-line react-hooks/rules-of-hooks

    var _useModalActions = useModalActions(),
        openViewExportModal = _useModalActions.openViewExportModal;

    return function () {
      return openViewExportModal({
        viewId: view.id,
        isModified: isModified,
        exportPageType: exportPageType
      });
    };
  }

  return function () {
    var viewToExport = getPipelineIdFromView(view) ? view : view.setIn(['state', 'pipelineId'], pipelineId);
    ViewExportDialogPromptable({
      objectType: objectType,
      query: query,
      view: viewToExport,
      isStateDirty: get('modified', view),
      userEmail: user.email,
      isCrmObject: !isLegacyObjectType(objectType),
      exportPageType: exportPageType
    });
  };
};
export var FilterBarEndSlot = function FilterBarEndSlot(_ref2) {
  var _ref2$ViewExportDialo = _ref2.ViewExportDialogPromptable,
      ViewExportDialogPromptable = _ref2$ViewExportDialo === void 0 ? ViewExportDialogPrompt : _ref2$ViewExportDialo,
      isBoard = _ref2.isBoard,
      isModifiedView = _ref2.isModifiedView,
      isEditableView = _ref2.isEditableView,
      objectType = _ref2.objectType,
      onOpenBoardSortModal = _ref2.onOpenBoardSortModal,
      onOpenEditCardsPanel = _ref2.onOpenEditCardsPanel,
      onOpenEditColumnsModal = _ref2.onOpenEditColumnsModal,
      onResetView = _ref2.onResetView,
      onSaveView = _ref2.onSaveView,
      onSaveViewAsNew = _ref2.onSaveViewAsNew,
      pipelineId = _ref2.pipelineId,
      query = _ref2.query,
      user = _ref2.user,
      view = _ref2.view;
  var pipelinesHref = getPipelineSettingsHref({
    objectTypeId: normalizeTypeId(objectType),
    pipelineId: pipelineId
  });
  var handleExportView = useHandleExportView({
    ViewExportDialogPromptable: ViewExportDialogPromptable,
    view: view,
    objectType: objectType,
    query: query,
    user: user,
    pipelineId: pipelineId,
    exportPageType: isBoard ? EXPORT_PAGE_TYPES.board : EXPORT_PAGE_TYPES.table
  });
  var typeDef = useSelectedObjectTypeDef();
  var isExportSupported = getTypeHasExport(typeDef);
  var hasAllScopes = useHasAllScopes();
  var isScopedForExport = hasAllScopes('crm-export');
  return /*#__PURE__*/_jsxs("div", {
    children: [isBoard ? /*#__PURE__*/_jsx(UIDropdown, {
      "data-selenium-test": "index-board-actions-dropdown",
      buttonText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "indexPage.filterBar.boardActions"
      }),
      buttonUse: "tertiary-light",
      children: /*#__PURE__*/_jsxs(UIList, {
        children: [/*#__PURE__*/_jsx(UIButton, {
          onClick: onOpenBoardSortModal,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "indexPage.filterBar.openSortOptions"
          })
        }), /*#__PURE__*/_jsx(UITooltip, {
          disabled: isScopedForExport,
          title: disabledTextViewExport,
          children: /*#__PURE__*/_jsx(UIButton, {
            "data-test-id": "export-view-" + view.id,
            disabled: !isScopedForExport,
            onClick: handleExportView,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "indexPage.tabs.actions.export"
            })
          })
        }), /*#__PURE__*/_jsx(UIButton, {
          "data-test-id": "edit-stages-button",
          external: true,
          href: pipelinesHref,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "indexPage.filterBar.editStagesLink"
          })
        }), /*#__PURE__*/_jsx(UIButton, {
          "data-test-id": "edit-cards-button",
          onClick: onOpenEditCardsPanel,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "indexPage.filterBar.openEditCardsPanel"
          })
        })]
      })
    }) : /*#__PURE__*/_jsx(UIDropdown, {
      "data-selenium-test": "index-table-actions-dropdown",
      buttonText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "indexPage.filterBar.tableActions"
      }),
      buttonUse: "tertiary-light",
      children: /*#__PURE__*/_jsxs(UIList, {
        children: [isExportSupported && /*#__PURE__*/_jsx(UITooltip, {
          disabled: isScopedForExport,
          title: disabledTextViewExport,
          children: /*#__PURE__*/_jsx(UIButton, {
            "data-test-id": "export-view-" + view.id,
            disabled: !isScopedForExport,
            onClick: handleExportView,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "indexPage.tabs.actions.export"
            })
          })
        }), /*#__PURE__*/_jsx(UIButton, {
          "data-selenium-test": "edit-columns-button",
          onClick: onOpenEditColumnsModal,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "indexPage.filterBar.openEditColumnsModal"
          })
        })]
      })
    }), /*#__PURE__*/_jsx(SaveViewButton, {
      isModifiedView: isModifiedView,
      isEditableView: isEditableView,
      onResetView: onResetView,
      onSaveView: onSaveView,
      onSaveViewAsNew: onSaveViewAsNew
    })]
  });
};
FilterBarEndSlot.propTypes = {
  isBoard: PropTypes.bool.isRequired,
  isModifiedView: PropTypes.bool.isRequired,
  isEditableView: PropTypes.bool.isRequired,
  objectType: AnyCrmObjectTypePropType.isRequired,
  onOpenBoardSortModal: PropTypes.func.isRequired,
  onOpenEditCardsPanel: PropTypes.func.isRequired,
  onOpenEditColumnsModal: PropTypes.func.isRequired,
  onResetView: PropTypes.func.isRequired,
  onSaveView: PropTypes.func.isRequired,
  onSaveViewAsNew: PropTypes.func.isRequired,
  pipelineId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  query: PropTypes.string,
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    user_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  }).isRequired,
  view: PropTypes.instanceOf(ViewRecord).isRequired,
  ViewExportDialogPromptable: PropTypes.func
};
export default FilterBarEndSlot;