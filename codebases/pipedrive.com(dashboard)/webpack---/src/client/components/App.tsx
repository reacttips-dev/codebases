import React, { useEffect, useRef, useState } from 'react';
import { Router } from 'react-router-dom';
import Cookies from 'js-cookie';
import SVG from 'react-inlinesvg';
import styled from 'styled-components';

import iconsSVG from '@pipedrive/convention-ui-css/icons/svg-sprite/pipedrive-icon-defs.svg';
import '@pipedrive/convention-ui-css';
import '@pipedrive/convention-ui-css/dist/fonts/source-sans-pro.css';
// HACK: Temporary
import '../assets/overrides.css';

import Header from './Header/index';
import LinkClickListener from './LinkClickListener';
import { Navigation } from './Navigation';
import { GlobalStyle } from './GlobalStyle';
import { getActiveItem } from './menu/activeItem';
import { useRootSelector } from '../store';
import { useDispatch } from 'react-redux';
import { selectItem, setMenuState } from '../store/navigation/actions';
import { SubNavigation } from './SubNavigation';
import MainArea from './MainArea';
import GlobalMessages from './GlobalMessages';
import MenuKeyboardShortcuts from './MenuKeyboardShortcuts';
import useToolsContext from '../hooks/useToolsContext';
import useUserDataContext from '../hooks/useUserDataContext';
import { useHotkeysRoot } from '../hooks/useHotkeys';
import { useUIBlacklist } from '../hooks/useUIBlacklist';
import { MenuState } from './menu';
import { getNormalizedMenuState } from './menu/utils/getNormalizedMenuState';
import OnlineStatus from './OnlineStatus';

const AppContent = styled.div`
	position: absolute;
	display: flex;
	width: 100%;
	height: 100%;
	min-width: 1080px;
`;

const Content = styled.div<{ isDetachedContent: boolean }>`
	position: relative;
	overflow: ${(props) => (props.isDetachedContent ? 'auto' : 'hidden')};
	flex: 1;
	display: flex;

	@media print {
		overflow: visible;
		height: 100%;
	}
`;

const ContentWrapper = styled.div`
	overflow: hidden;
	flex: 1;
	display: grid;
	grid-template-rows: 56px calc(100% - 56px);
	grid-template-columns: 100%;

	@media print {
		overflow: visible;
		display: block;
	}
`;

function App() {
	const { router } = useToolsContext();
	const { items, rootUrl, activeItem, menuState, blacklist } = useRootSelector((s) => s.navigation);
	const [history, setHistory] = useState({
		location: router.history.location,
		action: router.history.action,
	});
	const { user } = useUserDataContext();
	const sidebarRef = useRef(null);
	const [isMenuStateLoaded, setIsMenuStateLoaded] = useState(false);
	const sessionCookie = Cookies.get('pipe-session-token');
	const dispatch = useDispatch();
	const updateMenus = (pathname) => {
		const { activeItem } = getActiveItem(items, pathname);

		if (activeItem) {
			router.updateBasePath(activeItem.path);
			dispatch(selectItem(activeItem));
		}
	};
	const currentPath = router.getCurrentPath();

	useEffect(() => {
		if (!user) {
			return;
		}

		const memoizedMenuState = user.settings.get('froot_menu_state');

		const normalizedMenuState = getNormalizedMenuState(menuState, memoizedMenuState);

		if (memoizedMenuState.length) {
			dispatch(setMenuState(normalizedMenuState));
		}

		const menuToMemoize = Object.entries(normalizedMenuState).map(([key, value]) => ({
			key,
			value,
		}));

		user.settings.save('froot_menu_state', menuToMemoize);

		if (!isMenuStateLoaded) {
			setIsMenuStateLoaded(true);
		}
	}, [user]);

	useEffect(() => {
		if (!sessionCookie) {
			window.location.href = window.app.config.login;

			return;
		}
	}, [sessionCookie]);

	useEffect(() => {
		updateMenus(router.history.location.pathname);
		setHistory({
			location: router.history.location,
			action: router.history.action,
		});

		router.history.listen((event) => {
			updateMenus(event.location.pathname);
			setHistory({
				location: event.location,
				action: event.action,
			});
		});
	}, []);

	useEffect(() => {
		const { pathname } = location;

		if (pathname === '/') {
			router.navigateTo(rootUrl, { replace: true });
		}
	}, [history.location, items]);

	useHotkeysRoot();
	useUIBlacklist({ currentPath, items, blacklist, dispatch });

	const selectedItem = activeItem?.parent || activeItem;
	const detached = menuState[selectedItem?.key] === MenuState.DETACHED;

	return (
		<Router navigator={router.history} action={history.action} location={history.location}>
			<AppContent>
				<GlobalStyle />
				<LinkClickListener />
				<SVG src={iconsSVG} style={{ display: 'none' }} />
				<GlobalMessages data-test="global-messages" />
				<Navigation />
				<ContentWrapper id="content-wrapper">
					<Header sidebarRef={sidebarRef} />
					<Content isDetachedContent={detached} id="main-content">
						{(isMenuStateLoaded || detached) && <SubNavigation data-test="secondary-menu" />}
						<MainArea />
						<div ref={sidebarRef} />
					</Content>
				</ContentWrapper>
				<OnlineStatus />
			</AppContent>
			<MenuKeyboardShortcuts />
		</Router>
	);
}

export default App;
