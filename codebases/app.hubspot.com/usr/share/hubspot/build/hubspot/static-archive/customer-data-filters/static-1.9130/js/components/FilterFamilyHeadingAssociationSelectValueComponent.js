'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import { USER_DEFINED } from '../filterQueryFormat/associations/AssociationCategory';

var FilterFamilyHeadingAssociationSelectValueComponent = function FilterFamilyHeadingAssociationSelectValueComponent(props) {
  var option = props.option;

  if (option.value.endsWith(USER_DEFINED)) {
    return /*#__PURE__*/_jsx(FormattedMessage, {
      message: "customerDataFilters.FilterFamilyGroupHeadingAssociation.labeled",
      options: {
        associationLabel: option.text
      }
    });
  }

  return option.text;
};

FilterFamilyHeadingAssociationSelectValueComponent.propTypes = {
  option: PropTypes.shape({
    value: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired
};
export default FilterFamilyHeadingAssociationSelectValueComponent;