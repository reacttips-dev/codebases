'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import * as PageTypes from 'customer-data-objects/view/PageTypes';
import FilterBarEndSlot from './FilterBarEndSlot';
import QuickFilterContainer from '../../filter/QuickFilterContainer';
import { SearchBar } from '../searchBar';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import PropTypes from 'prop-types';
import { useMemo, useRef, useState } from 'react';
import { List } from 'immutable';
import styled from 'styled-components';
import { CALYPSO_LIGHT } from 'HubStyleTokens/colors';
import UIButton from 'UIComponents/button/UIButton';
import UIFilterBar from 'UIComponents/nav/UIFilterBar';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UIIcon from 'UIComponents/icon/UIIcon';
import FormattedMessage from 'I18n/components/FormattedMessage';
import PageType from 'customer-data-objects-ui-components/propTypes/PageType';
import ViewRecord from 'customer-data-objects/view/ViewRecord';
import { useBehavior } from '../../extensions/hooks/useBehavior';
import { QuickFilterProperties } from '../../extensions/constants/BehaviorTypes';
import { withAlertErrorBoundary } from '../../errorBoundary/withAlertErrorBoundary';
import FilterBarClearAllButton from './FilterBarClearAllButton';
import { useElementResized } from './useElementResized';
var MoreFiltersWrapper = styled.div.attrs(function (props) {
  return {
    'data-selenium-info': props.isActive ? 'filterbar-highlighted' : 'filterbar-plain',
    'data-selenium-test': 'morefilters-wrapper'
  };
}).withConfig({
  displayName: "FilterBar__MoreFiltersWrapper",
  componentId: "sc-1pq4ioh-0"
})(["", ";"], function (props) {
  return props.isActive && "background-color: " + CALYPSO_LIGHT + ";border-radius: 3px;";
});
export var isMoreFiltersHighlighted = function isMoreFiltersHighlighted(_ref) {
  var activeFilters = _ref.activeFilters,
      hiddenFilters = _ref.hiddenFilters,
      quickFilters = _ref.quickFilters;
  var hiddenButActiveFilters = activeFilters.filter(function (activeFilter) {
    // get quick filters hidden by browser width AND all active filters not in quick filters ("more filters")
    var activeFilterPropertyName = activeFilter.get('property');
    return hiddenFilters.includes(activeFilterPropertyName) || !quickFilters.includes(activeFilterPropertyName);
  });
  return hiddenButActiveFilters.size > 0;
};
var Inner = styled.div.withConfig({
  displayName: "FilterBar__Inner",
  componentId: "sc-1pq4ioh-1"
})(["display:flex;flex-wrap:no-wrap;"]);
var FilterBarSectionGeneric = styled.div.withConfig({
  displayName: "FilterBar__FilterBarSectionGeneric",
  componentId: "sc-1pq4ioh-2"
})(["display:inline-flex;height:40px;"]);
var Start = styled(FilterBarSectionGeneric).withConfig({
  displayName: "FilterBar__Start",
  componentId: "sc-1pq4ioh-3"
})(["flex-shrink:0;"]);
var Middle = styled(FilterBarSectionGeneric).attrs({
  className: 'p-left-3'
}).withConfig({
  displayName: "FilterBar__Middle",
  componentId: "sc-1pq4ioh-4"
})(["overflow:hidden;"]);
var End = styled(FilterBarSectionGeneric).withConfig({
  displayName: "FilterBar__End",
  componentId: "sc-1pq4ioh-5"
})(["flex-shrink:0;margin-left:auto;"]);

var getHtmlElementTop = function getHtmlElementTop(el) {
  return el.getBoundingClientRect().top;
};

var calculateHiddenQuickFilters = function calculateHiddenQuickFilters(containerComponent) {
  // The way we have our css setup, wrapped quick filters will be hidden
  // and the goal here is to determine which ones are wrapped, so we can
  // then determine which ones the user cant see
  //
  // A way of determining this is by comparing the "top" attribute of each
  // element and comparing it to its parent.
  //
  // If an element has the same "top" property as its parent, it is not
  // wrapped, and if it has a different "top" property, it IS wrapped
  // (small note - sometimes the "top" properties differ by ~1/8th pixel so we use Math.floor to essentially round that out)
  //
  // In order to get the "top"s of the quick filters container and its children
  // we use a react ref element to access the dom nodes directly
  // Below, you will find code to get the "top" of the quick filter container
  // , the "top"s of each quick filter, and logic to identify each quick filter
  // via its "name" attribute
  var containerTop = Math.floor(getHtmlElementTop(containerComponent));
  return Array.from(containerComponent.children).reduce(function (cumulative, child) {
    var childTop = Math.floor(getHtmlElementTop(child));

    if (childTop !== containerTop) {
      return [].concat(_toConsumableArray(cumulative), [child.getAttribute('name')]);
    }

    return cumulative;
  }, []);
};

