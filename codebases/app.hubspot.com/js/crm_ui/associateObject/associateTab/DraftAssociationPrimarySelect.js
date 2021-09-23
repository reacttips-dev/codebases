'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'general-store';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import CompaniesStore from 'crm_data/companies/CompaniesStore';
import ContactsStore from 'crm_data/contacts/ContactsStore';
import DealsStore from 'crm_data/deals/DealsStore';
import TicketsStore from 'crm_data/tickets/TicketsStore';
import { isLoading, LOADING } from 'crm_data/flux/LoadingStatus';
import { COMPANY, CONTACT, DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import { ObjectTypesToIds } from 'customer-data-objects/constants/ObjectTypeIds';
import { translateObjectName } from 'customer-data-objects/record/translateObjectName';
import ObjectTypesType from 'customer-data-objects-ui-components/propTypes/ObjectTypesType';
import { getProperty, toString } from 'customer-data-objects/model/ImmutableModel';
import UICheckbox from 'UIComponents/input/UICheckbox';
import UIRadioInput from 'UIComponents/input/UIRadioInput';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import { NONE_PROVIDED } from '../dependencies/primaryAssociationConstants';
import CrmObjectPermissionsStore from '../dependencies/permissions/CrmObjectPermissionsStore';
import { currentUserCanView } from '../dependencies/permissions/CrmObjectPermissionsConstants';
var propTypes = {
  associationObjectType: ObjectTypesType.isRequired,
  currentUserCanViewPrimary: PropTypes.bool,
  draftAssociationName: PropTypes.string,
  draftChosenPrimaryIndex: PropTypes.number,
  draftKey: PropTypes.number.isRequired,
  draftObjectId: PropTypes.string,
  numberOfAssociations: PropTypes.number.isRequired,
  primaryAssociatedObjectId: PropTypes.number,
  primaryAssociationName: PropTypes.string,
  setDraftChosenPrimaryIndex: PropTypes.func.isRequired,
  subjectName: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  objectType: ObjectTypesType.isRequired,
  isUngatedForFlexibleAssociations: PropTypes.bool.isRequired
};
export var dependencies = {
  subjectName: {
    stores: [ContactsStore, DealsStore, TicketsStore],
    deref: function deref(_ref) {
      var subjectId = _ref.subjectId,
          objectType = _ref.objectType;

      if (objectType === CONTACT) {
        var contact = ContactsStore.get(subjectId);
        return toString(contact);
      }

      if (objectType === DEAL) {
        var deal = DealsStore.get(subjectId);
        return toString(deal);
      }

      if (objectType === TICKET) {
        var ticket = TicketsStore.get(subjectId);
        return toString(ticket);
      } // currently no other FROM_OBJECTS supported


      return '';
    }
  },
  currentUserCanViewPrimary: {
    stores: [CrmObjectPermissionsStore],
    deref: function deref(_ref2) {
      var associationObjectType = _ref2.associationObjectType,
          primaryAssociatedObjectId = _ref2.primaryAssociatedObjectId;

      if (associationObjectType === COMPANY) {
        if (primaryAssociatedObjectId && primaryAssociatedObjectId !== NONE_PROVIDED) {
          var perms = CrmObjectPermissionsStore.get({
            objectType: ObjectTypesToIds[associationObjectType],
            objectId: primaryAssociatedObjectId
          });
          return isLoading(perms) ? LOADING : perms.get(currentUserCanView);
        }

        return true;
      } // currently no other TO_OBJECTS supported


      return false;
    }
  },
  primaryAssociationName: {
    stores: [CompaniesStore],
    deref: function deref(_ref3) {
      var associationObjectType = _ref3.associationObjectType,
          primaryAssociatedObjectId = _ref3.primaryAssociatedObjectId;

      if (associationObjectType === COMPANY) {
        if (primaryAssociatedObjectId && primaryAssociatedObjectId !== NONE_PROVIDED) {
          var company = CompaniesStore.get(primaryAssociatedObjectId);
          return getProperty(company, 'name') || getProperty(company, 'domain');
        }

        return '';
      } // currently no other TO_OBJECTS supported


      return '';
    }
  },
  draftAssociationName: {
    stores: [CompaniesStore],
    deref: function deref(_ref4) {
      var associationObjectType = _ref4.associationObjectType,
          draftObjectId = _ref4.draftObjectId;

      if (associationObjectType === COMPANY) {
        if (draftObjectId) {
          var company = CompaniesStore.get(draftObjectId);
          return getProperty(company, 'name');
        }

        return '';
      } // currently no other TO_OBJECTS supported


      return '';
    }
  }
};

var DraftAssociationPrimarySelect = function DraftAssociationPrimarySelect(_ref5) {
  var associationObjectType = _ref5.associationObjectType,
      currentUserCanViewPrimary = _ref5.currentUserCanViewPrimary,
      draftAssociationName = _ref5.draftAssociationName,
      draftChosenPrimaryIndex = _ref5.draftChosenPrimaryIndex,
      draftKey = _ref5.draftKey,
      draftObjectId = _ref5.draftObjectId,
      numberOfAssociations = _ref5.numberOfAssociations,
      primaryAssociatedObjectId = _ref5.primaryAssociatedObjectId,
      primaryAssociationName = _ref5.primaryAssociationName,
      setDraftChosenPrimaryIndex = _ref5.setDraftChosenPrimaryIndex,
      subjectName = _ref5.subjectName,
      objectType = _ref5.objectType,
      isUngatedForFlexibleAssociations = _ref5.isUngatedForFlexibleAssociations;

  /* This useEffect is for the particular special(ish) case where you
   * initially open up the panel and have no draft associations selected.
   *
   * However, when we only add one association (and do not plan to add more)
   * it should force that single association to be the primary should a primary
   * not exist already.
   *
   * When you add a second association this also has the nice effect of
   * forcing the first one's radio button to be selected if no primary exists.
   *
   * It will choose the value of the first association that is actually selected,
   * for example, if two empty draft associations are created and the second one
   * actually populates data for Company B, it will be the default primary
   * (not desired for deals/tickets)
   */
  useEffect(function () {
    if (primaryAssociatedObjectId === NONE_PROVIDED && draftObjectId && draftChosenPrimaryIndex === NONE_PROVIDED && isUngatedForFlexibleAssociations && objectType === CONTACT) {
      setDraftChosenPrimaryIndex(draftKey);
    }
  }, [draftChosenPrimaryIndex, draftKey, draftObjectId, objectType, primaryAssociatedObjectId, setDraftChosenPrimaryIndex, isUngatedForFlexibleAssociations]);
  var translatedObjectName = translateObjectName(associationObjectType); // case: primary required, no existing and this is the only draft assoc

  if (primaryAssociatedObjectId === NONE_PROVIDED && numberOfAssociations === 1) {
    return /*#__PURE__*/_jsx("div", {
      className: "p-top-6",
      children: draftAssociationName ? /*#__PURE__*/_jsx(FormattedReactMessage, {
        message: "sidebar.associateObjectDialog.associateTab.PrimaryAssociations.newPrimary",
        options: {
          draftAssociationName: draftAssociationName,
          subjectName: subjectName,
          associationObjectType: translatedObjectName
        }
      }) : /*#__PURE__*/_jsx(FormattedReactMessage, {
        "data-selenium-test": "empty-primary",
        message: "sidebar.associateObjectDialog.associateTab.PrimaryAssociations.newEmptyPrimary",
        options: {
          subjectName: subjectName,
          associationObjectType: translatedObjectName
        }
      })
    });
  } // case: no existing primary and this is one of multiple draft assocs
  else if (primaryAssociatedObjectId === NONE_PROVIDED && numberOfAssociations > 1 && objectType === CONTACT) {
      return /*#__PURE__*/_jsx(UIRadioInput, {
        size: "small",
        labelClassName: "p-top-6",
        "data-selenium-test": "new-primary-radio",
        disabled: !draftObjectId,
        checked: draftChosenPrimaryIndex === draftKey,
        name: "draft-association-primary-selector-" + draftKey,
        onChange: function onChange() {
          setDraftChosenPrimaryIndex(draftKey);
        },
        children: /*#__PURE__*/_jsx(FormattedReactMessage, {
          message: "sidebar.associateObjectDialog.associateTab.PrimaryAssociations.setNewPrimary",
          options: {
            subjectName: subjectName,
            associationObjectType: translatedObjectName
          }
        })
      });
    } // case: existing primary / no existing primary for deal/ticket


  return /*#__PURE__*/_jsx(UITooltip, {
    title: /*#__PURE__*/_jsx(FormattedReactMessage, {
      message: "sidebar.associateObjectDialog.associateTab.PrimaryAssociations.noViewAccess",
      options: {
        subjectName: subjectName
      }
    }),
    disabled: currentUserCanViewPrimary,
    placement: "left",
    children: /*#__PURE__*/_jsx(UICheckbox, {
      size: "small",
      labelClassName: "p-top-6",
      "data-selenium-test": "replace-primary-checkbox",
      disabled: !draftObjectId || !currentUserCanViewPrimary || isLoading(currentUserCanViewPrimary),
      checked: draftChosenPrimaryIndex === draftKey,
      onChange: function onChange(_ref6) {
        var checked = _ref6.target.checked;

        if (checked) {
          setDraftChosenPrimaryIndex(draftKey);
        } else {
          setDraftChosenPrimaryIndex(-1);
        }
      },
      children: /*#__PURE__*/_jsx(FormattedReactMessage, {
        message: "sidebar.associateObjectDialog.associateTab.PrimaryAssociations.replacePrimary",
        options: {
          primaryAssociationName: primaryAssociationName,
          subjectName: subjectName,
          associationObjectType: translatedObjectName
        }
      })
    })
  });
};

DraftAssociationPrimarySelect.propTypes = propTypes;
export default connect(dependencies)(DraftAssociationPrimarySelect);