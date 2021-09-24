'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { TASK, VISIT } from 'customer-data-objects/constants/ObjectTypes';
import { DEFAULT } from 'customer-data-objects/view/ViewTypes';
import { Map as ImmutableMap } from 'immutable';
import partial from 'transmute/partial';
import memoize from 'transmute/memoize';
import { connect } from 'general-store';
import DefaultViewStore from 'crm_data/views/DefaultViewStore';
import FormattedMessage from 'I18n/components/FormattedMessage';
import GridUIStore from '../crm_ui/flux/grid/GridUIStore';
import IsUngatedStore from 'crm_data/gates/IsUngatedStore';
import PortalIdParser from 'PortalIdParser';
import PropTypes from 'prop-types';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import ScopesContainer from '../containers/ScopesContainer';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import UIButton from 'UIComponents/button/UIButton';
import UIDropdown from 'UIComponents/dropdown/UIDropdown';
import UIDropdownDivider from 'UIComponents/dropdown/UIDropdownDivider';
import UILink from 'UIComponents/link/UILink';
import UIList from 'UIComponents/list/UIList';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UserStore from 'crm_data/user/UserStore';
import ViewExportDialogPrompt from '../crm_ui/prompts/view/ViewExportDialogPrompt';
import ViewRecord from 'customer-data-objects/view/ViewRecord';
import ViewsActions from '../crm_ui/flux/views/ViewsActions';
import ViewsStore from '../crm_ui/flux/views/ViewsStore';
import { isScoped } from '../containers/ScopeOperators';
import { ViewActionModalActions } from '../modals/ViewActionModal';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import { CrmObjectTypeRecord } from 'crm_data/crmObjectTypes/CrmObjectTypeRecords';
import { useSelectedObjectTypeDef } from '../crmObjects/hooks/useSelectedObjectTypeDef';
import { getTypeHasReportLink } from '../crmObjects/methods/getTypeHasReportLink';
import { getTypeHasExport } from '../crmObjects/methods/getTypeHasExport';
import { isLegacyObjectType } from 'customer-data-objects/types/LegacyObjectType';
import ReportBuilderUpgradeButton from '../upgrades/components/ReportBuilderUpgradeButton';
import { EXPORT_PAGE_TYPES } from '../rewrite/views/constants/ExportPageTypes';
var SEND = ViewActionModalActions.SEND,
    DELETE = ViewActionModalActions.DELETE,
    CREATE = ViewActionModalActions.CREATE,
    CREATE_AS_COPY = ViewActionModalActions.CREATE_AS_COPY,
    CLONE = ViewActionModalActions.CLONE,
    RENAME = ViewActionModalActions.RENAME,
    MANAGE_SHARING = ViewActionModalActions.MANAGE_SHARING;
