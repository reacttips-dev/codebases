import React from 'react';
import { NavMenu, DetachedMenu, MenuLink, MenuState, SubMenuMainContent, SubMenuFooter } from './menu';
import { AnyMenuItem } from './navigation/AnyMenuItem';
import { MenuItemList } from './navigation/MenuItemList';
import { useRootSelector } from '../store';
import useToolsContext from '../hooks/useToolsContext';
import { isItemActive } from './menu/activeItem';
import { SettingsNavigation } from './SettingsNavigation';
import SubNavigationFooterMicroFEComponent from './SubNavigationFooterMicroFEComponent';

export function SubNavigation() {
	const {
		items: { primary, settings },
		activeItem,
		menuState,
		blacklistedUI,
	} = useRootSelector((s) => s.navigation);
	const { metrics } = useToolsContext();

	const activeNavBarItem = activeItem?.parent || activeItem;

	if (!activeNavBarItem?.submenu) {
		return null;
	}

	if (blacklistedUI.subNav) {
		return null;
	}

	const menuPinned = menuState[activeNavBarItem?.key] === MenuState.PINNED;
	const menuDetached = menuState[activeNavBarItem?.key] === MenuState.DETACHED;
	const showSettingsBar = !!settings?.find(
		(item) => item.key === activeItem?.key || item.key === activeNavBarItem?.key,
	);

	function handleItemClick(item) {
		if (!metrics) {
			return;
		}

		metrics.trackUsage(null, 'navigation_secondary_menu_item', 'clicked', {
			item: item.key,
			// eslint-disable-next-line @typescript-eslint/camelcase
			secondary_menu: menuDetached ? MenuState.DETACHED : menuPinned ? 'expanded' : 'peeked',
		});
	}

	const isPrimaryActive = primary.includes(activeNavBarItem);

	const itemList = (
		<MenuItemList
			items={activeNavBarItem.submenu}
			isActiveFunc={(item: MenuLink) => isItemActive(item, activeItem)}
			ItemComponent={AnyMenuItem}
			onItemClick={handleItemClick}
		/>
	);

	const footerNavList = () => {
		if (activeNavBarItem.submenuFooter?.length) {
			return activeNavBarItem.submenuFooter.map((item) => {
				if (item.componentType === 'microFE') {
					return <SubNavigationFooterMicroFEComponent key={item.key} componentName={item.microFEComponent} />;
				}

				return null;
			});
		}
		return null;
	};

	return (
		<>
			{isPrimaryActive && (
				<NavMenu pinned={menuPinned} menuKey={activeNavBarItem.key}>
					<SubMenuMainContent>{itemList}</SubMenuMainContent>
					<SubMenuFooter>{footerNavList()}</SubMenuFooter>
				</NavMenu>
			)}
			{showSettingsBar && <SettingsNavigation />}
			{menuDetached && <DetachedMenu>{itemList}</DetachedMenu>}
		</>
	);
}
