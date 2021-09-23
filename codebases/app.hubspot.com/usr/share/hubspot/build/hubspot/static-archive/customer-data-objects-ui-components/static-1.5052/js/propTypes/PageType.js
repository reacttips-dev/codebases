'use es6';

import PropTypes from 'prop-types';
import { BOARD, CLEANUP, INDEX } from 'customer-data-objects/view/PageTypes';
export default PropTypes.oneOf([BOARD, CLEANUP, INDEX]);