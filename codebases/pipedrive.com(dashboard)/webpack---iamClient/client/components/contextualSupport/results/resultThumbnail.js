import React from 'react';
import PropTypes from 'prop-types';

import style from './style.css';

function ResultThumbnail({ url }) {
	return (
		<div className={style.Results__thumbnailWrapper}>
			<div
				className={style.Results__thumbnail}
				style={{ backgroundImage: `url(${url})` }}
			></div>
		</div>
	);
}

ResultThumbnail.propTypes = {
	url: PropTypes.string.isRequired,
};

export default ResultThumbnail;
