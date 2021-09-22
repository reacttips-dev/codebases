import React from 'react';
import PropTypes from 'prop-types';

import ExpandedFields from './expanded-fields';
import CollapsedFields from './collapsed-fields';

const ExpandableFields = (props) => {
	const { handleExpansion, expanded } = props;

	return expanded ? <ExpandedFields /> : <CollapsedFields handleExpansion={handleExpansion} />;
};

ExpandableFields.propTypes = {
	handleExpansion: PropTypes.func,
	expanded: PropTypes.bool,
};

export default ExpandableFields;
