'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap } from 'immutable';
import { connect } from 'general-store';
import ConnectedAccountsStore from 'crm_data/connectedAccount/ConnectedAccountsStore';
import FilterAlert from '../components/filter/FilterAlert';
import FilterMessage from '../components/filter/FilterMessage';
import ObjectTypesType from 'customer-data-objects-ui-components/propTypes/ObjectTypesType';
import PortalIdParser from 'PortalIdParser';
import PropTypes from 'prop-types';
import SidekickExtensionInstallHelpers from 'ExtensionInstallHelpers.SidekickExtensionInstallHelpers';
import ViewsStore from '../flux/views/ViewsStore';
import get from 'transmute/get';
export var DEMO_FILTERS = {
  needsAction: 'needs_action',
  needsFollowUp: 'needs_follow_up'
};
export var DEMO_FILTER_LIST = ['needs_action', 'needs_follow_up'];
export function hasUnmodifiedFilter(_ref) {
  var hasFilters = _ref.hasFilters,
      searchQuery = _ref.searchQuery,
      isModified = _ref.isModified;

  if (isModified) {
    return null;
  }

  if (hasFilters && searchQuery && searchQuery.get('query') === '' && searchQuery.get('filterGroups')) {
    return true;
  }

  return null;
}
export function getGridFilterMessage(_ref2) {
  var connectedAccounts = _ref2.connectedAccounts,
      hasFilters = _ref2.hasFilters,
      isModified = _ref2.isModified,
      objectType = _ref2.objectType,
      searchQuery = _ref2.searchQuery,
      viewId = _ref2.viewId;

  if (!hasUnmodifiedFilter({
    hasFilters: hasFilters,
    isModified: isModified,
    searchQuery: searchQuery
  })) {
    return null;
  }

  var i18nActionKey = 'GenericGrid.filterMessage.needsAction';
  var i18nFollowUpKey = 'GenericGrid.filterMessage.needsFollowUp';

  if (viewId === DEMO_FILTERS.needsAction) {
    return /*#__PURE__*/_jsx(FilterMessage, {
      bodies: [i18nActionKey + ".body1", i18nActionKey + ".body2"],
      illustration: "crm",
      objectType: objectType,
      title: i18nActionKey + ".title"
    });
  }

  if (viewId === DEMO_FILTERS.needsFollowUp && connectedAccounts) {
    var alert = null;
    var hasConnectedAccounts = !connectedAccounts.areAllIntegrationsDisabled();
    var hasExtension = SidekickExtensionInstallHelpers.hasExtension();

    if (hasConnectedAccounts || hasExtension) {
      alert = /*#__PURE__*/_jsx(FilterAlert, {
        text: i18nFollowUpKey + ".alert1.message",
        type: "info"
      });
    } else {
      alert = /*#__PURE__*/_jsx(FilterAlert, {
        linkLocation: "/sales-products-settings/" + PortalIdParser.get() + "/email/connectedEmails",
        objectType: objectType,
        text: i18nFollowUpKey + ".alert2.message",
        type: "warning"
      });
    }

    return /*#__PURE__*/_jsx(FilterMessage, {
      bodies: i18nFollowUpKey + ".body",
      illustration: "transactional-email-envelope",
      objectType: objectType,
      title: i18nFollowUpKey + ".title",
      children: alert
    });
  }

  return null;
}
getGridFilterMessage.propTypes = {
  connectedAccounts: PropTypes.object,
  hasFilters: PropTypes.bool.isRequired,
  isModified: PropTypes.bool.isRequired,
  objectType: ObjectTypesType.isRequired,
  searchQuery: PropTypes.instanceOf(ImmutableMap),
  viewId: PropTypes.string.isRequired
};
var dependencies = {
  connectedAccounts: ConnectedAccountsStore,
  isModified: {
    stores: [ViewsStore],
    deref: function deref(_ref3) {
      var objectType = _ref3.objectType,
          viewId = _ref3.viewId;
      var viewKey = ViewsStore.getViewKey({
        objectType: objectType,
        viewId: viewId
      });
      var view = ViewsStore.get(viewKey);
      return get('modified', view);
    }
  }
};
export default connect(dependencies)(getGridFilterMessage);