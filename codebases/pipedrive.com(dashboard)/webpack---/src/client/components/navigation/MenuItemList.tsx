import React from 'react';
import { MenuItem, MenuLink } from '../menu';

interface MenuItemProps {
	item: MenuItem;
	isActive?: boolean;
	onClick?(item: MenuLink, ev: React.SyntheticEvent): void;
}

interface Props {
	items?: MenuItem[];
	isActiveFunc?: (item: MenuItem) => boolean;
	ItemComponent: React.ComponentType<MenuItemProps>;
	onItemClick?(item: MenuLink, ev: React.SyntheticEvent): void;
}

export function MenuItemList({ items, isActiveFunc = () => false, ItemComponent, onItemClick }: Props) {
	if (!items) {
		return null;
	}

	return (
		<>
			{items.map((item: MenuItem, i) => (
				<ItemComponent key={i} item={item} isActive={isActiveFunc(item)} onClick={onItemClick} />
			))}
		</>
	);
}
