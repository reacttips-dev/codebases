import colors from '@pipedrive/convention-ui-css/dist/amd/colors.js';
import elevations from '@pipedrive/convention-ui-css/dist/amd/elevations.js';
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import styled, { css } from 'styled-components';
import { useTranslator } from '@pipedrive/react-utils';
import { Tooltip } from '@pipedrive/convention-ui-react';

import { stackOrder } from './stackOrder';
import classNames from 'classnames';
import useHover from '../../hooks/useHover';
import useToolsContext from '../../hooks/useToolsContext';
import useHotkeys from '../../hooks/useHotkeys';
import config from '../../config/styles';
import { TooltipContentWithKeyboardShortcut } from '../KeyboardShortcut';
import { useDispatch } from 'react-redux';
import { togglePinned } from '../../store/navigation/actions';
import { useRootSelector } from '../../store';
import useUserDataContext from '../../hooks/useUserDataContext';
import { MenuState } from './types';

interface TooltipProps {
	pinned?: boolean;
	translator: any;
}

export const ToggleNavTooltipContent = ({ pinned, translator }: TooltipProps) => (
	<TooltipContentWithKeyboardShortcut keyboardShortcut="[">
		{pinned ? translator.gettext('Hide menu') : translator.gettext('Show menu')}
	</TooltipContentWithKeyboardShortcut>
);

const colorBlueHex32 = colors['$color-blue-hex-32'];

const NavMenuContent = styled.div`
	overflow: hidden;
	box-sizing: border-box;
`;

const StyledRoot = styled.nav<{ transitionEnabled: boolean }>`
	--menucontent-title-height: 56px;
	--transition-duration-in: 0.25s;
	--transition-duration-out: 0.2s;
	--transition-duration-hover: 0.05s;

	position: absolute;
	top: 0;
	left: ${config.collapsedSubNavigationWidth - config.subNavigationWidth}px;
	bottom: 0;
	width: ${config.subNavigationWidth}px;
	flex: 0;

	background-color: ${colors['$color-white-hex']};
	box-shadow: inset -1px 0px 0px ${colors['$color-black-hex-12']};
	z-index: ${stackOrder.navMenu};

	transition: ${(props) =>
		props.transitionEnabled
			? 'left ease-in-out var(--transition-duration-out), background-color var(--transition-duration-hover)'
			: 'none'};

	&.pinned {
		left: 0;
	}

	&:hover:not(.pinned):not(.hovered) {
		background-color: ${colors['$color-blue-hex-8']};
		box-shadow: inset -1px 0px 0px ${colorBlueHex32};
	}

	&.pinned,
	&.hovered {
		background-color: ${colors['$color-white-hex']};
	}

	&:not(.pinned).hovered {
		left: 0;
		box-shadow: ${elevations['$elevation-02']};
	}

	${NavMenuContent} {
		opacity: 0;
		display: grid;
		grid-template-rows: auto min-content;
		transition: ${(props) =>
			props.transitionEnabled ? 'opacity ease-in-out var(--transition-duration-out)' : 'none'};
		height: 100%;
	}

	&.pinned ${NavMenuContent}, &.hovered ${NavMenuContent} {
		opacity: 1;
		transition-duration: ${(props) => (props.transitionEnabled ? ' var(--transition-duration-in)' : '0')};
	}
`;

type SpaceCreatorProps = { pinned: boolean; transitionEnabled: boolean };
const SpaceCreator = styled.div<SpaceCreatorProps>`
	--transition-duration-in: 0.25s;
	--transition-duration-out: 0.2s;

	flex: 0 0 auto;
	${(props) =>
		props.pinned
			? css<SpaceCreatorProps>`
					width: ${config.subNavigationWidth}px;
					transition: ${(props) =>
						props.transitionEnabled ? ' width ease-in-out var(--transition-duration-in)' : 'none'};
			  `
			: css<SpaceCreatorProps>`
					width: ${config.collapsedSubNavigationWidth}px;
					transition: ${(props) =>
						props.transitionEnabled ? ' width ease-in-out var(--transition-duration-out)' : 'none'};
			  `}
`;

