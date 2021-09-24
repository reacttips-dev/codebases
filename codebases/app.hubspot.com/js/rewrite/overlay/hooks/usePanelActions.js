'use es6';

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openPanelAction, closePanelAction } from '../actions/overlayActions';
import { getPanelType } from '../selectors/overlaySelectors';
import { EDIT_CARDS_PANEL, FILTER_PANEL, OBJECT_BUILDER_PANEL, PREVIEW_PANEL } from '../constants/panelTypes';
import { trackOpenMoreFiltersPanel, trackOpenPreviewSidebar } from '../../../crm_ui/tracking/indexPageTracking';
export var usePanelActions = function usePanelActions() {
  var dispatch = useDispatch();
  var panelType = useSelector(getPanelType);
  var openPanel = useCallback(function (type, data) {
    return dispatch(openPanelAction(type, data));
  }, [dispatch]);
  var closePanel = useCallback(function () {
    return dispatch(closePanelAction());
  }, [dispatch]);
  var openFilterPanel = useCallback(function () {
    if (panelType !== FILTER_PANEL) {
      trackOpenMoreFiltersPanel();
    }

    openPanel(FILTER_PANEL);
  }, [openPanel, panelType]);
  var openObjectBuilderPanel = useCallback(function () {
    return openPanel(OBJECT_BUILDER_PANEL);
  }, [openPanel]);
  var openPreviewPanel = useCallback(function (objectId) {
    trackOpenPreviewSidebar();
    openPanel(PREVIEW_PANEL, {
      objectId: objectId
    });
  }, [openPanel]);
  var openEditCardsPanel = useCallback(function () {
    return openPanel(EDIT_CARDS_PANEL);
  }, [openPanel]);
  return {
    openFilterPanel: openFilterPanel,
    openObjectBuilderPanel: openObjectBuilderPanel,
    openPreviewPanel: openPreviewPanel,
    openEditCardsPanel: openEditCardsPanel,
    closePanel: closePanel
  };
};