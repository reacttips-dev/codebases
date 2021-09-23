'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import * as links from 'SequencesUI/lib/links';
import * as ReferenceObjectTypes from 'reference-resolvers/constants/ReferenceObjectTypes';
import ResolveReferences from 'reference-resolvers/ResolveReferences';
import { isError, isLoading, isResolved } from 'reference-resolvers/utils';
import EmptyCell from './EmptyCell';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import UILink from 'UIComponents/link/UILink';

var CompanyNameCell = function CompanyNameCell(_ref) {
  var company = _ref.company;

  if (isLoading(company)) {
    return /*#__PURE__*/_jsx(UILoadingSpinner, {
      size: "extra-small"
    });
  }

  if (isError(company)) {
    return /*#__PURE__*/_jsx(EmptyCell, {});
  }

  if (isResolved(company)) {
    return /*#__PURE__*/_jsx(UILink, {
      href: links.crmCompany(company.id),
      external: true,
      truncate: true,
      children: company.label
    });
  }

  return /*#__PURE__*/_jsx(EmptyCell, {});
};

CompanyNameCell.propTypes = {
  company: PropTypes.object
};

var mapResolversToProps = function mapResolversToProps(resolvers, props) {
  return {
    company: resolvers[ReferenceObjectTypes.COMPANY].byId(props.companyId)
  };
};

var CompanyName = ResolveReferences(mapResolversToProps)(CompanyNameCell);
export default CompanyName;