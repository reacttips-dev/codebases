'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import { getProperty, getId, toString } from 'customer-data-objects/model/ImmutableModel';
import links from 'crm-legacy-links/links';
import { canView } from '../../../utils/SubjectPermissions';
import UITile from 'UIComponents/tile/UITile';
import UITileSection from 'UIComponents/tile/UITileSection';
import UIMedia from 'UIComponents/layout/UIMedia';
import UIMediaLeft from 'UIComponents/layout/UIMediaLeft';
import UIMediaBody from 'UIComponents/layout/UIMediaBody';
import UIAvatar from 'ui-addon-avatars/UIAvatar';
import PermissionTooltip from 'customer-data-objects-ui-components/permissions/PermissionTooltip';
import UIButton from 'UIComponents/button/UIButton';
import { useStoreDependency } from 'general-store';
import ContactsEmailStore from 'crm_data/contacts/ContactsEmailStore';
import CompaniesStore from 'crm_data/companies/CompaniesStore';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import { inIframe } from 'crm_schema/creator/ObjectEmbedMessage';
export var matchingContactDependency = {
  stores: [ContactsEmailStore],
  deref: function deref(_ref) {
    var matchingContactEmail = _ref.matchingContactEmail;

    if (!matchingContactEmail) {
      return null;
    }

    return ContactsEmailStore.get(matchingContactEmail);
  }
};
export var matchingContactCompanyNameDependency = {
  stores: [CompaniesStore],
  deref: function deref(_ref2) {
    var contact = _ref2.contact;

    if (!contact) {
      return null;
    }

    var associatedcompanyid = getProperty(contact, 'associatedcompanyid');

    if (!associatedcompanyid) {
      return null;
    }

    var company = CompaniesStore.get(associatedcompanyid);
    return getProperty(company, 'name');
  }
};

function MatchingContact(_ref3) {
  var matchingContactEmail = _ref3.matchingContactEmail,
      onReject = _ref3.onReject,
      showLoadingAnimation = _ref3.showLoadingAnimation;
  var contact = useStoreDependency(matchingContactDependency, {
    matchingContactEmail: matchingContactEmail
  });
  var matchingContactCompanyName = useStoreDependency(matchingContactCompanyNameDependency, {
    contact: contact
  });

  if (!matchingContactEmail) {
    return null;
  }

  var isInIframe = inIframe();

  function renderJobSummary() {
    var companyName = matchingContactCompanyName;
    var contactJobTitle = getProperty(contact, 'jobtitle');

    if (contactJobTitle && companyName) {
      return /*#__PURE__*/_jsx(FormattedMessage, {
        message: "objectCreator.createContactModal.jobSummary",
        options: {
          contactJobTitle: contactJobTitle,
          companyName: companyName
        }
      });
    }

    return contactJobTitle || companyName || '';
  }

  function getMatchingContactPageLink() {
    var contactId = getId(contact);

    if (!isInIframe) {
      return links.contact(contactId);
    } // base url for iframe does not include /contacts/ so it must be added manually here


    return "" + links.getRootPath() + links.contact(getId(contact), null, false);
  }

  function renderMatchingContactInfo() {
    if (!contact || showLoadingAnimation) {
      return /*#__PURE__*/_jsx(UILoadingSpinner, {
        grow: true
      });
    }

    var contactName = toString(contact);
    var jobSummary = renderJobSummary();
    var canViewContact = canView(contact);
    return /*#__PURE__*/_jsxs(_Fragment, {
      children: [/*#__PURE__*/_jsx(UIMediaLeft, {
        children: /*#__PURE__*/_jsx(UIAvatar, {
          email: matchingContactEmail,
          vid: getId(contact),
          displayName: contactName,
          fileManagerKey: getProperty(contact, 'hs_avatar_filemanager_key'),
          type: "contact",
          size: "lg"
        })
      }), /*#__PURE__*/_jsxs(UIMediaBody, {
        children: [/*#__PURE__*/_jsx(PermissionTooltip, {
          disabled: canViewContact,
          tooltipKey: "createContactModal",
          children: /*#__PURE__*/_jsx(UIButton, {
            disabled: !canViewContact,
            href: canViewContact ? getMatchingContactPageLink() : null,
            onClick: onReject,
            external: isInIframe,
            use: "link",
            children: /*#__PURE__*/_jsx("strong", {
              children: contactName
            })
          })
        }), /*#__PURE__*/_jsx("div", {
          children: jobSummary
        })]
      })]
    });
  }

  return /*#__PURE__*/_jsxs("div", {
    className: "m-top-6 p-x-3",
    "data-selenium-test": "matching-contact-card",
    children: [/*#__PURE__*/_jsx("div", {
      className: "text-center m-x-6",
      children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "objectCreator.createContactModal.contactMatch",
        options: {
          email: matchingContactEmail
        }
      })
    }), /*#__PURE__*/_jsx(UITile, {
      className: "tile-width m-x-auto m-top-4",
      compact: true,
      children: /*#__PURE__*/_jsx(UITileSection, {
        children: /*#__PURE__*/_jsx(UIMedia, {
          align: "center",
          children: renderMatchingContactInfo()
        })
      })
    })]
  });
}

MatchingContact.propTypes = {
  matchingContactEmail: PropTypes.string,
  onReject: PropTypes.func.isRequired,
  showLoadingAnimation: PropTypes.bool.isRequired
};
export default MatchingContact;