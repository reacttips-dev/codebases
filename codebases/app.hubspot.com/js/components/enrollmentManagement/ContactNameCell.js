'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import * as links from 'SequencesUI/lib/links';
import * as ReferenceObjectTypes from 'reference-resolvers/constants/ReferenceObjectTypes';
import ResolveReferences from 'reference-resolvers/ResolveReferences';
import { isError, isLoading, isResolved } from 'reference-resolvers/utils';
import FormattedMessage from 'I18n/components/FormattedMessage';
import EmptyCell from './EmptyCell';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import UILink from 'UIComponents/link/UILink';

var ContactNameCell = function ContactNameCell(_ref) {
  var contact = _ref.contact;

  if (isLoading(contact)) {
    return /*#__PURE__*/_jsx(UILoadingSpinner, {
      size: "extra-small"
    });
  }

  if (isError(contact)) {
    return /*#__PURE__*/_jsx(EmptyCell, {});
  }

  if (isResolved(contact)) {
    return /*#__PURE__*/_jsx(UILink, {
      href: links.crmContactProfile(contact.id),
      external: true,
      truncate: true,
      children: contact.label
    });
  }

  return /*#__PURE__*/_jsx(FormattedMessage, {
    message: "summary.sequenceSummarySearchContactMissing"
  });
};

ContactNameCell.propTypes = {
  contact: PropTypes.object
};

var mapResolversToProps = function mapResolversToProps(resolvers, props) {
  return {
    contact: resolvers[ReferenceObjectTypes.CONTACT].byId(props.contactId)
  };
};

var ContactName = ResolveReferences(mapResolversToProps)(ContactNameCell);
export default ContactName;