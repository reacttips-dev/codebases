import React, { useCallback } from 'react';
import styled from 'styled-components';

import { useRootSelector } from '../store';
import useToolsContext from '../hooks/useToolsContext';
import { MenuLink } from './menu';
import { isItemActive } from './menu/activeItem';
import stackOrder from './menu/stackOrder';
import { ToolsMenu } from './menu/ToolsMenu';
import { AnyToolsMenuItem } from './navigation/AnyToolsMenuItem';
import { MenuItemList } from './navigation/MenuItemList';

const StyledToolsMenu = styled(ToolsMenu)`
	position: sticky;
	top: 0;
	z-index: ${stackOrder.navToolsMenu};
`;

export function SettingsNavigation() {
	const {
		items: { settings },
		activeItem,
	} = useRootSelector((s) => s.navigation);
	const { metrics } = useToolsContext();

	const isActiveFunc = useCallback((item: MenuLink) => isItemActive(item, activeItem), [activeItem]);
	const onItemClick = useCallback(({ key }) => {
		metrics?.trackUsage?.(null, 'navigation_settings_menu_item', 'clicked', { item: key });
	}, []);

	return (
		<StyledToolsMenu>
			<MenuItemList
				items={settings}
				isActiveFunc={isActiveFunc}
				ItemComponent={AnyToolsMenuItem}
				onItemClick={onItemClick}
			/>
		</StyledToolsMenu>
	);
}
