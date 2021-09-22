import React from 'react';
import PropTypes from 'prop-types';
import translate from 'containers/translation';
import style from './style.css';

function noResults({
	gettext,
	searchQuery,
}) {
	return (
		<div className={style.NoResults}>
			<span className={style.NoResults__text}>{gettext('No results for')}</span>
			<span className={style.NoResults__query}>{searchQuery}</span>
		</div>
	);
}

noResults.propTypes = {
	gettext: PropTypes.func,
	searchQuery: PropTypes.string.isRequired,
};

export const NoResults = noResults;
export default translate()(noResults);
