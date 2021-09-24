'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo, useCallback } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import { useSelector } from 'react-redux';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { useCurrentView } from '../../views/hooks/useCurrentView';
import { getAuthUser } from '../../auth/selectors/authSelectors';
import FilterBar from '../../../header/filterBar/FilterBar';
import { useViewActions } from '../../views/hooks/useViewActions';
import { useSearchTerm } from '../../search/hooks/useSearchTerm';
import { useNavigate } from '../../navigation/hooks/useNavigate';
import { useLegacyPageType } from '../../views/hooks/useLegacyPageType';
import { useCanUserEditView } from '../../views/hooks/useCanUserEditView';
import { alertFailure, alertSuccess } from '../../utils/alerts';
import { usePanelActions } from '../../overlay/hooks/usePanelActions';
import { useModalActions } from '../../overlay/hooks/useModalActions';
import { useOpenPanelType } from '../../overlay/hooks/useOpenPanelType';
import { FILTER_PANEL } from '../../overlay/constants/panelTypes';
import { useCurrentPipelineId } from '../../pipelines/hooks/useCurrentPipelineId';
import { useIsCurrentViewModified } from '../../views/hooks/useIsCurrentViewModified';

var doSuccessAlert = function doSuccessAlert(name) {
  return alertSuccess({
    message: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      message: "index.alerts.viewUpdate.success.message",
      options: {
        name: name
      }
    })
  });
};

var doFailureAlert = function doFailureAlert() {
  return alertFailure({
    title: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "index.alerts.viewUpdate.failure.title"
    })
  });
};

var FilterBarWrapper = function FilterBarWrapper() {
  var objectTypeId = useSelectedObjectTypeId();
  var searchTerm = useSearchTerm();
  var view = useCurrentView();
  var pageType = useLegacyPageType();
  var pipelineId = useCurrentPipelineId();
  var immutableUser = useSelector(getAuthUser);
  var user = useMemo(function () {
    return immutableUser.toJS();
  }, [immutableUser]);
  var canEditView = useCanUserEditView(view);
  var isViewModified = useIsCurrentViewModified();
  var openPanelType = useOpenPanelType();

  var _usePanelActions = usePanelActions(),
      openFilterPanel = _usePanelActions.openFilterPanel,
      openEditCardsPanel = _usePanelActions.openEditCardsPanel,
      closePanel = _usePanelActions.closePanel;

  var _useModalActions = useModalActions(),
      openEditColumnsModal = _useModalActions.openEditColumnsModal,
      openCreateViewModal = _useModalActions.openCreateViewModal,
      openBoardSortModal = _useModalActions.openBoardSortModal;

  var handleToggleFilterSidebar = useCallback(function () {
    if (openPanelType === FILTER_PANEL) {
      closePanel();
    } else {
      openFilterPanel();
    }
  }, [closePanel, openFilterPanel, openPanelType]);

  var _useViewActions = useViewActions(),
      onFiltersChanged = _useViewActions.onFiltersChanged,
      resetCurrentView = _useViewActions.resetCurrentView,
      saveCurrentView = _useViewActions.saveCurrentView;

  var navigate = useNavigate();
  var handleSearchChange = useCallback( // onUpdateSearchQuery is already debounced in IPRFilterBar, so no need to do it here.
  // We are explicitly setting query to undefined to omit it from the url if term is falsy.
  function (term) {
    return navigate({
      query: {
        query: term || undefined
      }
    });
  }, [navigate]);
  var handleSaveViewAsNew = useCallback(function () {
    return openCreateViewModal(view.id);
  }, [openCreateViewModal, view.id]);
  var handleSaveView = useCallback(function () {
    return saveCurrentView().then(function () {
      doSuccessAlert(view.name);
    }).catch(function () {
      doFailureAlert();
    });
  }, [saveCurrentView, view.name]);
  return /*#__PURE__*/_jsx(FilterBar, {
    objectType: objectTypeId,
    filters: view.filters,
    view: view,
    pageType: pageType,
    isModifiedView: isViewModified,
    isEditableView: canEditView,
    query: searchTerm,
    user: user,
    pipelineId: pipelineId,
    onOpenBoardSortModal: openBoardSortModal,
    onOpenEditCardsPanel: openEditCardsPanel,
    onToggleAdvancedFiltersPanel: handleToggleFilterSidebar,
    onOpenEditColumnsModal: openEditColumnsModal,
    onResetView: resetCurrentView,
    onSaveView: handleSaveView,
    onSaveViewAsNew: handleSaveViewAsNew,
    onUpdateFilterQuery: onFiltersChanged,
    onUpdateSearchQuery: handleSearchChange
  });
};

export default FilterBarWrapper;
export var WEBPACK_3_FORCE_MODULE_IMPORT = 1;