export var FilterBar = function FilterBar(_ref2) {
  var filters = _ref2.filters,
      isModifiedView = _ref2.isModifiedView,
      isEditableView = _ref2.isEditableView,
      objectType = _ref2.objectType,
      onToggleAdvancedFiltersPanel = _ref2.onToggleAdvancedFiltersPanel,
      onOpenBoardSortModal = _ref2.onOpenBoardSortModal,
      onOpenEditCardsPanel = _ref2.onOpenEditCardsPanel,
      onOpenEditColumnsModal = _ref2.onOpenEditColumnsModal,
      onResetView = _ref2.onResetView,
      onSaveView = _ref2.onSaveView,
      onSaveViewAsNew = _ref2.onSaveViewAsNew,
      onUpdateFilterQuery = _ref2.onUpdateFilterQuery,
      onUpdateSearchQuery = _ref2.onUpdateSearchQuery,
      pageType = _ref2.pageType,
      pipelineId = _ref2.pipelineId,
      query = _ref2.query,
      user = _ref2.user,
      view = _ref2.view;
  var quickFilterPropertyNames = useBehavior(QuickFilterProperties);

  var _useState = useState([]),
      _useState2 = _slicedToArray(_useState, 2),
      hiddenQuickFilters = _useState2[0],
      setHiddenQuickFilters = _useState2[1];

  var quickFilterRef = useRef();
  useElementResized({
    componentRef: quickFilterRef,
    callback: function callback(domNode) {
      var newValue = calculateHiddenQuickFilters(domNode);
      setHiddenQuickFilters(newValue);
    }
  });
  var highlightMoreFilters = useMemo(function () {
    return isMoreFiltersHighlighted({
      activeFilters: filters,
      hiddenFilters: hiddenQuickFilters,
      quickFilters: quickFilterPropertyNames
    });
  }, [filters, hiddenQuickFilters, quickFilterPropertyNames]);
  var isBoard = pageType === PageTypes.BOARD;
  return /*#__PURE__*/_jsx(UIFilterBar, {
    className: "p-bottom-5 width-100 p-left-0 p-top-0",
    "data-onboarding": "filter-bar",
    Inner: Inner,
    Start: Start,
    Middle: Middle,
    End: End,
    startSlot: /*#__PURE__*/_jsx(_Fragment, {
      children: /*#__PURE__*/_jsx(UIFormControl, {
        "aria-label": "Search",
        children: /*#__PURE__*/_jsx(SearchBar, {
          objectType: objectType,
          onUpdateQuery: onUpdateSearchQuery,
          query: query
        })
      })
    }),
    middleSlot: /*#__PURE__*/_jsxs(_Fragment, {
      children: [/*#__PURE__*/_jsx(QuickFilterContainer, {
        ref: quickFilterRef,
        filters: filters // Needed to force useStoreDependency to use the correct object type
        // See: https://git.hubteam.com/HubSpot/CRM/pull/19601
        ,
        objectType: objectType,
        onUpdateQuery: onUpdateFilterQuery,
        quickFilterPropertyNames: quickFilterPropertyNames
      }, objectType), /*#__PURE__*/_jsx(MoreFiltersWrapper, {
        isActive: highlightMoreFilters,
        children: /*#__PURE__*/_jsxs(UIButton, {
          "data-onboarding": "advanced-filter-btn",
          "data-selenium-test": "advanced-filter-btn",
          onClick: onToggleAdvancedFiltersPanel,
          use: "transparent",
          children: [/*#__PURE__*/_jsx(UIIcon, {
            name: "filter"
          }), /*#__PURE__*/_jsx(FormattedMessage, {
            message: "indexPage.filterBar.openMoreFiltersPanel"
          })]
        })
      }), /*#__PURE__*/_jsx(FilterBarClearAllButton, {
        filters: filters,
        onUpdateQuery: onUpdateFilterQuery
      })]
    }),
    endSlot: /*#__PURE__*/_jsx(_Fragment, {
      children: /*#__PURE__*/_jsx(FilterBarEndSlot, {
        isBoard: isBoard,
        isModifiedView: isModifiedView,
        isEditableView: isEditableView,
        objectType: objectType,
        onOpenBoardSortModal: onOpenBoardSortModal,
        onOpenEditCardsPanel: onOpenEditCardsPanel,
        onOpenEditColumnsModal: onOpenEditColumnsModal,
        onResetView: onResetView,
        onSaveView: onSaveView,
        onSaveViewAsNew: onSaveViewAsNew,
        pipelineId: pipelineId,
        query: query,
        user: user,
        view: view
      })
    }),
    flush: true
  });
};
FilterBar.propTypes = {
  filters: PropTypes.instanceOf(List).isRequired,
  isModifiedView: PropTypes.bool.isRequired,
  isEditableView: PropTypes.bool.isRequired,
  objectType: AnyCrmObjectTypePropType.isRequired,
  onToggleAdvancedFiltersPanel: PropTypes.func.isRequired,
  onOpenBoardSortModal: PropTypes.func.isRequired,
  onOpenEditCardsPanel: PropTypes.func.isRequired,
  onOpenEditColumnsModal: PropTypes.func.isRequired,
  onUpdateFilterQuery: PropTypes.func.isRequired,
  onUpdateSearchQuery: PropTypes.func.isRequired,
  onResetView: PropTypes.func.isRequired,
  onSaveView: PropTypes.func.isRequired,
  onSaveViewAsNew: PropTypes.func.isRequired,
  pageType: PageType.isRequired,
  pipelineId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  query: PropTypes.string,
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    user_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  }).isRequired,
  view: PropTypes.instanceOf(ViewRecord).isRequired
};
export default withAlertErrorBoundary(FilterBar);