import React from 'react';
import PropTypes  from 'prop-types';

import style from './style.css';

function ResultMeta({ source, type, date }) {
	return (<div className={style.Results__meta}>
		<span>{source}</span>
		<span>{type}</span>
		<span>{date}</span>
	</div>);
}

ResultMeta.propTypes = {
	source: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	date: PropTypes.string,
};

export default ResultMeta;
