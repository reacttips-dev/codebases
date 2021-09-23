'use es6';

import PropTypes from 'prop-types';
import valueSeq from 'transmute/valueSeq';
import SearchStatus from 'SalesContentIndexUI/data/constants/SearchStatus';
export default PropTypes.oneOf(valueSeq(SearchStatus).toArray());