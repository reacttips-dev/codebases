import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslator } from '@pipedrive/react-utils';

import styled from 'styled-components';
import { colors, fonts } from '@pipedrive/convention-ui-css/dist/js/variables';
import { Icon } from '@pipedrive/convention-ui-react';

import useUserDataContext from '../../hooks/useUserDataContext';
import useToolsContext from '../../hooks/useToolsContext';
import useMailConnections from '../../hooks/useMailConnections';
import { useRootSelector } from '../../store';
import { togglePinned } from '../../store/navigation/actions';
import { MenuLink, ToggleNavTooltipContent, saveMenuUserSetting, MenuState } from '../menu';
import CollapseButtonCoachmark from './CollapseButtonCoachmark';
import { stackOrder } from '../menu/stackOrder';
import { HeaderTooltip } from './index';
import { HeaderIcon } from './styled';

const BreadcrumbsContainer = styled.div`
	display: flex;
	font: ${fonts.fontTitleL};
	padding: 16px 0;
	overflow: hidden;
	white-space: nowrap;

	:first-child {
		padding-left: 20px;
	}
`;

const NavMenuCollapseButton = styled.div`
	border-radius: 50%;
	margin: 8px 2px 8px 12px;
	align-items: center;
	display: flex;
	justify-content: center;
	cursor: pointer;
	user-select: none;
	z-index: ${stackOrder.navMenuCollapseButton};
`;

const BreadcrumbsItem = styled.h1`
	display: block;
	flex: 0 1 auto;
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const BreadcrumbsTitle = styled(BreadcrumbsItem)`
	color: ${colors.black64};
`;

const BreadcrumbsDivider = styled.div`
	margin: 0 6px;
	color: ${colors.black32};
	font-weight: ${fonts.fontWeightNormal};
`;

function getTitle(activeMenuItem: MenuLink) {
	return activeMenuItem ? activeMenuItem.title : '';
}

export default function Breadcrumbs() {
	const dispatch = useDispatch();
	const translator = useTranslator();
	const { metrics } = useToolsContext();
	const [breadcrumbsKey, setBreadcrumbsKey] = useState(null);
	const { user } = useUserDataContext();
	const {
		items: { primary },
		activeItem,
		menuState,
	} = useRootSelector((s) => s.navigation);

	const activeNavBarItem = activeItem?.parent || activeItem;
	const isPrimaryActive = primary.includes(activeNavBarItem);
	const hasSubMenu = isPrimaryActive && activeNavBarItem?.submenu;
	const menuPinned = menuState[activeNavBarItem?.key] === MenuState.PINNED;

	function handleCollapseClick() {
		metrics?.trackUsage(null, 'navigation_secondary_menu', 'toggled', {
			resolution: menuPinned ? 'hide' : 'show',
		});
		dispatch(togglePinned(activeNavBarItem.key));
		saveMenuUserSetting(activeNavBarItem.key, menuState, user);
	}

	function onMailConnectionChange(mailConnections) {
		const hasActiveConnection = mailConnections?.hasActiveNylasConnection();

		if (hasActiveConnection) {
			setBreadcrumbsKey(Math.random());
		}
	}

	// trigger mailConnections on change listener
	useMailConnections(onMailConnectionChange);

	return (
		<>
			{hasSubMenu && (
				<CollapseButtonCoachmark>
					<HeaderTooltip
						content={<ToggleNavTooltipContent translator={translator} pinned={menuPinned} />}
						placement="bottom-start"
					>
						<NavMenuCollapseButton data-test="breadcrumbs">
							<HeaderIcon lastItem={false} active={false} yellow={false} onClick={handleCollapseClick}>
								<Icon icon={menuPinned ? 'menu-hide' : 'menu-show'} color="black-64" />
							</HeaderIcon>
						</NavMenuCollapseButton>
					</HeaderTooltip>
				</CollapseButtonCoachmark>
			)}
			<BreadcrumbsContainer>
				{hasSubMenu && (
					<>
						<BreadcrumbsTitle title={activeNavBarItem.title}>{activeNavBarItem.title}</BreadcrumbsTitle>
						<BreadcrumbsDivider>/</BreadcrumbsDivider>
					</>
				)}
				<BreadcrumbsItem key={breadcrumbsKey} title={getTitle(activeItem)}>
					{getTitle(activeItem)}
				</BreadcrumbsItem>
			</BreadcrumbsContainer>
		</>
	);
}
