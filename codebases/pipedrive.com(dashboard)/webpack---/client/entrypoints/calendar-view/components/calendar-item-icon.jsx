import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@pipedrive/convention-ui-react';

const CalendarItemIcon = ({ item, iconKey }) => {
	return (
		<Icon
			icon={`ac-${iconKey}`}
			size="s"
			color={item.get('isPreview') || item.get('isDragging') ? 'white' : 'black-88'}
		/>
	);
};

CalendarItemIcon.propTypes = {
	item: PropTypes.object.isRequired,
	iconKey: PropTypes.string.isRequired,
};

export default CalendarItemIcon;
