import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import classNames from 'classnames';

import style from './style.css';

function sidebar({
	display,
	children,
	zIndex,
	exposedClass,
	className,
}) {
	const isGettingStarted = className?.includes('GSPanel');

	const classes = classNames({
		[exposedClass]: true,
		[style.Sidebar]: !isGettingStarted,
		[style.GSSidebar]: isGettingStarted,
		[className]: className,
	});

	return (
		<TransitionGroup>
			{ display && (
				<CSSTransition in={display} timeout={{
					enter: 400,
					exit: 320,
				}} classNames={{
					enter: style['Sidebar-enter'],
					enterActive: style['Sidebar-enter-active'],
					exit: style['Sidebar-exit'],
					exitActive: style['Sidebar-exit-active'],
				}}>
					<div style={{ zIndex }} className={classes}>
						<div className={isGettingStarted ? style.GSSidebar__panel : style.Sidebar__panel}>
							{ children }
						</div>
					</div>
				</CSSTransition>
			) }
		</TransitionGroup>
	);
}

sidebar.propTypes = {
	display: PropTypes.bool.isRequired,
	children: PropTypes.node,
	zIndex: PropTypes.number,
	exposedClass: PropTypes.string.isRequired,
	className: PropTypes.string,
};

export default sidebar;
