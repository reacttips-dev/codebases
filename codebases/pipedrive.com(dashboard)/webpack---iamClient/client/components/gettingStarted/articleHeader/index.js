import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@pipedrive/convention-ui-react';

import style from './style.css';

function articleHeader({
	icon,
	title,
	subtitle,
}) {
	return (
		<div className={style.ArticleHeader}>
			{ icon && <Icon className={style.ArticleHeader__icon} icon={icon} color="black-64" /> }
			<span
				className={`${style.ArticleHeader__title} ${icon ? '' : style['ArticleHeader--withoutIcon']}`}
			>
				{title}
			</span>
			<div
				className={`${style.ArticleHeader__subtitle} ${icon ? '' : style['ArticleHeader--withoutIcon']}`}
			>
				{subtitle}
			</div>
		</div>
	);
}

articleHeader.propTypes = {
	icon: PropTypes.string,
	title: PropTypes.string.isRequired,
	subtitle: PropTypes.string.isRequired,
};

export default articleHeader;
