'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { CONTACT } from 'customer-data-objects/constants/ObjectTypes';
import { OrderedSet } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import UIRadioInput from 'UIComponents/input/UIRadioInput';
import identity from 'transmute/identity';

var FilterFamilySelect = function FilterFamilySelect(props) {
  var getFilterFamilyName = props.getFilterFamilyName,
      onClick = props.onClick,
      options = props.options;
  var msEdgeBugfixStyle = {
    maxHeight: '100%'
  };
  return /*#__PURE__*/_jsx("div", {
    className: "display-flex flex-column flex-grow-1",
    style: msEdgeBugfixStyle,
    children: options.map(function (filterFamily) {
      return /*#__PURE__*/_jsx(UIRadioInput, {
        "data-selenium-info": filterFamily,
        "data-selenium-test": "XOFilterEditor-filterfamily-option",
        name: filterFamily,
        onChange: onClick,
        children: getFilterFamilyName(filterFamily)
      }, filterFamily);
    })
  });
};

FilterFamilySelect.propTypes = {
  getFilterFamilyName: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  options: ImmutablePropTypes.orderedSetOf(PropTypes.string).isRequired
};
FilterFamilySelect.defaultProps = {
  getFilterFamilyName: identity,
  options: OrderedSet([CONTACT])
};
export default FilterFamilySelect;