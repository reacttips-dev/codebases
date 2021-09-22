import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@pipedrive/convention-ui-react';
import withContext from '../../../utils/context';

const RecurringActivity = ({ translator, children }) => {
	return (
		<Tooltip
			popperProps={{
				modifiers: {
					preventOverflow: {
						enabled: true,
						boundariesElement: 'scrollParent',
					},
				},
			}}
			content={translator.gettext('Go to your external calendar to edit recurring events')}
		>
			{children}
		</Tooltip>
	);
};

RecurringActivity.propTypes = {
	translator: PropTypes.object.isRequired,
	children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default withContext(RecurringActivity);
