'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { List } from 'immutable';
import { getMeOption } from 'customer-data-objects/owners/OwnerIdOptions';
import FilterOperatorOwnerInput from 'customer-data-filters/components/operator/FilterOperatorOwnerInput';

var OwnerInputWithMeOption = function OwnerInputWithMeOption(props) {
  return /*#__PURE__*/_jsx(FilterOperatorOwnerInput, Object.assign({}, props, {
    options: List.of(getMeOption()),
    requestOptions: {
      includeInactive: false
    }
  }));
};

OwnerInputWithMeOption.propTypes = FilterOperatorOwnerInput.propTypes;
export default {
  InputComponent: OwnerInputWithMeOption
};