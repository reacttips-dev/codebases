import React from 'react';
import PropTypes from 'prop-types';

import style from './style.css';

const Icon = ({ url }) => (
	<div className={style.Icon}>
		<img className={style.Icon__image} src={url} />
	</div>
);

Icon.propTypes = {
	url: PropTypes.string,
};

export default Icon;