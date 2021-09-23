'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useStoreDependency } from 'general-store';
import { fromJS } from 'immutable';
import PropTypes from 'prop-types';
import ViewActionModalLegacy from '../crm_ui/dialog/view/ViewActionModal';
import ViewType from 'customer-data-objects-ui-components/propTypes/ViewType';
import ViewsStore from '../crm_ui/flux/views/ViewsStore';
import ViewsActions from '../crm_ui/flux/views/ViewsActions';
import * as ViewTypes from 'customer-data-objects/view/ViewTypes';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import SafeStorage from 'SafeStorage';
import { trackDeleteView, trackCreateView } from '../crm_ui/tracking/indexPageTracking';
export var ViewActionModalActions = {
  CLONE: 'clone',
  CREATE: 'create',
  CREATE_AS_COPY: 'createAsCopy',
  DELETE: 'delete',
  MANAGE_SHARING: 'manageSharing',
  RENAME: 'rename',
  SEND: 'send',
  SHARE: 'share'
};
var creationActionNames = [ViewActionModalActions.CLONE, ViewActionModalActions.CREATE, ViewActionModalActions.CREATE_AS_COPY, ViewActionModalActions.SEND];
export var allViewDependency = {
  propTypes: {
    viewId: PropTypes.string.isRequired
  },
  stores: [ViewsStore],
  deref: function deref(props) {
    var objectType = props.objectType;
    return ViewsStore.get({
      objectType: objectType,
      viewId: 'all'
    });
  }
};

var ViewActionModal = function ViewActionModal(_ref) {
  var action = _ref.action,
      _ref$shouldLoadView = _ref.shouldLoadView,
      shouldLoadView = _ref$shouldLoadView === void 0 ? false : _ref$shouldLoadView,
      view = _ref.view,
      isViewOwner = _ref.isViewOwner,
      handleChangeView = _ref.handleChangeView,
      onClose = _ref.onClose,
      objectType = _ref.objectType;
  var allView = useStoreDependency(allViewDependency, {
    objectType: objectType
  });

  var handleViewCreate = function handleViewCreate(oldViewId) {
    var oldColumnWidths = oldViewId ? SafeStorage.getItem(oldViewId) : null;
    return function (createdView) {
      var createdViewId = createdView.get('id');
      var newTableViewId = "data-table-" + objectType + "-" + createdViewId;

      if (oldColumnWidths) {
        SafeStorage.setItem(newTableViewId, oldColumnWidths);
      }

      ViewsActions.reset(fromJS({
        objectType: objectType,
        viewId: createdViewId
      }));

      if (shouldLoadView) {
        handleChangeView(createdViewId);
      }

      onClose();
    };
  };

  var handleConfirm = function handleConfirm(selectedView) {
    var selectedViewId = selectedView.get('id'); // this id must match the one passed to CustomerDataTable

    var tableViewId = "data-table-" + objectType + "-" + selectedViewId;

    if (action === ViewActionModalActions.DELETE) {
      trackDeleteView();
      return ViewsActions.delete({
        objectType: objectType,
        viewId: selectedViewId
      }).then(onClose);
    }

    if (creationActionNames.includes(action)) {
      trackCreateView({
        isClone: action === 'clone'
      });
      var viewToCreate = selectedView.delete('default').delete('id').delete('ownerId').set('type', ViewTypes.STANDARD);
      return ViewsActions.create({
        action: action,
        objectType: objectType,
        view: viewToCreate
      }).then(handleViewCreate(tableViewId));
    }

    return ViewsActions.update({
      objectType: objectType,
      view: selectedView
    }).then(handleViewCreate());
  };

  if (action === ViewActionModalActions.CREATE && !allView) {
    return null;
  }

  var viewToUse = action === ViewActionModalActions.CREATE ? allView : view;
  return /*#__PURE__*/_jsx(ViewActionModalLegacy, {
    action: action,
    isOwner: isViewOwner,
    objectType: objectType,
    onConfirm: handleConfirm,
    onReject: onClose,
    view: viewToUse
  });
};

ViewActionModal.propTypes = {
  action: PropTypes.oneOf(Object.values(ViewActionModalActions)).isRequired,
  isViewOwner: PropTypes.bool.isRequired,
  shouldLoadView: PropTypes.bool,
  objectType: AnyCrmObjectTypePropType.isRequired,
  handleChangeView: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  view: ViewType
};
export default ViewActionModal;