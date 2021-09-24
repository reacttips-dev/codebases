'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import * as Alerts from 'customer-data-ui-utilities/alerts/Alerts';
import * as objectBuilderErrors from '../objectBuilder/objectBuilderErrors';
import { ObjectTypeFromIds } from 'customer-data-objects/constants/ObjectTypeIds';
import * as UserSettingsActions from 'crm_data/settings/UserSettingsActions';
import * as ViewTypes from 'customer-data-objects/view/ViewTypes';
import * as PageTypes from 'customer-data-objects/view/PageTypes';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import { AccessLevelContextProvider } from 'customer-data-properties/accessLevel/AccessLevelContext';
import { CrmLogger } from 'customer-data-tracking/loggers';
import { Map as ImmutableMap, Set as ImmutableSet, fromJS } from 'immutable';
import { stringify } from 'hub-http/helpers/params';
import { getFragmentBy } from '../crm_ui/legacy/utils/URLSegments';
import { useStoreDependency } from 'general-store';
import FeedbackLoader from 'feedback-loader';
import BoardSortModal from '../board/deals/components/BoardSortModal';
import { EditCardsPanel } from '../board/editCardsPanel';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import { temporarilyIncludeId, temporarilyExcludeIds, resetTemporaryIds } from '../crm_ui/flux/grid/GridUIActions';
import AdvancedFiltersContainer from '../filter/AdvancedFiltersContainer';
import EditColumnsModal from '../modals/EditColumnsModal';
import FilterBar from '../header/filterBar/FilterBar';
import Table from '../table/Table';
import Board from '../board/Board';
import Header from '../header/Header';
import PreviewSidebar from '../previewSidebar/PreviewSidebar';
import ObjectBuilder from '../objectBuilder/ObjectBuilder';
import ViewActionModal, { ViewActionModalActions } from '../modals/ViewActionModal';
import ViewSelectorPage from '../viewSelectorPage/ViewSelectorPage';
import IsUngatedStore from 'crm_data/gates/IsUngatedStore';
import ObjectsActions from 'crm_data/objects/ObjectsActions';
import KnowledgeBaseButton from 'ui-addon-i18n/components/KnowledgeBaseButton';
import { save } from 'crm_data/settings/LocalSettingsActions';
import OwnerReferenceResolver from 'reference-resolvers/resolvers/OwnerReferenceResolver';
import PageType from 'customer-data-objects-ui-components/propTypes/PageType';
import PageRefreshUsageLogger from '../crm_ui/components/shared/PageRefreshUsageLogger';
import PortalIdParser from 'PortalIdParser';
import PropTypes from 'prop-types';
import ProvideReferenceResolvers from 'reference-resolvers/ProvideReferenceResolvers';
import { useEffect, useReducer, useState, useCallback, useMemo } from 'react';
import { OWNER } from 'reference-resolvers/constants/ReferenceObjectTypes';
import RouterContainer from '../containers/RouterContainer';
import UIListingPage from 'UIComponents/page/UIListingPage';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import UniversalSaveBar from 'customer-data-properties/savebar/UniversalSaveBar';
import UserPortalSettingsKeys from 'crm_data/settings/UserPortalSettingsKeys';
import UserStore from 'crm_data/user/UserStore';
import ViewsActions from '../crm_ui/flux/views/ViewsActions';
import buildQueryString from '../crm_ui/utils/buildQueryString';
import getIn from 'transmute/getIn';
import get from 'transmute/get';
import links from 'crm-legacy-links/links';
import objectNameDependency from '../crm_ui/dependencies/objectNameDependency';
import partial from 'transmute/partial';
import { setLastAccessedView } from '../crm_ui/grid/utils/gridStateLocalStorage';
import withGateOverride from 'crm_data/gates/withGateOverride';
import { delayUntilIdle } from '../crm_ui/utils/delayUntilIdle';
import { DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import { MARKETING_EVENT_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import { useSelectedObjectTypeDef } from '../crmObjects/hooks/useSelectedObjectTypeDef';
import { useBoardSortSettings } from '../crm_ui/board/hooks/useBoardSortSettings';
import Loadable from 'UIComponents/decorators/Loadable';
import { getRootUrl } from '../utils/urls';
import ViewRecord from 'customer-data-objects/view/ViewRecord';
import { usePipelineId } from '../crm_ui/board/contexts/PipelineIdContext';
import { usePipelinePermissions } from '../pipelinePermissions/hooks/usePipelinePermissions';
import { trackEditSavedView, trackOpenAllViewsPage, trackOpenEditColumnsModal, trackOpenMoreFiltersPanel, trackOpenPreviewSidebar } from '../crm_ui/tracking/indexPageTracking';
import { HIDDEN } from 'crm_data/pipelinePermissions/pipelinePermissionsConstants';
import { ForbiddenPage } from '../pipelinePermissions/components/ForbiddenPage';
import { useIsMounted } from '../crm_ui/hooks/useIsMounted';
import IndexPageOnboarding from '../onboarding/IndexPageOnboarding';
import Pipeline, { allPipelineStores } from '../crm_ui/filter/pipelineTypes/all';
import { EMPTY, isResolved } from 'crm_data/flux/LoadingStatus';
import MainContentWrapper from './MainContentWrapper';
import CoachingTipsWrapper from '../onboarding/coachingTips/CoachingTipsWrapper';
import { refreshDealSplits } from 'deal-splits-cards-ui/utils/WindowEvents';
var IndexPageAlerts = Loadable({
  loader: function loader() {
    return import('crm-index-ui/alerts/IndexPageAlerts').then(function (mod) {
      return mod.default;
    });
  },
  LoadingComponent: function LoadingComponent() {
    return null;
  },
  ErrorComponent: function ErrorComponent() {
    return null;
  }
});
var MARKETING_EVENT_FEEDBACK_ID = 340;

var objectTypeSupportsPipelines = function objectTypeSupportsPipelines(type) {
  return type === DEAL || type === TICKET;
};

export var pipelinesDep = {
  stores: allPipelineStores,
  deref: function deref(_ref) {
    var objectType = _ref.objectType;

    if (objectTypeSupportsPipelines(objectType)) {
      return Pipeline.getPipelines(objectType);
    }

    return EMPTY;
  }
};
export var userDep = UserStore;
export var isUngatedForCSATSurveyDependency = {
  stores: [IsUngatedStore],
  deref: function deref() {
    return withGateOverride('CRM:Index:WootricSurveyEnabled', IsUngatedStore.get('CRM:Index:WootricSurveyEnabled'));
  }
};
var isUngatedForFLPViewDependency = {
  stores: [IsUngatedStore],
  deref: function deref() {
    return withGateOverride('CRM:Properties:FLPView', IsUngatedStore.get('CRM:Properties:FLPView'));
  }
};
var panels = {
  advancedFiltersPanel: 'AdvancedFiltersPanel',
  editCardsPanel: 'EditCardsPanel',
  objectBuilderPanel: 'ObjectBuilderPanel',
  previewSidebarPanel: 'PreviewSidebarPanel',
  none: 'none'
};
var modals = {
  editColumnsModal: 'EditColumnsModal',
  boardSortModal: 'BoardSortModal',
  viewActionModal: 'ViewActionModal',
  none: 'none'
};
var panelStateAllClosed = {
  isViewSelectorPageOpen: false,
  openModal: modals.none,
  openPanel: panels.none,
  modalOptions: {},
  panelOptions: {}
};
export var actions = {
  closeAll: 'closeAll',
  closeModal: 'closeModal',
  closePanel: 'closePanel',
  closeViewSelectorPage: 'closePage',
  openModal: 'openModal',
  openPanel: 'openPanel',
  openViewSelectorPage: 'openViewSelectorPage',
  toggleAdvancedFiltersPanel: 'toggleAdvancedFiltersPanel',
  togglePreviewSidebarPanel: 'togglePreviewSidebarPanel'
};

function reducer(state, action) {
  switch (action.type) {
    case actions.closeAll:
      return panelStateAllClosed;

    case actions.closeModal:
      return Object.assign({}, state, {
        openModal: modals.none,
        modalOptions: {}
      });

    case actions.closePanel:
      return Object.assign({}, state, {
        openPanel: panels.none,
        panelOptions: {}
      });

    case actions.closeViewSelectorPage:
      return Object.assign({}, state, {
        isViewSelectorPageOpen: false
      });

    case actions.openModal:
      return Object.assign({}, state, {
        openModal: action.modalName,
        modalOptions: action.modalOptions || {}
      });

    case actions.openPanel:
      return Object.assign({}, state, {
        openPanel: action.panelName,
        panelOptions: action.panelOptions || {}
      });

    case actions.openViewSelectorPage:
      return Object.assign({}, state, {
        isViewSelectorPageOpen: true
      });

    case actions.togglePreviewSidebarPanel:
      return Object.assign({}, state, {
        openPanel: action.options.subjectId === state.panelOptions.subjectId && action.options.objectType === state.panelOptions.objectType ? panels.none : panels.previewSidebarPanel,
        panelOptions: action.options.subjectId === state.panelOptions.subjectId && action.options.objectType === state.panelOptions.objectType ? {} : action.options
      });

    default:
      return state;
  }
}

var handleUpdateColumnsOnDefaultView = function handleUpdateColumnsOnDefaultView(objectType, newColumns) {
  var isCrmObject = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var favoriteSettingsKey = isCrmObject ? "CRM:" + objectType + ":FavoriteColumns:" + PortalIdParser.get() : UserPortalSettingsKeys["COLUMN_FAVS_" + objectType];
  UserSettingsActions.saveUserSetting(favoriteSettingsKey, newColumns).catch(function (error) {
    if (error.message.indexOf('encodedValue.length') !== -1) {
      var alertMessage = /*#__PURE__*/_jsx(FormattedJSXMessage, {
        elements: {
          Link: KnowledgeBaseButton
        },
        message: "GenericGrid.error.maxColumns_jsx",
        options: {
          useZorse: true,
          url: 'https://knowledge.hubspot.com/articles/kcs_article/contacts/create-saved-filters'
        }
      });

      Alerts.addAlert({
        message: alertMessage,
        type: 'danger'
      });
    }
  });
};

var handleChangeSort = function handleChangeSort(opts) {
  var direction = opts.direction,
      sortKey = opts.sortKey,
      propertyLabel = opts.propertyLabel,
      objectType = opts.objectType,
      orderText = opts.orderText,
      viewId = opts.viewId;
  var objectTypeKey = objectType === DEAL ? 'deals' : 'tickets';
  save(objectTypeKey + ".boardSort.direction", direction);
  save(objectTypeKey + ".boardSort.orderText", orderText);
  save(objectTypeKey + ".boardSort.propertyLabel", propertyLabel);
  save(objectTypeKey + ".boardSort.sortColumnName", sortKey);
  save(objectTypeKey + ".boardSort.sortKey", sortKey);
  ViewsActions.sort(ImmutableMap({
    direction: direction,
    objectType: objectType,
    sortColumnName: sortKey,
    sortKey: sortKey,
    viewId: viewId
  }));
  var messageOptions = {
    propertyLabel: propertyLabel,
    orderText: orderText
  };
  Alerts.addSuccess("pipelineBoardSortModal.alertSuccess." + objectType, messageOptions);
  CrmLogger.log('indexInteractions', {
    action: 'sorted board by property',
    property: sortKey,
    subAction: direction === 1 ? 'DESCENDING' : 'ASCENDING'
  });
};

var _handleUpdateColumns = function _handleUpdateColumns(objectType, isCrmObject, view, newColumns) {
  if (!newColumns) {
    return;
  }

  var newColumnsFormatted = newColumns.map(function (column) {
    return fromJS({
      name: column
    });
  });
  ViewsActions.changeColumns(fromJS({
    objectType: objectType,
    viewId: view.id,
    columns: newColumnsFormatted
  }));

  if (view.type === ViewTypes.DEFAULT) {
    handleUpdateColumnsOnDefaultView(objectType, newColumns, isCrmObject);
  }
};

var getColumnsWithNewFilters = function getColumnsWithNewFilters(view, filters) {
  var columns = view.columns.map(function (column) {
    return column.get('name');
  }).toArray();
  filters.forEach(function (filter) {
    var filterPropertyName = get('property', filter);
    var isNewFilter = !view.filters.some(function (oldFilter) {
      return get('property', oldFilter) === filterPropertyName;
    });
    var isColumnAlready = columns.includes(filterPropertyName);

    if (isNewFilter && !isColumnAlready) {
      columns.push(filterPropertyName);
    }
  });
  return columns;
};

var handleUpdateFilterQuery = function handleUpdateFilterQuery(objectType, isCrmObject, view, filters) {
  var options = fromJS({
    viewId: view.id,
    objectType: objectType,
    filters: filters
  });
  ViewsActions.changeFilters(options);
  resetTemporaryIds();

  if (filters) {
    var columns = getColumnsWithNewFilters(view, filters);

    _handleUpdateColumns(objectType, isCrmObject, view, columns);
  }
};

export var navigateToView = function navigateToView(_ref2) {
  var query = _ref2.query,
      isCrmObject = _ref2.isCrmObject,
      objectType = _ref2.objectType,
      pageType = _ref2.pageType,
      viewId = _ref2.viewId,
      dispatch = _ref2.dispatch;
  dispatch({
    type: actions.closeAll
  });
  setLastAccessedView({
    objectType: objectType,
    viewId: viewId
  });
  var queryString = query ? stringify(query) : '';

  if (isCrmObject) {
    var link = links.indexFromObjectTypeId({
      viewId: viewId,
      pageType: pageType === PageTypes.BOARD ? 'board' : 'list',
      objectTypeId: objectType
    });
    RouterContainer.get().navigate(link + "?" + queryString, {
      trigger: true
    });
  } else {
    var baseUrl = links.indexFromObjectType(objectType, false);
    var pageName = pageType === PageTypes.BOARD ? 'board' : 'list';
    RouterContainer.get().navigate("" + baseUrl + pageName + "/view/" + viewId + "/?" + queryString, {
      trigger: true
    });
  }
};
export var IndexPage = function IndexPage(props) {
  var isCrmObject = props.isCrmObject,
      objectType = props.objectType,
      pageType = props.pageType,
      query = props.query,
      view = props.view;
  var isMounted = useIsMounted();

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isIdle = _useState2[0],
      setIdle = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      isSearching = _useState4[0],
      setSearching = _useState4[1];

  var _useState5 = useState(query.query || ''),
      _useState6 = _slicedToArray(_useState5, 2),
      prevQuery = _useState6[0],
      setPrevQuery = _useState6[1];

  var _usePipelineId = usePipelineId(),
      pipelineId = _usePipelineId.pipelineId,
      setPipelineId = _usePipelineId.setPipelineId;

  var pipelinePermissions = usePipelinePermissions();

  var _useReducer = useReducer(reducer, panelStateAllClosed),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  var objectName = useStoreDependency(objectNameDependency, {
    objectType: objectType
  });
  var objectTypeDef = useSelectedObjectTypeDef();
  var user = useStoreDependency(userDep);
  var userId = user.user_id;
  var isUngatedForFLPView = useStoreDependency(isUngatedForFLPViewDependency);
  var sortSettings = useBoardSortSettings(objectType);
  var sortKey = sortSettings.get('sortKey') || getIn(['state', 'sortKey'], view);
  var sortDirection = sortSettings.get('order') || getIn(['state', 'order'], view);
  useEffect(function () {
    dispatch({
      type: actions.closeAll
    });
  }, [objectType, pageType]);
  useEffect(function () {
    delayUntilIdle(function () {
      if (isMounted.current) {
        setIdle(true);
      }
    });
  }, [isMounted]);
  var openViewActionModal = useCallback(function (modalOptions) {
    return dispatch({
      modalOptions: modalOptions,
      type: actions.openModal,
      modalName: modals.viewActionModal
    });
  }, []);
  var handleTogglePreviewSidebar = useCallback(function (subjectId, subjectObjectType) {
    dispatch({
      type: actions.togglePreviewSidebarPanel,
      options: {
        subjectId: "" + subjectId,
        objectType: subjectObjectType
      }
    });
    var isSameRecord = "" + subjectId === "" + state.panelOptions.subjectId && subjectObjectType === state.panelOptions.objectType;

    if (!isSameRecord) {
      trackOpenPreviewSidebar();
    }
  }, [state.panelOptions.objectType, state.panelOptions.subjectId]);
  var handleUpdateColumns = useCallback(function (newColumns) {
    return _handleUpdateColumns(objectType, isCrmObject, view, newColumns);
  }, [isCrmObject, objectType, view]);
  var isModifiedView = get('modified', view);
  var handleChangeView = useCallback(function (newViewId) {
    return navigateToView({
      query: query,
      isCrmObject: isCrmObject,
      objectType: objectType,
      pageType: pageType,
      viewId: newViewId,
      dispatch: dispatch
    });
  }, [isCrmObject, objectType, pageType, query]);
  var handleUpdateSearchQuery = useCallback(function (newQuery) {
    if (newQuery !== prevQuery) {
      setPrevQuery(newQuery);
      setSearching(true);
      var queryString = buildQueryString({
        query: newQuery
      });
      var url = getFragmentBy(getRootUrl(), window.location.href.split('?')[0]) + queryString;
      resetTemporaryIds();
      RouterContainer.get().navigate(url, {
        silent: true,
        trigger: true
      });
    }
  }, [setSearching, prevQuery]);

  var handleCreateObjectSuccess = function handleCreateObjectSuccess(_ref3) {
    var addAnother = _ref3.addAnother,
        createdObjectId = _ref3.createdObjectId;
    temporarilyIncludeId(parseInt(createdObjectId, 10));
    Alerts.addSuccess('indexPage.alerts.createObjectSuccess', {
      objectName: objectName
    });

    if (!addAnother) {
      dispatch({
        type: actions.closePanel
      });
    }
  };

  var handleCreateObjectFailure = function handleCreateObjectFailure(_ref4) {
    var error = _ref4.error,
        fatal = _ref4.fatal;

    if (error) {
      var _objectBuilderErrors$ = objectBuilderErrors.getReadableErrorInfo(error, objectName),
          errorMessage = _objectBuilderErrors$.errorMessage,
          errorOptions = _objectBuilderErrors$.errorOptions;

      Alerts.addDanger(errorMessage, errorOptions);
    } // Close the panel if the user cancelled it or if a fatal error occurred
    // (e.g., iframe initialization failed), otherwise leave it open so the
    // user doesn't lose any entered data


    if (!error || fatal) {
      dispatch({
        type: actions.closePanel
      });
    }
  };

  var handleSaveView = function handleSaveView() {
    ViewsActions.update({
      objectType: objectType,
      view: view
    });
    trackEditSavedView();
  };

  var handleResetView = function handleResetView() {
    ViewsActions.reset({
      objectType: objectType,
      viewId: view.id
    });
  };

  var handleSaveViewAsNew = function handleSaveViewAsNew() {
    openViewActionModal({
      action: ViewActionModalActions.CREATE_AS_COPY,
      shouldLoadView: true
    });
  };

  var handleObjectCreate = function handleObjectCreate(_ref5) {
    var createdObjectId = _ref5.objectId,
        createdObjectType = _ref5.associationType;

    if (state.panelOptions.objectType === createdObjectType) {
      temporarilyIncludeId(parseInt(createdObjectId, 10));
    }
  };

  var handleObjectDelete = function handleObjectDelete(_ref6) {
    var deletedObjectId = _ref6.objectId,
        deletedObjectTypeId = _ref6.objectTypeId;
    var deletedObjectType = ObjectTypeFromIds[deletedObjectTypeId] || deletedObjectTypeId;

    if (state.panelOptions.objectType === deletedObjectType) {
      temporarilyExcludeIds(ImmutableSet.of(parseInt(deletedObjectId, 10)));

      if (state.panelOptions.subjectId === deletedObjectId) {
        dispatch({
          type: actions.closePanel
        });
      }
    }
  };

  var handleObjectUpdate = function handleObjectUpdate(_ref7) {
    var updatedObjectId = _ref7.objectId,
        updatedObjectType = _ref7.objectType;

    if (state.panelOptions.objectType === updatedObjectType) {
      ObjectsActions.refresh(updatedObjectType, updatedObjectId);
    }

    if (updatedObjectType === DEAL) {
      refreshDealSplits();
    }
  };

  var isViewOwner = view.ownerId === userId;
  var pipelines = useStoreDependency(pipelinesDep, {
    objectType: objectType
  });
  var canAccessCurrentPipeline = get(pipelineId, pipelinePermissions) !== HIDDEN;
  var canAccessAnyPipeline = useMemo(function () {
    return !isResolved(pipelines) || pipelines.some(function (pipeline) {
      var id = get('pipelineId', pipeline);
      return get(id, pipelinePermissions) !== HIDDEN;
    });
  }, [pipelines, pipelinePermissions]);
  var shouldRenderPipelineLockScreen = !canAccessCurrentPipeline || !canAccessAnyPipeline;
  return /*#__PURE__*/_jsxs(AccessLevelContextProvider, {
    active: isUngatedForFLPView,
    children: [/*#__PURE__*/_jsx(CoachingTipsWrapper, {
      objectType: objectType
    }), isIdle && /*#__PURE__*/_jsx(ViewSelectorPage, {
      objectType: objectType,
      onChangeView: handleChangeView,
      openViewActionModal: openViewActionModal,
      onCloseViewSelectorPage: function onCloseViewSelectorPage() {
        return dispatch({
          type: actions.closeViewSelectorPage
        });
      },
      isOpen: state.isViewSelectorPageOpen
    }), !isIdle && state.isViewSelectorPageOpen && /*#__PURE__*/_jsx(UILoadingSpinner, {
      minHeight: "100vh",
      grow: true,
      size: "medium"
    }), /*#__PURE__*/_jsx(IndexPageAlerts, {}), /*#__PURE__*/_jsxs(UIListingPage, {
      headerComponent: /*#__PURE__*/_jsx(Header, {
        addButtonDisabled: !canAccessAnyPipeline,
        isCrmObject: isCrmObject,
        isPipelineable: objectTypeSupportsPipelines(objectType),
        objectType: objectType,
        pageType: pageType,
        onOpenObjectBuilderPanel: function onOpenObjectBuilderPanel() {
          dispatch({
            type: actions.openPanel,
            panelName: panels.objectBuilderPanel
          });
        },
        onOpenViewSelectorPage: function onOpenViewSelectorPage() {
          dispatch({
            type: actions.openViewSelectorPage
          });
          trackOpenAllViewsPage();
        },
        onChangeView: handleChangeView,
        onCreateView: handleSaveViewAsNew,
        onChangePipeline: setPipelineId,
        pipelineId: pipelineId,
        view: view
      }),
      pageLayout: "full-width",
      pageStyle: {
        // HACK: This prevents the header on pages with pipelines from hitting the
        // mobile breakpoint and condensing
        minWidth: 1000,
        display: state.isViewSelectorPageOpen ? 'none' : 'flex'
      },
      children: [shouldRenderPipelineLockScreen ? /*#__PURE__*/_jsx(ForbiddenPage, {}) : /*#__PURE__*/_jsxs(MainContentWrapper, {
        $isBoard: pageType === PageTypes.BOARD,
        children: [/*#__PURE__*/_jsx(FilterBar, {
          filters: view.filters,
          isModifiedView: isModifiedView,
          isEditableView: isViewOwner,
          objectType: objectType,
          onToggleAdvancedFiltersPanel: function onToggleAdvancedFiltersPanel() {
            var isPanelAlreadyOpen = state.openPanel === panels.advancedFiltersPanel;

            if (isPanelAlreadyOpen) {
              dispatch({
                type: actions.closePanel
              });
            } else {
              dispatch({
                type: actions.openPanel,
                panelName: panels.advancedFiltersPanel
              });
              trackOpenMoreFiltersPanel();
            }
          },
          onOpenEditCardsPanel: function onOpenEditCardsPanel() {
            dispatch({
              type: actions.openPanel,
              panelName: panels.editCardsPanel
            });
            CrmLogger.log('indexInteractions', {
              action: 'open edit cards panel',
              objectTypeId: objectTypeDef.objectTypeId,
              objectTypeName: objectTypeDef.name
            });
          },
          onOpenEditColumnsModal: function onOpenEditColumnsModal() {
            dispatch({
              type: actions.openModal,
              modalName: modals.editColumnsModal
            });
            trackOpenEditColumnsModal(objectTypeDef);
          },
          onOpenBoardSortModal: function onOpenBoardSortModal() {
            return dispatch({
              type: actions.openModal,
              modalName: modals.boardSortModal
            });
          },
          onUpdateFilterQuery: partial(handleUpdateFilterQuery, objectType, isCrmObject, view),
          onUpdateSearchQuery: handleUpdateSearchQuery,
          onResetView: handleResetView,
          onSaveView: handleSaveView,
          onSaveViewAsNew: handleSaveViewAsNew,
          pageType: pageType,
          pipelineId: pipelineId,
          query: query.query,
          user: user,
          view: view
        }), pageType === PageTypes.INDEX ? /*#__PURE__*/_jsx(Table, {
          isCrmObject: isCrmObject,
          isSearching: isSearching,
          objectType: objectType,
          onTogglePreviewSidebar: handleTogglePreviewSidebar,
          onUpdateColumns: handleUpdateColumns,
          pipelineId: pipelineId,
          query: query,
          setSearching: setSearching,
          view: view
        }) : /*#__PURE__*/_jsx(Board, {
          isSearching: isSearching,
          objectType: objectType,
          pipelineId: pipelineId,
          setSearching: setSearching,
          view: view,
          onTogglePreviewSidebar: handleTogglePreviewSidebar
        }), state.openPanel === panels.advancedFiltersPanel && /*#__PURE__*/_jsx(AdvancedFiltersContainer, {
          filters: view.filters,
          isBoardView: pageType === PageTypes.BOARD,
          isCrmObject: isCrmObject,
          isPipelineable: objectTypeSupportsPipelines(objectType),
          objectType: objectType,
          onClose: function onClose() {
            return dispatch({
              type: actions.closePanel
            });
          },
          onUpdateQuery: partial(handleUpdateFilterQuery, objectType, isCrmObject, view),
          pipelineId: pipelineId,
          view: view
        }), state.openPanel === panels.editCardsPanel && /*#__PURE__*/_jsx(EditCardsPanel, {
          onClose: function onClose() {
            dispatch({
              type: actions.closePanel
            });
          },
          pipelineId: pipelineId
        }), state.openModal === modals.editColumnsModal && /*#__PURE__*/_jsx(EditColumnsModal, {
          isDefaultView: view.type === ViewTypes.DEFAULT,
          columns: view.columns,
          objectType: objectType,
          objectTypeDef: objectTypeDef,
          onClose: function onClose() {
            return dispatch({
              type: actions.closeModal
            });
          },
          onUpdateColumns: handleUpdateColumns
        }), state.openModal === modals.boardSortModal && /*#__PURE__*/_jsx(BoardSortModal, {
          initialSortKey: sortKey,
          initialSortDirection: sortDirection,
          objectType: objectType,
          onConfirm: function onConfirm(evt) {
            handleChangeSort(Object.assign({}, evt.target.value, {
              objectType: objectType,
              viewId: "" + view.id
            }));
            dispatch({
              type: actions.closeModal
            });
          },
          onReject: function onReject() {
            return dispatch({
              type: actions.closeModal
            });
          }
        }), state.openPanel === panels.previewSidebarPanel && /*#__PURE__*/_jsx(PreviewSidebar, {
          onObjectCreate: handleObjectCreate,
          onObjectDelete: handleObjectDelete,
          onObjectUpdate: handleObjectUpdate,
          objectType: state.panelOptions.objectType,
          onClose: function onClose() {
            return dispatch({
              type: actions.closePanel
            });
          },
          subjectId: state.panelOptions.subjectId
        }), state.openModal === modals.viewActionModal && /*#__PURE__*/_jsx(ViewActionModal, {
          action: state.modalOptions.action,
          shouldLoadView: state.modalOptions.shouldLoadView,
          isViewOwner: isViewOwner,
          objectType: objectType,
          handleChangeView: handleChangeView,
          onClose: function onClose() {
            return dispatch({
              type: actions.closeModal
            });
          },
          view: state.modalOptions.view || view
        }), state.openPanel === panels.objectBuilderPanel && /*#__PURE__*/_jsx(ObjectBuilder, {
          isCrmObject: isCrmObject,
          objectTypeId: objectType,
          onCreateObjectSuccess: handleCreateObjectSuccess,
          onCreateObjectFailure: handleCreateObjectFailure
        }), objectType === MARKETING_EVENT_TYPE_ID && /*#__PURE__*/_jsx(FeedbackLoader, {
          onClientLoad: function onClientLoad(feedbackClient) {
            feedbackClient.loadSurvey('CSAT', MARKETING_EVENT_FEEDBACK_ID);
          }
        })]
      }), /*#__PURE__*/_jsx(UniversalSaveBar, {}), /*#__PURE__*/_jsx(PageRefreshUsageLogger, {
        objectType: objectType
      }), /*#__PURE__*/_jsx(IndexPageOnboarding, {
        objectType: objectType
      })]
    })]
  });
};

var resolversMap = _defineProperty({}, OWNER, OwnerReferenceResolver);

IndexPage.propTypes = {
  isCrmObject: PropTypes.bool.isRequired,
  objectType: AnyCrmObjectTypePropType.isRequired,
  pageType: PageType,
  query: PropTypes.object,
  view: PropTypes.instanceOf(ViewRecord).isRequired
};
IndexPage.defaultProps = {
  isCrmObject: false,
  query: {}
};
export default ProvideReferenceResolvers(resolversMap, IndexPage, {
  mergeResolvers: true
});