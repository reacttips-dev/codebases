'use es6';

import PropTypes from 'prop-types';
import * as ClientStatuses from '../constants/CallWidgetStates';
var ClientStatusPropType = PropTypes.oneOf(Object.keys(ClientStatuses));
export default ClientStatusPropType;