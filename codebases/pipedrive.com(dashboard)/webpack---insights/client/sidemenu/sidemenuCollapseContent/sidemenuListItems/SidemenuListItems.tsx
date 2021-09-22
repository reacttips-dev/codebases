import React, { useCallback, useEffect, useState } from 'react';
import update from 'immutability-helper';
import { useDrop } from 'react-dnd';

import SidemenuListItem from './sidemenuListItem';
import { MenuItem } from '../../../pages/App/insightsWrapper/sideMenuUtils';
import {
	SidemenuDashboard,
	SidemenuReport,
	SidemenuSettings,
} from '../../../types/apollo-query-types';

export interface SidemenuListItemsProps {
	type: keyof SidemenuSettings;
	itemId: string;
	items: MenuItem[];
	searchText: string;
	isNavigationDisabled: boolean;
	canHaveMultipleDashboards: boolean;
	saveItemOrder: Function;
}

const SidemenuListItems: React.FC<SidemenuListItemsProps> = ({
	type,
	itemId,
	items,
	searchText,
	isNavigationDisabled,
	canHaveMultipleDashboards,
	saveItemOrder,
}) => {
	const [menuItems, setMenuItems] = useState(items);

	useEffect(() => {
		setMenuItems(items);
	}, [items]);

	const findMenuItem = useCallback(
		(id) => {
			const menuItem = menuItems.filter(
				(menuItem: SidemenuReport | SidemenuDashboard) =>
					menuItem.id === id,
			)[0];

			return {
				menuItem,
				index: menuItems.indexOf(menuItem),
			};
		},
		[menuItems],
	);

	const moveMenuItem = useCallback(
		(id, atIndex) => {
			const { menuItem, index } = findMenuItem(id);

			if (index < 0) {
				return;
			}

			setMenuItems(
				update(menuItems, {
					$splice: [
						[index, 1],
						[atIndex, 0, menuItem],
					],
				}),
			);
		},
		[findMenuItem, menuItems],
	);

	const [{ isOverOtherItem }, drop] = useDrop({
		accept: type,
		drop: () => {
			saveItemOrder(menuItems);
		},
		collect: (monitor) => ({ isOverOtherItem: monitor.isOver() }),
	});

	return (
		<div ref={drop}>
			{menuItems.map((item: MenuItem, index: number) => (
				<SidemenuListItem
					key={item.id}
					index={index}
					item={item}
					type={type}
					isActive={itemId === item.id}
					searchText={searchText}
					moveMenuItem={moveMenuItem}
					isNavigationDisabled={isNavigationDisabled}
					canHaveMultipleDashboards={canHaveMultipleDashboards}
					isOverOtherItem={isOverOtherItem}
				/>
			))}
		</div>
	);
};

export default SidemenuListItems;
