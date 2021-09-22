import React from 'react';
import PropTypes from 'prop-types';

import { Button, Dropmenu, Icon } from '@pipedrive/convention-ui-react';

import DeleteActivityOption from './delete-activity-option';
import DownloadIcsOption from './download-ics-option';

const FooterAdditionalActions = ({ onClose }) => {
	return (
		<Dropmenu
			content={({ closePopover }) => (
				<>
					<DeleteActivityOption onClose={onClose} />
					<DownloadIcsOption closePopover={closePopover} />
				</>
			)}
			popoverProps={{ placement: 'top-start' }}
		>
			<Button data-test="activity-dropmenu-button">
				<Icon icon="ellipsis" size="s" />
			</Button>
		</Dropmenu>
	);
};

FooterAdditionalActions.propTypes = {
	onClose: PropTypes.func,
};

export default FooterAdditionalActions;
