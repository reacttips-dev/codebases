'use es6';

import * as ObjectTypes from 'customer-data-objects/constants/ObjectTypes';
import PropTypes from 'prop-types';
export default PropTypes.oneOf(Object.keys(ObjectTypes));