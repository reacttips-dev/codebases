'use es6';

import PropTypes from 'prop-types';
import valueSeq from 'transmute/valueSeq';
import SearchContentTypes from 'SalesContentIndexUI/data/constants/SearchContentTypes';
export default PropTypes.oneOf(valueSeq(SearchContentTypes).toArray());