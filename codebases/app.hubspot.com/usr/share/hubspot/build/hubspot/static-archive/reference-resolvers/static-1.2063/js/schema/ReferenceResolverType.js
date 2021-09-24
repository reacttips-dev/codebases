'use es6';

import PropTypes from 'prop-types';
import ReferenceResolverAllType from './ReferenceResolverAllType';
import ReferenceResolverSearchType from './ReferenceResolverSearchType';
export default PropTypes.oneOfType([ReferenceResolverAllType.isRequired, ReferenceResolverSearchType.isRequired]);