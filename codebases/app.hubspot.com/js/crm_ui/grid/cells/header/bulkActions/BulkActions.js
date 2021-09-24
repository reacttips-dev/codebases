'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { bulkClosedLostEnabled } from 'crm_data/BET/permissions/DealPermissions';
import ScopesContainer from '../../../../../containers/ScopesContainer';
import { betCanViewBETBulkAssignAction, betCanViewBETBulkRecycleAction, betCanViewStandardBulkAssignAction } from '../../../../BET/permissions/BETBulkActionPermissions';
import BulkAddGDPRLawfulBasisToProcessButton from './BulkAddGDPRLawfulBasisToProcessButton';
import BulkAddGDPRSubscriptionButton from './BulkAddGDPRSubscriptionButton';
import BulkAddProspectButton from './BulkAddProspectButton';
import BulkAddToListButton from './BulkAddToListButton';
import BulkAddToObjectListButton from './BulkAddToObjectListButton';
import BulkAssignButton from './BulkAssignButton';
import BulkBetAssignButtonContainer from './BulkBetAssignButtonContainer';
import BulkBetRecycleButtonContainer from './BulkBetRecycleButtonContainer';
import BulkCreateTasksButton from './BulkCreateTasksButton';
import BulkDeleteButton from './BulkDeleteButton';
import BulkEditButton from './BulkEditButton';
import BulkEditDoubleOptInButton from './BulkEditDoubleOptInButton';
import BulkEnrollInSequenceButton from './BulkEnrollInSequenceButton';
import BulkEnrollInWorkflowButton from './BulkEnrollInWorkflowButton';
import BulkHideProspectButton from './BulkHideProspectButton';
import BulkMoveToClosedLostButtonContainer from './BulkMoveToClosedLostButtonContainer';
import BulkSendSurveyMonkeySurveyButton from './BulkSendSurveyMonkeySurveyButton';
import BulkSetMarketableButton from './BulkSetMarketableButton';
import BulkSetNonMarketableButton from './BulkSetNonMarketableButton';
import BulkRemoveFromListButton from './BulkRemoveFromListButton';
import BulkRemoveFromObjectListButton from './BulkRemoveFromObjectListButton';
import IsUngatedStore from 'crm_data/gates/IsUngatedStore';
import { canView } from '../../../../permissions/WorkflowPermissions';
import get from 'transmute/get';
import getIn from 'transmute/getIn';
import { isScoped, getAsSet } from '../../../../../containers/ScopeOperators';
import withGateOverride from 'crm_data/gates/withGateOverride';

var canMakeContactSubscriptionsUpdates = function canMakeContactSubscriptionsUpdates(_ref) {
  var hasRestrictedSubscriptionsWrite = _ref.hasRestrictedSubscriptionsWrite;
  return hasRestrictedSubscriptionsWrite ? ScopesContainer.get()['crm-subscription-manager-access'] : ScopesContainer.get()['subscriptions-status-write'];
};

