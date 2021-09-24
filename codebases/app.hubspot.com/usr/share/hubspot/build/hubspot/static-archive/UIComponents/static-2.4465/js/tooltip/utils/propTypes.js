'use es6';

import PropTypes from 'prop-types';
import { PLACEMENTS_SIDES } from '../PlacementConstants';
export var autoPlacementPropType = PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['horiz', 'vert'])]);
export var pinToConstraintPropType = PropTypes.oneOfType([PropTypes.bool, PropTypes.arrayOf(PropTypes.oneOf(PLACEMENTS_SIDES))]);