const HoverBar = styled.div`
	display: flex;
	width: ${config.collapsedSubNavigationWidth}px;
	height: 100%;
	position: absolute;
	left: 0;
	top: 0;

	&::after {
		content: '';
		align-self: center;
		width: 4px;
		height: 24px;
		border-radius: 4px;
		margin-left: 16px;
		background-color: ${colors['$color-black-hex-16']};
		z-index: ${stackOrder.navMenu};
		pointer-events: none;
	}
`;

const Wrapper = styled.div`
	& ${StyledRoot}:hover ~ ${HoverBar}::after {
		background-color: ${colorBlueHex32};
	}

	@media print {
		display: none;
	}
`;

const RightToggle = styled.div`
	height: 100%;
	width: 100%;
	z-index: ${stackOrder.rightToggle};
	user-select: none;

	&:hover {
		cursor: pointer;
	}

	&:hover::after {
		border-color: #317ae2;
	}

	&::after {
		content: '';
		position: absolute;
		top: 0;
		left: 7px;
		bottom: 0;
		border-right: 2px solid transparent;
		transition: border-color 50ms ease 25ms;
	}
`;

const TooltipWrapper = styled.div<{ peeking: boolean }>`
	width: ${(props) => (props.peeking ? '16px' : '11px')};
	position: absolute;
	top: 0;
	right: ${(props) => (props.peeking ? '-8px' : '-3px')};
	bottom: 0;

	& > div {
		position: relative;
		float: right;
		width: 100%;
		height: 100%;
	}
`;

interface Props {
	children?: React.ReactNode;
	pinned?: boolean;
	menuKey?: string;
}

export const saveMenuUserSetting = (menuKey, menuState, user) => {
	if (!user) {
		return;
	}

	const saveMenu = Object.keys(menuState).map((key) => ({
		key,
		value:
			key === menuKey
				? menuState[key] === MenuState.PINNED
					? MenuState.HIDDEN
					: MenuState.PINNED
				: menuState[key],
	}));

	user.settings.save('froot_menu_state', saveMenu);
};

const showHoverBarCoachMark = (targetElement, iamClient, translator) => {
	return new iamClient.Coachmark({
		tag: 'secondary_menu_hover',
		parent: targetElement,
		content: translator.gettext('Hover here to temporarily show the submenu again'),
		appearance: {
			placement: 'right',
			zIndex: {
				min: 45,
			},
		},
		detached: true,
	});
};

const hoveredDebouncer = (
	pinned,
	{ setHovered, isHovered },
	{ contentHovered, rootHovered, rightToggleHovered },
	setRightToggleAvailable,
) => {
	const hovered = contentHovered || (isHovered && rootHovered) || (isHovered && rightToggleHovered);

	if (pinned) {
		setRightToggleAvailable(true);
	} else if (hovered) {
		setTimeout(() => setRightToggleAvailable(true), 375);
	} else {
		setTimeout(() => setRightToggleAvailable(false), 375);
	}

	const timer = setTimeout(() => {
		setHovered(hovered);
	}, 75);

	return () => clearTimeout(timer);
};

const handleNotPinned = (
	pinned,
	{ setHovered, hoverBarRef },
	{ setCoachMark, coachMark },
	showSecondaryMenuCoachmarksRef,
	{ iamClient, translator },
) => {
	if (!pinned) {
		setHovered(false);

		if (!coachMark && iamClient && hoverBarRef) {
			setTimeout(() => {
				if (showSecondaryMenuCoachmarksRef.current) {
					setCoachMark(showHoverBarCoachMark(hoverBarRef.current, iamClient, translator));
				}
			}, 2000);
		}
	}
};

