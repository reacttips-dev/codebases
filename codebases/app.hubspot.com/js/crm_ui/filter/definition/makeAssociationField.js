'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import * as Operators from 'customer-data-filters/filterQueryFormat/operator/Operators';
import { OrderedSet } from 'immutable';
import { TICKET } from 'customer-data-objects/constants/ObjectTypes';
import AssociationSelectSearch from '../../components/select/AssociationSelectSearch';
import FilterValueAssociation from '../FilterValueAssociation';
import PropTypes from 'prop-types';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
export default function makeAssociationField(associatedObjectType, objectType) {
  var InputComponent = function InputComponent(props) {
    return /*#__PURE__*/_jsx(AssociationSelectSearch, Object.assign({}, props, {
      autofocus: false,
      objectType: associatedObjectType,
      onChange: function onChange(nextValue) {
        return props.onChange(SyntheticEvent(nextValue));
      }
    }));
  };

  InputComponent.displayName = associatedObjectType + "AssociationSelectSearch";
  InputComponent.propTypes = {
    onChange: PropTypes.func.isRequired
  }; // eslint-disable-next-line react/no-multi-comp

  var ValueComponent = function ValueComponent(props) {
    return /*#__PURE__*/_jsx(FilterValueAssociation, Object.assign({}, props, {
      objectType: associatedObjectType,
      subjectId: props.value
    }));
  };

  ValueComponent.displayName = associatedObjectType + "ValueComponent";
  ValueComponent.propTypes = {
    value: PropTypes.string
  }; // Tickets associations do not support Known and NotKnown operators
  // https://issues.hubspotcentral.com/browse/CRM-17487

  if (objectType === TICKET) {
    return {
      operators: OrderedSet.of(Operators.Equal, Operators.NotEqual),
      InputComponent: InputComponent,
      ValueComponent: ValueComponent
    };
  }

  return {
    operators: OrderedSet.of(Operators.Equal, Operators.NotEqual, Operators.Known, Operators.NotKnown),
    InputComponent: InputComponent,
    ValueComponent: ValueComponent
  };
}