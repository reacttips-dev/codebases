import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useTranslator } from '@pipedrive/react-utils';
import { NavBar, NavBarMoreMenuItem, NavMoreMenu, MenuLink } from './menu';
import { useClickOutside } from '../hooks/useClickOutside';
import useToolsContext from '../hooks/useToolsContext';
import { toggleMore } from '../store/navigation/actions';
import { AnyBarItem } from './navigation/AnyBarItem';
import { AnySubMenuItem } from './navigation/AnySubMenuItem';
import { MenuItemList } from './navigation/MenuItemList';
import { useDispatch } from 'react-redux';
import { useRootSelector } from '../store';
import { isItemActive } from './menu/activeItem';
import { addFlowCoachmark, closeFlowCoachmark } from './menu/utils/interfaceTour';
import { MarketplaceButton } from './Marketplace';

const StyledRoot = styled.div`
	position: relative;
	display: flex;

	*:fullscreen & {
		display: none;
	}

	@media print {
		display: none;
	}
`;

const BottomNavBar = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
`;

export function Navigation() {
	const moreMenuRef = useRef(null);
	const moreButtonRef = useRef(null);
	const translator = useTranslator();
	const { items, activeItem, moreVisible, blacklistedUI } = useRootSelector((s) => s.navigation);
	const { primary, more } = items;
	const { interfaceTour } = useToolsContext();

	const dispatch = useDispatch();

	const moreItem = more.find((item) => item.key === 'more') as MenuLink;

	function handleMoreToggle() {
		dispatch(toggleMore());
	}

	function handleMoreItemClose() {
		dispatch(toggleMore(false));
	}

	function handlePrimaryItemClick(item: MenuLink) {
		closeFlowCoachmark(interfaceTour, item.key);
	}

	useEffect(() => addFlowCoachmark(interfaceTour));

	useClickOutside(moreMenuRef, handleMoreItemClose, {
		excludedRef: moreButtonRef,
		enabled: moreVisible,
	});

	return (
		<StyledRoot id="froot-nav">
			<NavBar data-test="navbar" aria-label={translator?.gettext('Primary')}>
				<MenuItemList
					items={blacklistedUI.mainNav ? primary.slice(0, 1) : primary}
					isActiveFunc={(item: MenuLink) => isItemActive(item, activeItem)}
					ItemComponent={AnyBarItem}
					onItemClick={handlePrimaryItemClick}
				/>
				{!blacklistedUI.mainNav && moreItem && (
					<>
						<NavBarMoreMenuItem
							item={moreItem}
							isActive={isItemActive(moreItem, activeItem)}
							isVisible={moreVisible}
							onClick={handleMoreToggle}
							ref={moreButtonRef}
						/>
						<BottomNavBar>
							<MarketplaceButton />
						</BottomNavBar>
					</>
				)}
			</NavBar>
			{moreItem && (
				<NavMoreMenu isVisible={moreVisible} ref={moreMenuRef}>
					<MenuItemList
						items={moreItem.submenu}
						isActiveFunc={(item: MenuLink) => isItemActive(item, activeItem)}
						ItemComponent={AnySubMenuItem}
						onItemClick={handleMoreItemClose}
					/>
				</NavMoreMenu>
			)}
		</StyledRoot>
	);
}
