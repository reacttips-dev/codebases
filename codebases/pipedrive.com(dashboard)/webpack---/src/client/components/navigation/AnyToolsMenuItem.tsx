import React from 'react';
import { Separator } from '@pipedrive/convention-ui-react';

import { MenuItem, NavMenuTitle, NavMenuDivider } from '../menu';
import { ToolsMenuItem } from '../menu/ToolsMenu/ToolsMenuItem';

interface Props {
	item: MenuItem;
	isActive?: boolean;
	onClick?(item: MenuItem, ev: React.SyntheticEvent): void;
}

function AnyToolsMenuItemComponent({ item, isActive, onClick }: Props) {
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
			return <ToolsMenuItem item={item} isActive={isActive} onClick={onClick} />;
	}
}

export const AnyToolsMenuItem = React.memo(AnyToolsMenuItemComponent);
