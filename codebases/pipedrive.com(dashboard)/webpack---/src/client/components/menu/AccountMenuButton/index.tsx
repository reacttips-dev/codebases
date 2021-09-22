import React, { useRef } from 'react';
import useMenuCoachmark from '../../../hooks/useMenuCoachmark';

import { MenuLink } from '../types';

import UserBar from './UserBar';

interface Props {
	item: MenuLink;
	name: string;
	company: string;
	icon: string;
	isActive?: boolean;
	onClick?(item: MenuLink, ev: React.SyntheticEvent): void;
	buttonRef?: { current: HTMLElement };
}

export const AccountMenuButton = ({ item, onClick, isActive, name, company, icon }: Props) => {
	const element = useRef();
	const hasMultipleCompanies = !!item.submenu.find((menuItem) => menuItem?.key === 'company_select');

	const { coachmark, visible: coachmarkVisible } = useMenuCoachmark(item, element, {
		appearance: {
			placement: 'bottomLeft',
			zIndex: {
				min: 100,
			},
			align: {
				points: ['tr', 'bc'],
				offset: [27, 12],
			},
		},
	});

	function handleClick(ev: React.SyntheticEvent) {
		coachmarkVisible && coachmark?.close();

		onClick && onClick(item, ev);
	}

	return (
		<UserBar
			ref={element}
			hasMultipleCompanies={hasMultipleCompanies}
			isActive={isActive}
			name={name}
			company={company}
			avatarUrl={icon}
			onClick={handleClick}
		/>
	);
};
