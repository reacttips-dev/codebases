import PropTypes from 'prop-types';
import React from 'react';

import { Button, Icon, Tooltip } from '@pipedrive/convention-ui-react';

const ActivityTypeButton = ({ activityType, showName, active, setActivityType }) => {
	const { id, icon_key: iconKey, name } = activityType;
	const button = (
		<Button active={active} onClick={() => setActivityType(activityType)} tabIndex="-1">
			<Icon icon={`ac-${iconKey}`} size="s" />
			{showName && name}
		</Button>
	);

	return showName ? (
		button
	) : (
		<Tooltip key={`activity-type-expanded-${id}`} placement="top" content={name}>
			{button}
		</Tooltip>
	);
};

ActivityTypeButton.propTypes = {
	activityType: PropTypes.object,
	showName: PropTypes.bool,
	active: PropTypes.bool,
	setActivityType: PropTypes.func,
};

export default ActivityTypeButton;
