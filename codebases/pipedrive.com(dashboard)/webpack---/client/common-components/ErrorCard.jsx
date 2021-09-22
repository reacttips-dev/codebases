import React from 'react';
import PropTypes from 'prop-types';
import { Snackbar } from '@pipedrive/convention-ui-react';
import withContext from '../utils/context';

const ErrorCard = ({ component, translator }) => (
	<Snackbar
		key="error-snack"
		message={translator.gettext(
			'Something unexpected happened with the component "%s"',
			component,
		)}
		actionText={translator.gettext('Reload the page')}
		duration="no-timeout"
		onClick={() => document.location.reload()}
	/>
);

ErrorCard.propTypes = {
	component: PropTypes.string.isRequired,
	translator: PropTypes.object.isRequired,
};

export default withContext(ErrorCard);