export var addProspect = {
  key: 'BulkAddProspect',
  Component: BulkAddProspectButton,
  condition: function condition() {
    return ScopesContainer.get()['sales-companies-access'];
  }
};
export var addToList = {
  key: 'BulkAddToList',
  Component: BulkAddToListButton,
  condition: function condition() {
    return ScopesContainer.get()['contacts-lists-access'];
  }
};
export var addToObjectList = {
  key: 'BulkAddToObjectList',
  Component: BulkAddToObjectListButton,
  condition: function condition() {
    return Boolean(ScopesContainer.get()['contacts-lists-access'] && withGateOverride('ObjectLists', !!IsUngatedStore.get('crm:segments:ils')));
  }
};
export var assign = {
  key: 'BulkAssign',
  Component: BulkAssignButton,
  condition: function condition() {
    return betCanViewStandardBulkAssignAction();
  }
};
export var betAssign = {
  key: 'BulkBETAssign',
  Component: BulkBetAssignButtonContainer,
  condition: function condition() {
    return betCanViewBETBulkAssignAction(getAsSet(ScopesContainer.get()));
  }
};
export var betRecycle = {
  key: 'BulkBETRecycle',
  Component: BulkBetRecycleButtonContainer,
  condition: function condition() {
    return betCanViewBETBulkRecycleAction(getAsSet(ScopesContainer.get()));
  }
};
export var bulkDelete = {
  key: 'BulkDelete',
  Component: BulkDeleteButton,
  condition: function condition(props) {
    if (!props || props.isNewList) {
      return false;
    }

    return true;
  }
};
export var createTasks = {
  key: 'BulkCreateTasks',
  Component: BulkCreateTasksButton,
  condition: function condition() {
    return isScoped(ScopesContainer.get(), ['crm-access', 'contacts-write']);
  }
};
export var edit = {
  key: 'BulkEdit',
  Component: BulkEditButton
};
export var enrollInWorkflow = {
  key: 'BulkEnrollInWorkflow',
  Component: BulkEnrollInWorkflowButton,
  condition: function condition() {
    return canView();
  }
};
export var enrollInSequence = {
  key: 'BulkEnrollInSequence',
  Component: BulkEnrollInSequenceButton
};
export var hideProspect = {
  key: 'BulkHideProspect',
  Component: BulkHideProspectButton,
  condition: function condition() {
    return ScopesContainer.get()['sales-companies-access'];
  }
};
export var moveToClosedLost = {
  key: 'BulkMoveToClosedLost',
  Component: BulkMoveToClosedLostButtonContainer,
  condition: function condition() {
    return bulkClosedLostEnabled(getAsSet(ScopesContainer.get()));
  }
};
export var removeFromList = {
  key: 'BulkRemoveFromList',
  Component: BulkRemoveFromListButton,
  condition: function condition(props) {
    if (!props) {
      return false;
    }

    if (props.isDynamic === true) {
      return false;
    }

    if (props.bulkActionProps && props.bulkActionProps.get('listId') != null) {
      return ScopesContainer.get()['contacts-lists-access'];
    }

    return false;
  }
};
export var removeFromObjectList = {
  key: 'BulkRemoveFromObjectList',
  Component: BulkRemoveFromObjectListButton,
  condition: function condition(props) {
    if (!props || !props.bulkActionProps || !props.bulkActionProps.get('listId') || props.isDynamic) {
      return false;
    }

    return Boolean(ScopesContainer.get()['contacts-lists-access'] && withGateOverride('ObjectLists', !!IsUngatedStore.get('crm:segments:ils')));
  }
};
export var updateDoubleOptIn = {
  key: 'BulkEditDoubleOptIn',
  Component: BulkEditDoubleOptInButton,
  condition: function condition(_ref2) {
    var bulkActionProps = _ref2.bulkActionProps,
        rest = _objectWithoutProperties(_ref2, ["bulkActionProps"]);

    return canMakeContactSubscriptionsUpdates(rest) && get('doiEnabled', bulkActionProps);
  }
};
export var addGDPRLawfulBasisToProcess = {
  key: 'BulkAddGDPRLawfulBasisToProcess',
  Component: BulkAddGDPRLawfulBasisToProcessButton,
  condition: function condition(props) {
    return canMakeContactSubscriptionsUpdates(props) && getIn(['bulkActionProps', 'gdprEnabled'], props);
  }
};
export var addGDPRSubscription = {
  key: 'BulkAddGDPRSubscription',
  Component: BulkAddGDPRSubscriptionButton,
  condition: canMakeContactSubscriptionsUpdates
};
export var sendSurveyMonkeySurvey = {
  key: 'BulkSendSurveyMonkeySurvey',
  Component: BulkSendSurveyMonkeySurveyButton,
  condition: function condition() {
    return withGateOverride('Integrations:SurveyMonkeySendSurvey', IsUngatedStore.get('Integrations:SurveyMonkeySendSurvey'));
  }
};
export var setMarketable = {
  key: 'BulkSetMarketableButton',
  Component: BulkSetMarketableButton,
  condition: function condition() {
    return isScoped(ScopesContainer.get(), ['marketable-contacts-access']);
  }
};
export var setNonMarketable = {
  key: 'BulkSetNonMarketableButton',
  Component: BulkSetNonMarketableButton,
  condition: function condition() {
    return isScoped(ScopesContainer.get(), ['marketable-contacts-access']);
  }
};
export default {
  addProspect: addProspect,
  addToList: addToList,
  addToObjectList: addToObjectList,
  assign: assign,
  betAssign: betAssign,
  betRecycle: betRecycle,
  bulkDelete: bulkDelete,
  createTasks: createTasks,
  updateDoubleOptIn: updateDoubleOptIn,
  edit: edit,
  enrollInWorkflow: enrollInWorkflow,
  enrollInSequence: enrollInSequence,
  hideProspect: hideProspect,
  moveToClosedLost: moveToClosedLost,
  removeFromList: removeFromList,
  removeFromObjectList: removeFromObjectList,
  addGDPRLawfulBasisToProcess: addGDPRLawfulBasisToProcess,
  addGDPRSubscription: addGDPRSubscription,
  sendSurveyMonkeySurvey: sendSurveyMonkeySurvey,
  setMarketable: setMarketable,
  setNonMarketable: setNonMarketable
};