import { Icon, Tooltip } from '@pipedrive/convention-ui-react';
import classNames from 'classnames';
import React, { useRef } from 'react';

import { NavBarItem } from './NavBarItem';
import { stackOrder } from './stackOrder';
import { MenuLink, MenuItem } from './types';
import { TooltipContentWithKeyboardShortcut } from '../KeyboardShortcut';
import useMenuCoachmark from '../../hooks/useMenuCoachmark';

interface Props {
	children?: React.ReactNode;
	item: MenuLink;
	isActive: boolean;
	onClick?(item: MenuItem, ev: React.SyntheticEvent): void;
}

export function NavBarLink({ item, isActive, onClick, children }: Props) {
	const element = useRef();

	const { coachmark, visible: coachmarkVisible } = useMenuCoachmark(item, element, {
		appearance: {
			placement: 'right',
			zIndex: {
				min: 100,
			},
			align: {
				points: ['cl', 'cr'],
				offset: [12, 0],
			},
		},
	});

	function handleClick(ev: React.SyntheticEvent) {
		coachmarkVisible && coachmark?.close();

		if (onClick) {
			onClick(item, ev);
		}
	}

	return (
		<div ref={element}>
			<Tooltip
				content={
					<TooltipContentWithKeyboardShortcut keyboardShortcut={item.keyboardShortcut}>
						{item.title}
					</TooltipContentWithKeyboardShortcut>
				}
				placement="right"
				innerRefProp="ref"
				mouseEnterDelay={0}
				mouseLeaveDelay={0}
				style={{ zIndex: stackOrder.navBarItemTooltip }}
			>
				<NavBarItem
					className={classNames({ active: isActive })}
					href={item.path}
					onClick={handleClick}
					rel="noopener"
					data-test={`navbar-item-${item.key}`}
					data-coachmark={`navbar-item-${item.key}`}
					aria-label={item.title}
				>
					<Icon icon={item.icon} color={isActive ? 'white' : 'black-16'} />
					{children}
				</NavBarItem>
			</Tooltip>
		</div>
	);
}
