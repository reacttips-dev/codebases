'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import UIListingPage from 'UIComponents/page/UIListingPage';
import { AccessLevelContextProvider } from 'customer-data-properties/accessLevel/AccessLevelContext';
import AsyncOverlayContainer from '../../overlay/components/AsyncOverlayContainer';
import FilterBarWrapper from '../components/FilterBarWrapper';
import Header from './Header';
import { useSelectedObjectTypeDef } from '../../../crmObjects/hooks/useSelectedObjectTypeDef';
import { getPluralForm } from '../../../crmObjects/methods/getPluralForm';
import { trackOpenAllViewsPage } from '../../../crm_ui/tracking/indexPageTracking';
import { BOARD } from '../../views/constants/PageType';
import { useCurrentPageType } from '../../views/hooks/useCurrentPageType';
import { trackIndexPageView, LOG_INDEX_PAGE_VIEW_TYPES } from '../../../crm_ui/tracking/indexPageTracking';
import IndexPageTable from './IndexPageTable';
import FeedbackSurveyLoader from './FeedbackSurveyLoader';
import { CardPreferencesProvider } from '../../../crm_ui/board/cardPreferences/CardPreferencesContextProvider';
import { denormalizeTypeId } from '../../utils/denormalizeTypeId';
import AsyncIndexPageBoard from '../../board/components/AsyncIndexPageBoard';
import { setMostRecentlyUsedPageType } from '../utils/mostRecentlyUsedPageType';
import MainContentWrapper from '../../../pages/MainContentWrapper';
import IndexPageOnboarding from '../../../onboarding/IndexPageOnboarding';
import ViewSelectorPageWrapper from '../../views/components/ViewSelectorPageWrapper';
import CoachingTipsWrapper from '../../../onboarding/coachingTips/CoachingTipsWrapper';
import { ForbiddenPage } from '../../../pipelinePermissions/components/ForbiddenPage';
import { useCurrentPipelineId } from '../../pipelines/hooks/useCurrentPipelineId';
import { usePipelines } from '../../pipelines/hooks/usePipelines';
import { PipelineEmptyPage } from '../../pipelines/components/PipelineEmptyPage';
import { useHasAllGates } from '../../auth/hooks/useHasAllGates';
import withGateOverride from 'crm_data/gates/withGateOverride';
var ConditionalUIListingPage = styled(function (_ref) {
  var __shouldDisplay = _ref.shouldDisplay,
      props = _objectWithoutProperties(_ref, ["shouldDisplay"]);

  return /*#__PURE__*/_jsx(UIListingPage, Object.assign({}, props));
}).withConfig({
  displayName: "IndexPage__ConditionalUIListingPage",
  componentId: "sc-15xqpfb-0"
})(["display:", ";"], function (_ref2) {
  var shouldDisplay = _ref2.shouldDisplay;
  return shouldDisplay ? 'auto' : 'none';
}); // HACK: This prevents the header on pages with pipelines from hitting the
// mobile breakpoint and condensing

var FullPageContainer = styled.div.withConfig({
  displayName: "IndexPage__FullPageContainer",
  componentId: "sc-15xqpfb-1"
})(["min-width:1000px;"]);

var IndexPage = function IndexPage() {
  var typeDef = useSelectedObjectTypeDef();
  var currentPipelineId = useCurrentPipelineId();
  var pipelines = usePipelines();
  var hasAllGates = useHasAllGates();
  var isUngatedForFLPView = withGateOverride('CRM:Properties:FLPView', hasAllGates('CRM:Properties:FLPView'));
  useEffect(function () {
    document.title = getPluralForm(typeDef);
  }, [typeDef]);
  var pageType = useCurrentPageType();
  var isBoard = pageType === BOARD;
  useEffect(function () {
    trackIndexPageView({
      viewType: isBoard ? LOG_INDEX_PAGE_VIEW_TYPES.BOARD_VIEW : LOG_INDEX_PAGE_VIEW_TYPES.LIST_VIEW,
      typeDef: typeDef
    });
  }, [isBoard, typeDef]);
  useEffect(function () {
    setMostRecentlyUsedPageType(typeDef.objectTypeId, pageType);
  }, [pageType, typeDef.objectTypeId]);

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isViewSelectorPageOpen = _useState2[0],
      setIsViewSelectorPageOpen = _useState2[1];

  var handleToggleViewSelectorPage = useCallback(function () {
    if (!isViewSelectorPageOpen) {
      trackOpenAllViewsPage();
    }

    setIsViewSelectorPageOpen(!isViewSelectorPageOpen);
  }, [isViewSelectorPageOpen]);
  var objectType = denormalizeTypeId(typeDef.objectTypeId);
  var isEmptyBoard = isBoard && pipelines.length === 0;
  var shouldRenderPipelineLockScreen = isBoard && !isEmptyBoard && !currentPipelineId;
  var renderPage = useMemo(function () {
    if (isEmptyBoard) {
      return /*#__PURE__*/_jsx(PipelineEmptyPage, {});
    }

    if (shouldRenderPipelineLockScreen) {
      return /*#__PURE__*/_jsx(ForbiddenPage, {});
    }

    return /*#__PURE__*/_jsxs(MainContentWrapper, {
      $isBoard: isBoard,
      children: [/*#__PURE__*/_jsx(FilterBarWrapper, {}), isBoard ? /*#__PURE__*/_jsx(AsyncIndexPageBoard, {}) : /*#__PURE__*/_jsx(IndexPageTable, {})]
    });
  }, [isBoard, isEmptyBoard, shouldRenderPipelineLockScreen]);
  return /*#__PURE__*/_jsx(AccessLevelContextProvider, {
    active: isUngatedForFLPView,
    children: /*#__PURE__*/_jsxs(CardPreferencesProvider, {
      objectType: objectType,
      children: [/*#__PURE__*/_jsx(CoachingTipsWrapper, {
        objectType: objectType
      }), /*#__PURE__*/_jsx(FeedbackSurveyLoader, {}), /*#__PURE__*/_jsxs(FullPageContainer, {
        children: [/*#__PURE__*/_jsx(AsyncOverlayContainer, {}), /*#__PURE__*/_jsx(ViewSelectorPageWrapper, {
          isOpen: isViewSelectorPageOpen,
          onToggleViewSelectorPage: handleToggleViewSelectorPage
        }), /*#__PURE__*/_jsx(ConditionalUIListingPage, {
          shouldDisplay: !isViewSelectorPageOpen,
          pageLayout: "full-width",
          headerComponent: /*#__PURE__*/_jsx(Header, {
            onToggleViewSelectorPage: handleToggleViewSelectorPage
          }),
          children: renderPage
        }), /*#__PURE__*/_jsx(IndexPageOnboarding, {
          objectType: objectType
        })]
      })]
    })
  });
};

export default IndexPage;