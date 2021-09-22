import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import throttle from 'lodash/debounce';
import { useRootSelector } from '../store';
import useToolsContext from '../hooks/useToolsContext';
import useHotkeys from '../hooks/useHotkeys';
import useMenuAction from '../hooks/useMenuAction';
import { MenuItem, MenuLink } from './menu/types';
import { toggleQuickAdd } from '../store/navigation/actions';

const reduceItemsWithKeyboard = (acc, item: MenuItem[] | MenuItem): MenuLink[] => {
	if (!item) {
		return acc;
	}

	if (Array.isArray(item)) {
		return item.reduce(reduceItemsWithKeyboard, acc);
	}

	if (typeof item === 'object' && !(item as MenuItem).key) {
		return Object.values(item).reduce(reduceItemsWithKeyboard, acc);
	}

	if ((item as MenuLink).keyboardShortcut) {
		acc.push(item);
	}

	if ((item as MenuLink).submenu) {
		return (item as MenuLink).submenu.reduce(reduceItemsWithKeyboard, acc);
	}

	return acc;
};

const filterItemsWithKeyboardShortcuts = (menus): MenuLink[] => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
	// @ts-ignore
	return Object.values(menus).reduce(reduceItemsWithKeyboard, []);
};

const getMenuItemPath = (item: MenuLink) => {
	if (!item.submenu) {
		return item.path;
	}

	const submenu = item.submenu.filter((subitem) => !!(subitem as MenuLink).path);

	const currentPath = window.location.pathname;

	const currentTabPathIndex = submenu.reduce((isOnTabPath, subitem, index) => {
		if (currentPath.startsWith((subitem as MenuLink).path)) {
			return index;
		}

		return isOnTabPath;
	}, -1);

	if (currentTabPathIndex >= 0) {
		const nextTabIndex = currentTabPathIndex === submenu.length - 1 ? 0 : currentTabPathIndex + 1;
		const nextTab = submenu[nextTabIndex];

		return (nextTab as MenuLink).path;
	}

	return item.path;
};

function MenuKeyboardShortcut({ keyboardShortcut, handler }) {
	useHotkeys(keyboardShortcut, handler);

	return null;
}

/**
 * It is not nice to use hooks in loops or otherwise conditionally.
 * To work around I create two components which basically render nothing into DOM.
 * They will however run the necessary hooks.
 * Otherwise we would need to have to have an alternative for hookless hotkeys.
 */
function MenuKeyboardShortcuts() {
	const dispatch = useDispatch();
	const items = useRootSelector((s) => s.navigation.items);
	const { router, metrics } = useToolsContext();
	const handleItemAction = useMenuAction();

	const track = ({ keyboardShortcut, key }: MenuLink) => {
		metrics &&
			metrics.trackUsage(null, 'navigation_keyboard_shortcut', 'pressed', {
				keyboard_shortcut: keyboardShortcut,
				key,
			});
	};

	const itemClickHandler = throttle((item) => {
		if (item.path) {
			const path = getMenuItemPath(item);

			router.navigateTo(path, {
				trackingData: { metrics_data: { source: 'quick-add-shortcuts' } },
			});
		} else if (item.action) {
			handleItemAction(item.action);
		}

		track(item);
		dispatch(toggleQuickAdd(false));
	}, 200);

	const itemsWithKeyboardShortcuts = useMemo(() => {
		if (!metrics || !items) {
			return [];
		}

		return filterItemsWithKeyboardShortcuts(items);
	}, [items, metrics]);

	return (
		<>
			{itemsWithKeyboardShortcuts.map((item, index) => (
				<MenuKeyboardShortcut
					key={index}
					keyboardShortcut={item.keyboardShortcut}
					handler={() => itemClickHandler(item)}
				/>
			))}
		</>
	);
}

export default MenuKeyboardShortcuts;
