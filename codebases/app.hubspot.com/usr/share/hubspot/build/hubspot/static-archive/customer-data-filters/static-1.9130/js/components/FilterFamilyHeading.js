'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { FLINT } from 'HubStyleTokens/colors';
import { getRealPath } from '../filterQueryFormat/logic/LogicGroup';
import FilterType from './propTypes/FilterType';
import { List } from 'immutable';
import { isAssociationBranch } from './strategies/ObjectSegStrategyUtils';
import FilterFamilyHeadingWithAssociations from './FilterFamilyHeadingWithAssociations';
import { COMPANY_TYPE_ID, CONTACT_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import FormattedMessage from 'I18n/components/FormattedMessage';

var FilterFamilyHeading = function FilterFamilyHeading(props) {
  var baseFilterFamily = props.baseFilterFamily,
      conditionPath = props.conditionPath,
      filterFamily = props.filterFamily,
      getFilterFamilyGroupHeading = props.getFilterFamilyGroupHeading,
      getFilterFamilyObjectName = props.getFilterFamilyObjectName,
      getIsUngated = props.getIsUngated,
      getObjectAssociationOptions = props.getObjectAssociationOptions,
      isAssociationSelectEnabled = props.isAssociationSelectEnabled,
      isReadOnly = props.isReadOnly,
      onBranchAssociationChange = props.onBranchAssociationChange,
      value = props.value,
      onUserAction = props.onUserAction;
  var isObjectAssociationBranch = isAssociationBranch(value.getIn(getRealPath(conditionPath)));
  var showAssociationSelect = getIsUngated('flexible-associations') && isObjectAssociationBranch && isAssociationSelectEnabled;

  if (showAssociationSelect) {
    return /*#__PURE__*/_jsx(FilterFamilyHeadingWithAssociations, {
      baseFilterFamily: baseFilterFamily,
      conditionPath: conditionPath,
      filterFamily: filterFamily,
      getFilterFamilyObjectName: getFilterFamilyObjectName,
      getObjectAssociationOptions: getObjectAssociationOptions,
      isReadOnly: isReadOnly,
      onBranchAssociationChange: onBranchAssociationChange,
      onUserAction: onUserAction,
      value: value
    });
  }

  var filterFamilyHeading = getFilterFamilyGroupHeading(filterFamily); // Classic contact list filters do not support flexible associations
  // at the same time they ONLY look in "Primary" associated companies
  // if associated company filters are used, therefore change copy
  // from "At least one associated company has" to "Primary associated company has"
  // example of this is contacts workflows since they aren't using ILS yet

  if (getIsUngated('flexible-associations') && baseFilterFamily === CONTACT_TYPE_ID && filterFamily === COMPANY_TYPE_ID) {
    filterFamilyHeading = /*#__PURE__*/_jsx(FormattedMessage, {
      message: "customerDataFilters.FilterFamilyGroupHeadingTranslator.CONTACT_TO_COMPANY_PRIMARY"
    });
  }

  if (filterFamilyHeading) {
    return /*#__PURE__*/_jsx("span", {
      className: "display-block p-left-4 p-right-3",
      style: {
        color: FLINT
      },
      children: filterFamilyHeading
    });
  }

  return null;
};

FilterFamilyHeading.propTypes = {
  baseFilterFamily: PropTypes.string.isRequired,
  conditionPath: PropTypes.instanceOf(List),
  filterFamily: PropTypes.string.isRequired,
  getFilterFamilyGroupHeading: PropTypes.func.isRequired,
  getFilterFamilyObjectName: PropTypes.func.isRequired,
  getIsUngated: PropTypes.func.isRequired,
  getObjectAssociationOptions: PropTypes.func,
  isAssociationSelectEnabled: PropTypes.bool,
  isReadOnly: PropTypes.bool.isRequired,
  onBranchAssociationChange: PropTypes.func,
  onUserAction: PropTypes.func,
  value: FilterType.isRequired
};
FilterFamilyHeading.defaultProps = {
  isReadOnly: false
};
export default FilterFamilyHeading;