import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip, Icon, Snackbar } from '@pipedrive/convention-ui-react';
import withContext from '../../utils/context';

const CopyButton = ({ copyText, translator, onClick }) => {
	const [copiedSnackbarVisible, setCopiedSnackbarVisible] = useState(false);

	const copyLink = () => {
		const el = document.createElement('textarea');

		el.value = copyText;
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);

		setCopiedSnackbarVisible(true);
		onClick && onClick();
	};

	return (
		<>
			<Tooltip
				placement="top"
				popperProps={{ positionFixed: true }}
				content={translator.gettext('Copy joining info')}
			>
				<Button onClick={copyLink} data-test="conference-meeting-copy-btn">
					<Icon icon="copy" size="s" />
				</Button>
			</Tooltip>

			{copiedSnackbarVisible && (
				<Snackbar
					message={translator.gettext('Joining info copied!')}
					onDismiss={() => setCopiedSnackbarVisible(false)}
					data-test="conference-meeting-copied-snackbar"
				/>
			)}
		</>
	);
};

CopyButton.propTypes = {
	copyText: PropTypes.string.isRequired,
	translator: PropTypes.object.isRequired,
	onClick: PropTypes.func,
};

export default withContext(CopyButton);
