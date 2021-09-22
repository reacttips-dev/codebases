import React from 'react';
import { Separator } from '@pipedrive/convention-ui-react';

import { SubMenuItem, SubMenuTitle, MenuItem } from '../menu';

interface Props {
	item: MenuItem;
	isActive?: boolean;
	onClick?(item: MenuItem, ev: React.SyntheticEvent): void;
}

export function AnySubMenuItem({ item, onClick, isActive }: Props) {
	switch (item.type) {
		case 'title':
			return <SubMenuTitle {...item.props}>{item.title}</SubMenuTitle>;
		case 'logo':
		case 'divider':
			return <Separator />;
		case 'component':
			return <item.component />;
		default:
			return <SubMenuItem item={item} onClick={onClick} isActive={isActive} />;
	}
}
