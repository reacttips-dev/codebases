import React, { useState } from 'react';
import PropTypes  from 'prop-types';
import { Icon, Panel } from '@pipedrive/convention-ui-react';
import SvgIcon from 'components/svgIcon';

import style from './style.css';

const Accordion = ({ title, subTitle, icon, content, isActive, onClick, id }) => {
	const [onHover, setOnHover] = useState(false);

	return (
		<div className={style.Accordion__wrapper}>
			<Panel noMargin={true}
				spacing='none'
				radius="s"
				onMouseEnter={() => setOnHover(true)}
				onMouseLeave={() => setOnHover(false)}
				{ ...((!isActive && onHover) && { elevation: '02' }) }
			>
				<div className={style.Accordion__titleWrapper} onClick={() => {
					onClick(id, isActive);
				}}
				>
					<div className={style.Accordion__leftTitleWrapper}>
						<SvgIcon icon={icon} classname={style.Accordion__icon} />
						<div>
							<div className={style.Accordion__mainTitle}>{title}</div>
							<div className={style.Accordion__subTitle}>{subTitle}</div>
						</div>
					</div>
					<div>{isActive ? <Icon icon='arrow-up'/> : <Icon icon='arrow-down'/>}</div>
				</div>
				{isActive && <div className={style.Accordion__content}>{content}</div>}
			</Panel>
		</div>
	);
};

Accordion.propTypes = {
	title: PropTypes.string.isRequired,
	subTitle: PropTypes.string.isRequired,
	icon: PropTypes.string.isRequired,
	content: PropTypes.node.isRequired,
	isActive: PropTypes.bool,
	onClick: PropTypes.func,
	id: PropTypes.number,
};

export default Accordion;