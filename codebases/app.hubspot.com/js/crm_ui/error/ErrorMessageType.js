'use es6';

import ObjectTypesType from 'customer-data-objects-ui-components/propTypes/ObjectTypesType';
import customErrorTypes from '../constants/customErrorTypes';
import PropTypes from 'prop-types';
export default PropTypes.oneOfType([ObjectTypesType, PropTypes.oneOf(Object.keys(customErrorTypes))]);