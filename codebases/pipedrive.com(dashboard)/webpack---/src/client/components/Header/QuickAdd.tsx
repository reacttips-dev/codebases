import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Popover } from '@pipedrive/convention-ui-react';

import { SubMenu, QuickAddButton, MenuLink } from '../menu';
import { MenuItemList } from '../navigation/MenuItemList';
import { AnySubMenuItem } from '../navigation/AnySubMenuItem';
import useToolsContext from '../../hooks/useToolsContext';
import useHotkeys from '../../hooks/useHotkeys';
import { useRootSelector } from '../../store';
import { toggleQuickAdd } from '../../store/navigation/actions';
import { isItemActive } from '../menu/activeItem';
import useMenuAction from '../../hooks/useMenuAction';

export default function QuickAdd() {
	const dispatch = useDispatch();
	const quickAddButtonRef = useRef(null);
	const { metrics } = useToolsContext();

	const {
		items: { secondary },
		activeItem,
		quickAddVisible,
	} = useRootSelector((s) => s.navigation);

	const quickAddItem = secondary.find((item) => item.key === 'quick-add') as MenuLink;

	if (!quickAddItem) {
		return null;
	}

	function handleQuickAddToggle() {
		!quickAddVisible && metrics?.trackUsage(null, 'navigation_quick_add_menu', 'opened');
		dispatch(toggleQuickAdd());
	}

	// Hardcode those keys for historical purposes
	useHotkeys(['.', '+'], handleQuickAddToggle);

	const handleItemAction = useMenuAction();

	function closeQuickAdd() {
		dispatch(toggleQuickAdd(false));
	}

	function handleQuickAddItemClick(item: MenuLink) {
		closeQuickAdd();

		if (item.action) {
			handleItemAction(item.action);
		}
	}

	function onPopupVisibleChange() {
		if (quickAddVisible) {
			closeQuickAdd();
		}
	}

	function getQuickAddPopoverContent() {
		return (
			<SubMenu data-test="quick-add-menu">
				<MenuItemList
					items={quickAddItem.submenu}
					isActiveFunc={(item: MenuLink) => isItemActive(item, activeItem)}
					ItemComponent={AnySubMenuItem}
					onItemClick={handleQuickAddItemClick}
				/>
			</SubMenu>
		);
	}

	return (
		<Popover
			placement="bottom-start"
			offset={-16}
			spacing="none"
			innerRefProp="ref"
			visible={quickAddVisible}
			onPopupVisibleChange={onPopupVisibleChange}
			portalTo={document.body}
			content={getQuickAddPopoverContent}
		>
			<QuickAddButton
				item={quickAddItem}
				isActive={quickAddVisible}
				onClick={handleQuickAddToggle}
				ref={quickAddButtonRef}
			/>
		</Popover>
	);
}
