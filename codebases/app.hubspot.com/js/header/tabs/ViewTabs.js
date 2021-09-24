'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { createElement as _createElement } from "react";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { CrmLogger } from 'customer-data-tracking/loggers';
import { Map as ImmutableMap } from 'immutable';
import { connect } from 'general-store';
import { isResolved, isLoading } from 'crm_data/flux/LoadingStatus';
import * as Provisioning from '../../lib/Provisioning';
import * as ViewIdMapping from '../../crm_ui/views/ViewIdMapping';
import DefaultViewStore from 'crm_data/views/DefaultViewStore';
import PinnedViewsStore from '../../pinnedViews/stores/PinnedViewsStore';
import FormattedMessage from 'I18n/components/FormattedMessage';
import get from 'transmute/get';
import AddViewTab from './AddViewTab';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import PropTypes from 'prop-types';
import { Component } from 'react';
import styled from 'styled-components';
import toJS from 'transmute/toJS';
import UIBadge from 'UIComponents/badge/UIBadge';
import UIButton from 'UIComponents/button/UIButton';
import UIDropdownTab from 'UIComponents/nav/UIDropdownTab';
import UIFlex from 'UIComponents/layout/UIFlex';
import UITabs from 'UIComponents/nav/UITabs';
import UITruncateString from 'UIComponents/text/UITruncateString';
import ViewRecord from 'customer-data-objects/view/ViewRecord';
import ViewsStore from '../../crm_ui/flux/views/ViewsStore';
import UIIcon from 'UIComponents/icon/UIIcon';
import * as Colors from 'HubStyleTokens/colors';
import UIBox from 'UIComponents/layout/UIBox';
import ViewTabDropdown from './ViewTabDropdown';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { triggerWootricsSurvey } from '../../crm_ui/utils/triggerWootricsSurvey';
import { COMPANY_TYPE_ID, CONTACT_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import IsUngatedStore from 'crm_data/gates/IsUngatedStore';
import withGateOverride from 'crm_data/gates/withGateOverride';
import { normalizeTypeId } from '../../utils/normalizeTypeId';
import { PinnedViewLimit } from '../../rewrite/pinnedViews/constants/PinnedViewLimit';

var getViewDataForTabs = function getViewDataForTabs(tabsByViewKey, views) {
  return tabsByViewKey.reduce(function (accumulator, viewKey) {
    var viewId = ViewIdMapping.lookup(viewKey);
    var view = get(viewId, views);

    if (view) {
      accumulator.push({
        id: viewId,
        key: viewKey,
        data: view
      });
    }

    return accumulator;
  }, []);
};

var getIsViewInList = function getIsViewInList(viewList, viewToFind) {
  if (!viewToFind || !viewList) {
    return false;
  }

  return viewList.some(function (view) {
    return "" + view.id === "" + viewToFind.id;
  });
};

var PINNED_VIEW_LIMIT = 5;
var MINIMUM_VIEW_TAB_SIZE = 150;
var MAXIMUM_VIEW_TAB_SIZE = 500;
export var ResponsiveViewTabs = styled(UITabs).withConfig({
  displayName: "ViewTabs__ResponsiveViewTabs",
  componentId: "b0y3vj-0"
})(["min-width:", "px;line-height:16px;"], MINIMUM_VIEW_TAB_SIZE);
export var CenterAlignedBadge = styled(UIBadge).withConfig({
  displayName: "ViewTabs__CenterAlignedBadge",
  componentId: "b0y3vj-1"
})(["margin:5.5px 0 0 6px;"]);
export var ViewTabs = /*#__PURE__*/function (_Component) {
  _inherits(ViewTabs, _Component);

  function ViewTabs(props, context) {
    var _this;

    _classCallCheck(this, ViewTabs);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ViewTabs).call(this, props, context)); // TODO: We should store the temp view id in state, not the entire object

    _this.handleChangeView = function (_ref) {
      var value = _ref.target.value;
      var _this$props = _this.props,
          currentView = _this$props.currentView,
          onChangeView = _this$props.onChangeView,
          objectType = _this$props.objectType,
          isUngatedForCSATSurvey = _this$props.isUngatedForCSATSurvey;
      var objectTypeId = normalizeTypeId(objectType);

      if (value === currentView.id) {
        return;
      }

      onChangeView(value); // Show wootrics CSAT survey when changing saved views on the contact/company index page

      if ((objectTypeId === COMPANY_TYPE_ID || objectTypeId === CONTACT_TYPE_ID) && isUngatedForCSATSurvey) {
        triggerWootricsSurvey();
      }

      CrmLogger.log('openSavedView', {
        action: 'from pin'
      });
    };

    _this.state = {
      tempView: null
    };
    return _this;
  }

  _createClass(ViewTabs, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props2 = this.props,
          currentView = _this$props2.currentView,
          pinnedViews = _this$props2.pinnedViews; // HACK: If the current view is not in the set of pinned views, we need to set it as the temp view.
      // This handles the case where the component is only rendered once on load.

      if (!getIsViewInList(pinnedViews, currentView)) {
        this.setState({
          tempView: currentView
        });
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var prevView = prevProps.currentView,
          prevObjectType = prevProps.objectType,
          prevPinnedViews = prevProps.pinnedViews;
      var _this$props3 = this.props,
          nextView = _this$props3.currentView,
          nextObjectType = _this$props3.objectType,
          nextPinnedViews = _this$props3.pinnedViews;
      var tempView = this.state.tempView;
      var isNextViewPinned = getIsViewInList(nextPinnedViews, nextView);
      var wasPrevViewPinned = getIsViewInList(prevPinnedViews, prevView);
      var isNextViewChanged = "" + prevView.id !== "" + nextView.id;
      var isNextViewPinnedStatusChanged = isNextViewPinned !== wasPrevViewPinned;
      var isObjectTypeChanged = prevObjectType !== nextObjectType;
      var isNextViewNewTempView = !isNextViewPinned && (isNextViewChanged || isNextViewPinnedStatusChanged || !tempView);
      var isTempViewModifiedStatusChanged = !isNextViewChanged && prevView.modified !== nextView.modified;

      if (isNextViewNewTempView || isTempViewModifiedStatusChanged) {
        this.setState({
          tempView: nextView
        });
        return;
      }

      var isPrevViewPinned = getIsViewInList(nextPinnedViews, prevView);

      if (isNextViewChanged && !isPrevViewPinned && !isObjectTypeChanged) {
        this.setState({
          tempView: prevView
        });
        return;
      }

      var isTempViewPinned = getIsViewInList(nextPinnedViews, tempView);

      if (isTempViewPinned || isObjectTypeChanged) {
        this.setState({
          tempView: null
        });
        return;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          currentView = _this$props4.currentView,
          defaultViewId = _this$props4.defaultViewId,
          pinnedViews = _this$props4.pinnedViews,
          objectType = _this$props4.objectType,
          onCreateView = _this$props4.onCreateView,
          onOpenViewSelectorPage = _this$props4.onOpenViewSelectorPage,
          views = _this$props4.views,
          raisePinnedViewLimit = _this$props4.raisePinnedViewLimit;
      var tempView = this.state.tempView;
      var pinnedViewLimit = raisePinnedViewLimit ? PinnedViewLimit : PINNED_VIEW_LIMIT;
      var currentViewId = "" + currentView.id;
      var tempViewId = tempView && "" + tempView.id;
      var hasMaxPinnedViews = pinnedViews.length >= pinnedViewLimit;
      var currentViewIsPinned = pinnedViews.some(function (pinnedView) {
        return "" + pinnedView.id === currentViewId;
      });
      var tabViews = !tempView ? pinnedViews : pinnedViews.concat({
        data: views.get(tempViewId) || tempView,
        id: tempViewId,
        key: ViewIdMapping.get(tempViewId)
      });
      return /*#__PURE__*/_jsxs(UIFlex, {
        className: "m-top-1",
        children: [/*#__PURE__*/_jsx(ResponsiveViewTabs, {
          onSelectedChange: this.handleChangeView,
          selected: currentViewId,
          use: "enclosed",
          "data-onboarding": "gob385-tabs-wrapper",
          children: tabViews.map(function (view, index) {
            var viewId = "" + view.id;
            var isCurrentView = viewId === currentViewId;
            var isPinnedView = (!isCurrentView || currentViewIsPinned) && viewId !== tempViewId;

            var DropdownComponent = function DropdownComponent() {
              return /*#__PURE__*/_jsx(ViewTabDropdown, {
                objectType: objectType,
                view: view,
                isDefaultView: viewId === defaultViewId,
                isPinnedView: isPinnedView,
                hasMaxPinnedViews: hasMaxPinnedViews,
                pinnedViews: pinnedViews
              });
            }; // Adding conditionally data attribute for coaching tips
            // Only adds for the unassigned tab


            var dataCoachingTips = Object.assign({}, viewId === 'unassigned' && {
              'data-coaching-tips': 'unassigned-tab'
            });
            return /*#__PURE__*/_createElement(UIDropdownTab, Object.assign({
              "data-selenium-info": viewId,
              "data-selenium-test": "index-page-view-tab",
              "data-tab-pinned": isPinnedView ? 'true' : 'false'
            }, dataCoachingTips, {
              DropdownContent: DropdownComponent,
              key: "" + viewId + index,
              placement: "bottom right",
              tabId: viewId,
              title: /*#__PURE__*/_jsxs(UIFlex, {
                children: [isPinnedView && /*#__PURE__*/_jsx(UIIcon, {
                  className: "m-right-1",
                  color: viewId === currentViewId ? Colors.HEFFALUMP : Colors.EERIE,
                  name: "pin"
                }), /*#__PURE__*/_jsx(UITruncateString, {
                  maxWidth: isCurrentView ? MAXIMUM_VIEW_TAB_SIZE : MINIMUM_VIEW_TAB_SIZE,
                  useFlex: true,
                  children: view.data.name
                })]
              })
            }));
          })
        }), /*#__PURE__*/_jsxs(UIBox, {
          shrink: 0,
          children: [/*#__PURE__*/_jsx(AddViewTab, {
            currentViewId: currentViewId,
            objectType: objectType,
            handleChangeView: this.handleChangeView,
            onCreateView: onCreateView
          }), /*#__PURE__*/_jsx(UIButton, {
            "data-selenium-test": "index-page-all-views-btn",
            onClick: onOpenViewSelectorPage,
            use: "transparent",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "indexPage.tabs.allViews"
            })
          })]
        })]
      });
    }
  }]);

  return ViewTabs;
}(Component);
ViewTabs.propTypes = {
  views: ImmutablePropTypes.mapOf(PropTypes.instanceOf(ViewRecord)).isRequired,
  currentView: PropTypes.instanceOf(ViewRecord).isRequired,
  defaultViewId: PropTypes.string,
  pinnedViews: PropTypes.arrayOf(PropTypes.shape({
    data: PropTypes.instanceOf(ViewRecord).isRequired,
    id: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired
  })).isRequired,
  objectType: AnyCrmObjectTypePropType.isRequired,
  onChangeView: PropTypes.func.isRequired,
  onCreateView: PropTypes.func.isRequired,
  onOpenViewSelectorPage: PropTypes.func.isRequired,
  isUngatedForCSATSurvey: PropTypes.bool,
  raisePinnedViewLimit: PropTypes.bool
};
export var dependencies = {
  views: {
    propTypes: {
      objectType: AnyCrmObjectTypePropType.isRequired
    },
    stores: [ViewsStore],
    deref: function deref(_ref2) {
      var objectType = _ref2.objectType;
      return ViewsStore.get({
        objectType: objectType
      }) || ImmutableMap();
    }
  },
  defaultViewId: {
    propTypes: {
      objectType: AnyCrmObjectTypePropType.isRequired
    },
    stores: [DefaultViewStore],
    deref: function deref(_ref3) {
      var objectType = _ref3.objectType;
      return DefaultViewStore.get(objectType);
    }
  },
  pinnedViews: {
    propTypes: {
      objectType: AnyCrmObjectTypePropType.isRequired
    },
    stores: [PinnedViewsStore, ViewsStore, DefaultViewStore],
    deref: function deref(_ref4) {
      var objectType = _ref4.objectType;
      var pinnedViewKeys = toJS(PinnedViewsStore.get(objectType));
      var views = ViewsStore.get({
        objectType: objectType
      });
      var defaultViewId = DefaultViewStore.get(objectType);
      var defaultIsLoading = isLoading(defaultViewId);

      if (isResolved(pinnedViewKeys) && !pinnedViewKeys.length && !defaultIsLoading) {
        var defaultView = get(DefaultViewStore.get(objectType), views);
        Provisioning.saveDefaultPinnedViews(defaultView, objectType);
      }

      if (!pinnedViewKeys || !views) {
        return [];
      }

      return getViewDataForTabs(pinnedViewKeys, views);
    }
  },
  isUngatedForCSATSurvey: {
    stores: [IsUngatedStore],
    deref: function deref() {
      return withGateOverride('CRM:Index:WootricSurveyEnabled', IsUngatedStore.get('CRM:Index:WootricSurveyEnabled'));
    }
  }
};
ViewTabs.defaultProps = {
  raisePinnedViewLimit: false
};
export default connect(dependencies)(ViewTabs);