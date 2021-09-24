'use es6';

import PropTypes from 'prop-types';
import { THREAD_LIST, THREAD_VIEW, KNOWLEDGE_BASE } from '../constants/views';
export default PropTypes.oneOf([THREAD_LIST, THREAD_VIEW, KNOWLEDGE_BASE]);