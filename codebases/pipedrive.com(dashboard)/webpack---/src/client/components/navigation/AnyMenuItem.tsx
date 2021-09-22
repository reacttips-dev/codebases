import React from 'react';
import { Separator } from '@pipedrive/convention-ui-react';

import { NavMenuLink, MenuItem, NavMenuTitle, NavMenuDivider } from '../menu';

interface Props {
	item: MenuItem;
	isActive?: boolean;
	onClick?(item: MenuItem, ev: React.SyntheticEvent): void;
}

export function AnyMenuItem({ item, isActive, onClick }: Props) {
	switch (item.type) {
		case 'title':
			return <NavMenuTitle>{item.title}</NavMenuTitle>;
		case 'divider':
			return <NavMenuDivider>{item.title}</NavMenuDivider>;
		case 'logo':
			return <Separator />;
		case 'component':
			return <item.component />;
		default:
			return <NavMenuLink item={item} isActive={isActive} onClick={onClick} />;
	}
}