const manageCoachmarks = (coachMark, isHovered, setCoachMark, pinned) => {
	if (coachMark) {
		if (isHovered) {
			coachMark.close();
			setCoachMark(null);
		} else if (pinned) {
			coachMark.remove();
			setCoachMark(null);
		}
	}
};

export function NavMenu({ pinned, children, menuKey }: Props) {
	const { metrics, iamClient } = useToolsContext();
	const [ref, rootHovered] = useHover();
	const [contentRef, contentHovered] = useHover();
	const [rightToggleRef, rightToggleHovered] = useHover();
	const [isHovered, setHovered] = useState(pinned);
	const [coachMark, setCoachMark] = useState(null);
	const didMountRef = useRef(false);
	const [transitionEnabled, setTransitionEnabled] = useState(true);
	const [rightToggleAvailable, setRightToggleAvailable] = useState(pinned);
	const hoverBarRef = useRef();
	const translator = useTranslator();
	const { user } = useUserDataContext();
	const { showSecondaryMenuCoachmarks, menuState } = useRootSelector((s) => s.navigation);
	const showSecondaryMenuCoachmarksRef = useRef(true);
	const dispatch = useDispatch();

	showSecondaryMenuCoachmarksRef.current = showSecondaryMenuCoachmarks;

	function handleCollapseClick() {
		metrics?.trackUsage(null, 'navigation_secondary_menu', 'toggled', {
			resolution: pinned ? 'hide' : 'show',
		});
		dispatch(togglePinned(menuKey));
		saveMenuUserSetting(menuKey, menuState, user);
	}

	useLayoutEffect(() => {
		if (didMountRef.current) {
			setTransitionEnabled(false);

			setTimeout(() => {
				setTransitionEnabled(true);
			}, 300);
		} else {
			didMountRef.current = true;
		}
	}, [menuKey]);

	useHotkeys(['[', ']'], handleCollapseClick, [menuKey]);

	useEffect(() => {
		return hoveredDebouncer(
			pinned,
			{ setHovered, isHovered },
			{ contentHovered, rootHovered, rightToggleHovered },
			setRightToggleAvailable,
		);
	}, [rootHovered, contentHovered, rightToggleHovered, pinned]);

	useEffect(() => {
		handleNotPinned(
			pinned,
			{ setHovered, hoverBarRef },
			{ coachMark, setCoachMark },
			showSecondaryMenuCoachmarksRef,
			{ iamClient, translator },
		);
	}, [pinned, iamClient]);

	useEffect(() => {
		manageCoachmarks(coachMark, isHovered, setCoachMark, pinned);
	}, [coachMark, isHovered, pinned]);

	useEffect(() => {
		return () => coachMark && coachMark.remove?.();
	}, [coachMark]);

	return (
		<Wrapper>
			<SpaceCreator transitionEnabled={transitionEnabled} pinned={pinned} />
			<StyledRoot
				className={classNames({ pinned, hovered: isHovered })}
				transitionEnabled={transitionEnabled}
				ref={ref}
				aria-label={translator.gettext('Secondary')}
			>
				<NavMenuContent ref={contentRef}>{children}</NavMenuContent>
				{(pinned || (isHovered && rightToggleAvailable)) && (
					<TooltipWrapper ref={rightToggleRef} peeking={isHovered && !pinned} onClick={handleCollapseClick}>
						<Tooltip
							content={<ToggleNavTooltipContent pinned={pinned} translator={translator} />}
							placement="initial"
							innerRefProp="ref"
							mouseEnterDelay={0.3}
							mouseLeaveDelay={0}
							style={{ zIndex: 300 }}
						>
							<RightToggle />
						</Tooltip>
					</TooltipWrapper>
				)}
			</StyledRoot>
			{!pinned && !isHovered && !rightToggleAvailable && <HoverBar ref={hoverBarRef} />}
		</Wrapper>
	);
}
