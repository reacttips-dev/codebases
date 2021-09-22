import React from 'react';
import styled from 'styled-components';

import { NavBarLink, NavBarDivider, NavBarIcon, MenuItem, MenuLink } from '../menu';
import { PillWithCount } from './PillWithCount';
import { WarningIcon } from './WarningIcon';
import { getMailItemData } from './helpers/getMailItemData';

function getIconOrPill(item: MenuLink) {
	if (item.warning) {
		return <WarningIcon />;
	}

	if (item.pill?.countKey) {
		return <PillWithCount pill={item.pill} maxCount={999} />;
	}
}

const OverlayIcon = styled.div`
	position: absolute;
	top: 4px;
	right: 4px;
`;

interface Props {
	item: MenuItem;
	isActive?: boolean;
	onClick?(item: MenuItem, ev: React.SyntheticEvent): void;
}

export function AnyBarItem({ item, isActive, onClick }: Props) {
	switch (item.type) {
		case 'logo':
			return <NavBarIcon item={item} />;
		case 'title':
			return <NavBarDivider />;
		case 'divider':
			return <NavBarDivider item={item} />;
		case 'component':
			return <item.component />;
		default: {
			if (item.key === 'mail') {
				const mailItem = getMailItemData(item);

				item.warning = mailItem.warning;
				item.title = mailItem.title;
			}

			return (
				<NavBarLink item={item} isActive={isActive} onClick={onClick}>
					<OverlayIcon>{getIconOrPill(item)}</OverlayIcon>
				</NavBarLink>
			);
		}
	}
}
