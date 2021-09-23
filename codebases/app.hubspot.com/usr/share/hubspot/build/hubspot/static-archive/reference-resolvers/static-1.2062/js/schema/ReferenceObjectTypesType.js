'use es6';

import PropTypes from 'prop-types';
import * as ReferenceObjectTypes from 'reference-resolvers/constants/ReferenceObjectTypes';
export default PropTypes.oneOf(Object.keys(ReferenceObjectTypes));