var viewSharingActionNames = [SEND, DELETE, CREATE, CREATE_AS_COPY, CLONE, RENAME, MANAGE_SHARING];
export var ViewActionsDropdown = /*#__PURE__*/function (_PureComponent) {
  _inherits(ViewActionsDropdown, _PureComponent);

  function ViewActionsDropdown() {
    var _this;

    _classCallCheck(this, ViewActionsDropdown);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ViewActionsDropdown).call(this)); // In new code, please use ES6 spread args rather than partials
    // for easier debugging and readability:
    // (...args) => myFunction('partiallyAppliedParam', ...args)

    _this.getIsUserDefaultView = function () {
      var _this$props = _this.props,
          view = _this$props.view,
          defaultView = _this$props.defaultView;
      return view && defaultView && String(view.get('id')) === String(defaultView.get('id'));
    };

    _this.getIsViewOwner = function () {
      var _this$props2 = _this.props,
          user = _this$props2.user,
          view = _this$props2.view;
      return user.user_id === view.get('ownerId');
    };

    _this.handleClick = function (option, evt) {
      var _this$props3 = _this.props,
          openViewActionModal = _this$props3.openViewActionModal,
          view = _this$props3.view,
          onActionTaken = _this$props3.onActionTaken;
      evt.preventDefault();
      onActionTaken();

      if (typeof _this.props.handleOnOpenChange === 'function') {
        evt.stopPropagation();
        var preventCloseEventValue = SyntheticEvent(true);

        _this.props.handleOnOpenChange(preventCloseEventValue);
      }

      if (viewSharingActionNames.includes(option)) {
        openViewActionModal({
          action: option,
          view: view
        });
      } else {
        _this.handleSetDefaultView();
      }
    };

    _this.handleOpenExportViewModal = function () {
      var _this$props4 = _this.props,
          objectType = _this$props4.objectType,
          view = _this$props4.view,
          query = _this$props4.query,
          user = _this$props4.user;
      ViewExportDialogPrompt({
        objectType: objectType,
        view: view,
        query: query,
        isStateDirty: false,
        userEmail: user.email,
        isCrmObject: !isLegacyObjectType(objectType),
        exportPageType: EXPORT_PAGE_TYPES.allViews
      });
    };

    _this.getCurrentIsPrivate = function (view, actionName) {
      return ['create', 'createAsCopy'].includes(actionName) || view.get('private');
    };

    _this.handleSetDefaultView = function () {
      var _this$props5 = _this.props,
          view = _this$props5.view,
          objectType = _this$props5.objectType;
      var viewId = view.get('id');
      var viewName = view.get('name');
      ViewsActions.makeDefault(objectType, viewId, viewName);
    };

    _this.renderCloneView = function () {
      if (_this.props.objectType === TASK) {
        return null;
      }

      return /*#__PURE__*/_jsx(UIButton, {
        "data-selenium-test": "view-clone-btn",
        onClick: _this.partial(_this.handleClick, 'clone'),
        use: "link",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "filterSidebar.cloneView"
        })
      });
    };

    _this.renderSend = function () {
      if (!isScoped(ScopesContainer.get(), 'bet-send-view') || !_this.getIsViewOwner()) {
        return null;
      }

      return /*#__PURE__*/_jsx(UIButton, {
        onClick: _this.partial(_this.handleClick, 'send'),
        use: "link",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "filterSidebar.sendView"
        })
      });
    };

    _this.renderExport = function (_ref) {
      var isExportRemoved = _ref.isExportRemoved,
          objectTypeDef = _ref.objectTypeDef,
          view = _ref.view;
      var hasExport = getTypeHasExport(objectTypeDef);

      if (!view || !hasExport) {
        return null;
      }

      var typeName = objectTypeDef.name;
      var isDisabled = isExportRemoved && typeName === VISIT || !isScoped(ScopesContainer.get(), 'crm-export');
      var tooltip = isExportRemoved && typeName === VISIT ? 'filterSidebar.prospectsExportRemoved' : 'filterSidebar.exportViewDisabledTooltip';
      return /*#__PURE__*/_jsx(UITooltip, {
        "data-test-id": "view-export-option",
        disabled: !isDisabled,
        title: /*#__PURE__*/_jsx(FormattedMessage, {
          message: tooltip
        }),
        children: /*#__PURE__*/_jsx(UIButton, {
          disabled: isDisabled,
          onClick: _this.handleOpenExportViewModal,
          use: "link",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "filterSidebar.exportView.linkLabel"
          })
        })
      });
    };

    _this.renderDelete = function () {
      var view = _this.props.view;
      var isViewTypeDefault = view.get('type') === DEFAULT;

      var isUserDefaultView = _this.getIsUserDefaultView();

      var isPermittedToDeleteView = ScopesContainer.get()['crm-view-delete'] || _this.getIsViewOwner();

      var isViewDeletable = !isViewTypeDefault && !isUserDefaultView && isPermittedToDeleteView;
      var tooltipMessageKey = '';

      if (isViewTypeDefault) {
        tooltipMessageKey = 'filterSidebar.deleteViewDisabledDefaultPermissionTooltip';
      } else if (isUserDefaultView) {
        tooltipMessageKey = 'filterSidebar.deleteViewDisabledPermissionTooltip';
      } else if (!isPermittedToDeleteView) {
        tooltipMessageKey = 'filterSidebar.deleteViewDisabledNotOwnerTooltip';
      }

      return /*#__PURE__*/_jsx(UITooltip, {
        disabled: isViewDeletable,
        title: /*#__PURE__*/_jsx(FormattedMessage, {
          message: tooltipMessageKey
        }),
        children: /*#__PURE__*/_jsx(UIButton, {
          "data-selenium-test": "view-delete-btn",
          disabled: !isViewDeletable,
          onClick: _this.partial(_this.handleClick, 'delete'),
          use: "link",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "filterSidebar.deleteView"
          })
        })
      });
    };

    _this.renderRename = function () {
      var view = _this.props.view;
      var isDisabled = !_this.getIsViewOwner();
      return /*#__PURE__*/_jsx(UITooltip, {
        disabled: !isDisabled,
        title: /*#__PURE__*/_jsx(FormattedMessage, {
          message: view.get('type') === DEFAULT ? 'filterSidebar.renameViewDisabledDefaultPermissionTooltip' : 'filterSidebar.renameViewDisabledPermissionTooltip'
        }),
        children: /*#__PURE__*/_jsx(UIButton, {
          disabled: isDisabled,
          onClick: _this.partial(_this.handleClick, 'rename'),
          use: "link",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "filterSidebar.renameView"
          })
        })
      });
    };

    _this.renderManageSharing = function () {
      var view = _this.props.view;
      var isDisabled = !_this.getIsViewOwner();

      if (!view) {
        return null;
      }

      return /*#__PURE__*/_jsx(UITooltip, {
        disabled: !isDisabled,
        title: /*#__PURE__*/_jsx(FormattedMessage, {
          message: view.get('type') === DEFAULT ? 'filterSidebar.manageSharingDisabledDefaultTooltip' : 'filterSidebar.manageSharingDisabledTooltip'
        }),
        children: /*#__PURE__*/_jsx(UIButton, {
          disabled: isDisabled,
          onClick: _this.partial(_this.handleClick, 'manageSharing'),
          use: "link",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "filterSidebar.manageSharing"
          })
        })
      });
    };

    _this.renderReportLink = function () {
      var _this$props6 = _this.props,
          objectTypeDef = _this$props6.objectTypeDef,
          view = _this$props6.view;

      if (!ScopesContainer.get()['reports-builder-access']) {
        return /*#__PURE__*/_jsx(ReportBuilderUpgradeButton, {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "filterSidebar.createReportFromView"
          })
        });
      } else {
        var createViewReportUrl = "/report-builder/" + PortalIdParser.get() + "/crm/" + objectTypeDef.name.toLowerCase() + "/" + view.get('id');
        return /*#__PURE__*/_jsx(UILink, {
          external: true,
          href: createViewReportUrl,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "filterSidebar.createViewReport.linkLabel"
          })
        });
      }
    };

    _this.partial = memoize(partial);
    return _this;
  }

  _createClass(ViewActionsDropdown, [{
    key: "render",
    value: function render() {
      var _this$props7 = this.props,
          handleOnOpenChange = _this$props7.handleOnOpenChange,
          isExportRemoved = _this$props7.isExportRemoved,
          objectTypeDef = _this$props7.objectTypeDef,
          view = _this$props7.view;
      var isReportLinkSupported = getTypeHasReportLink(objectTypeDef);
      return /*#__PURE__*/_jsx("span", {
        className: "flex-shrink-0 word-break-normal",
        children: /*#__PURE__*/_jsx(UIDropdown, {
          buttonSize: "small",
          buttonClassName: "m-right-2",
          buttonText: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "filterSidebar.viewActions"
          }),
          buttonUse: "link",
          closeOnMenuClick: false,
          "data-selenium-test": "view-actions-dropdown",
          menuWidth: "auto",
          onClick: function onClick(evt) {
            return evt.stopPropagation();
          },
          onOpenChange: handleOnOpenChange,
          children: /*#__PURE__*/_jsxs(UIList, {
            children: [isReportLinkSupported && this.renderReportLink(), isReportLinkSupported && /*#__PURE__*/_jsx(UIDropdownDivider, {}), this.renderCloneView(), this.renderDelete(), this.renderExport({
              isExportRemoved: isExportRemoved,
              objectTypeDef: objectTypeDef,
              view: view
            }), this.renderManageSharing(), this.renderSend(), this.renderRename()]
          })
        })
      });
    }
  }]);

  return ViewActionsDropdown;
}(PureComponent);
ViewActionsDropdown.propTypes = {
  onActionTaken: PropTypes.func.isRequired,
  defaultView: PropTypes.instanceOf(ViewRecord).isRequired,
  objectTypeDef: PropTypes.instanceOf(CrmObjectTypeRecord).isRequired,
  handleOnOpenChange: PropTypes.func,
  openViewActionModal: PropTypes.func.isRequired,
  isExportRemoved: PropTypes.bool.isRequired,
  objectType: AnyCrmObjectTypePropType,
  query: PropTypes.string,
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    user_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    locale: PropTypes.string.isRequired
  }),
  view: PropTypes.instanceOf(ViewRecord)
};
ViewActionsDropdown.defaultProps = {
  isExportRemoved: false
};
var deps = {
  defaultView: {
    stores: [DefaultViewStore, ViewsStore],
    deref: function deref(props) {
      var objectType = props.objectType;
      var defaultViewId = DefaultViewStore.get(objectType);
      var views = ViewsStore.get(ImmutableMap({
        objectType: objectType
      }));
      if (!views || !defaultViewId) return undefined;
      return views.get(defaultViewId);
    }
  },
  user: UserStore,
  query: {
    stores: [GridUIStore],
    deref: function deref() {
      return GridUIStore.get('query');
    }
  },
  isExportRemoved: {
    stores: [IsUngatedStore],
    deref: function deref() {
      return IsUngatedStore.get('CRM:ProspectsExportRemoved');
    }
  }
};

var withHookState = function withHookState(Component) {
  return function Wrapper(props) {
    var objectTypeDef = useSelectedObjectTypeDef();
    return /*#__PURE__*/_jsx(Component, Object.assign({}, props, {
      objectTypeDef: objectTypeDef
    }));
  };
};

export default withHookState(connect(deps)(ViewActionsDropdown));