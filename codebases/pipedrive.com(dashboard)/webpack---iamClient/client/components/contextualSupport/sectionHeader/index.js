import React from 'react';
import PropTypes from 'prop-types';

import style from './style.css';

function SectionHeader({ children, marginBottom = '0' }) {
	return (<div className={style.SectionHeader__container} style={{ marginBottom }}>
		<span className={style.SectionHeader__title}>{children}</span>
	</div>);
}

SectionHeader.propTypes = {
	children: PropTypes.string.isRequired,
	marginBottom: PropTypes.string.isRequired,
};

export default SectionHeader;
