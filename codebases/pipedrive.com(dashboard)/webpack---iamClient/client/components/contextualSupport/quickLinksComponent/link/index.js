import style from './style.css';
import { Icon } from '@pipedrive/convention-ui-react';
import PropTypes from 'prop-types';
import React from 'react';
import { toggleLines } from 'utils/styleHelper';

const Link = ({
	linkConfig, trackExternalLink, isDivider, order,
}) => {
	return (
		<div
			onMouseOver={() => toggleLines('transparent', order)}
			onMouseLeave={() => toggleLines('#eeeeee', order)}
			className={style.linkWrapper}>
			<div className={style.linkContainer}>
				<a
					className={style.linkComponent}
					href={linkConfig.link}
					target="_blank"
					rel="noopener noreferrer"
					onClick={(ev) => trackExternalLink(ev.target.href, linkConfig.id)}
				>
					<Icon className={style.icon} icon={linkConfig.icon} color="blue"/>
					<span className="linkText">{linkConfig.name}</span>
				</a>
				<Icon
					className={style.linkContainer__linkIcon}
					color='black-64'
					icon="sm-redirect"/>
			</div>
			{isDivider && <div id={`line-${order}`} className={style.line}/>}
		</div>
	);
};

Link.propTypes = {
	linkConfig: PropTypes.object.isRequired,
	trackExternalLink: PropTypes.func.isRequired,
	isDivider: PropTypes.bool.isRequired,
	order: PropTypes.number.isRequired,
};

export default Link;