'use es6';

import FieldDefinitionRecord from '../../filterQueryFormat/fieldDefinitions/FieldDefinitionRecord';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import PropertyTypesType from 'customer-data-objects-ui-components/propTypes/PropertyTypesType';
export default PropTypes.oneOfType([ImmutablePropTypes.mapContains({
  getLabelString: PropTypes.func,
  inputType: PropertyTypesType,
  valueType: PropertyTypesType,
  InputComponent: PropTypes.func,
  ValueComponent: PropTypes.func
}).isRequired, PropTypes.instanceOf(FieldDefinitionRecord).isRequired]);