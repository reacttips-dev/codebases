import React, { useEffect, Ref, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Logger from '@pipedrive/logger-fe';

import useToolsContext from '../hooks/useToolsContext';
import useUserDataContext from '../hooks/useUserDataContext';
import { useRootSelector } from '../store';
import config from '../config/styles';

import Routes from './ViewStackRoutes';
import Loading from './Loading';
import { saveViewMode } from './ViewSelect';
import { MenuState } from './menu';
import PersistentProgressbar from './PersistentProgressbar';
import { get } from '../utils/localStorage';
import {
	extendWithSearchAndHash,
	getMatchingRedirect,
	getRedirectedUrl,
	logRedirect,
} from '../components/navigation/helpers/redirects';
import { getHiddenPaths, getViewSelects, parseServices, Route } from '../utils/routesBuilder';
import WebappComponent from './WebappComponent';
import NotFoundPage from './NotFound';

const logger = new Logger('froot', 'mainArea');

const Wrapper = styled.div<{ visible: boolean }>`
	flex: 1 1 auto;
	width: 100%;
	height: 100%;
	display: ${(props) => (props.visible ? 'flex' : 'none')};
`;

const getPanelWidth = ({ hasSubMenu, isMenuPinned, isMenuDetached, hasSettingsBar }: FullPanelProps): string => {
	/*
	Main area min-width:
	- no submenu: 100% − 56px
	- detached submenu: fixed based on breakpoints
	- submenu exists, collapsed: 100% − 56px − 24px
	- submenu exists, not collapsed: 100% − 56px − 240px
	- settings submenu: 100% - 56px - 144px
	*/

	if (!hasSubMenu) {
		return `min-width: calc(100% - ${config.navBarWidth}px - ${config.subNavigationWidth}px)`;
	}

	if (isMenuDetached) {
		return `
			max-width: ${config.detachedContentWidth.fallback}px;
			@media only screen and (min-width: ${config.breakpoints.m}px) {
				max-width: ${config.detachedContentWidth.m}px;
			}

			@media only screen and (min-width: ${config.breakpoints.l}px) {
				max-width: ${config.detachedContentWidth.l}px;
			}
		`;
	}

	if (isMenuPinned) {
		return `min-width: calc(100% - ${config.navBarWidth}px - ${config.subNavigationWidth}px)`;
	}

	if (hasSettingsBar) {
		return `min-width: calc(100% - ${config.navBarWidth}px - ${config.settingsBarWidth}px)`;
	}

	return `min-width: calc(100% - ${config.navBarWidth}px - ${config.collapsedSubNavigationWidth}px)`;
};

type FullPanelProps = {
	isMenuPinned: boolean;
	isMenuDetached: boolean;
	hasSubMenu: boolean;
	hasSettingsBar: boolean;
	verticalOverflow: boolean;
};
const FullPanel = styled.main<FullPanelProps>`
	position: relative;
	display: flex;
	flex: 1;
	${(props) => getPanelWidth({ ...props })};
	overflow-y: ${(props) => props.verticalOverflow && 'auto'};
`;

const hashChange = (frootModals) => ({ hash, trackingData: data }) => {
	if (hash.includes('#dialog/close')) {
		// Close
		frootModals?.current?.close();
	} else if (hash.includes('#dialog')) {
		const dialog = hash.match(/#dialog\/(.*)$/);
		// Check if dialog exist
		frootModals?.current?.open('webapp:modal', {
			modal: dialog?.[1],
			params: {
				...data,
			},
		});
	}
};

const loadHashChange = async (frootModals, componentLoader, router) => {
	const hashChangeFunction = hashChange(frootModals);
	if (!frootModals?.current) {
		frootModals.current = await componentLoader.load('froot:modals');
	}

	router.on('hashChange', hashChangeFunction);
};

function MainArea(props, ref: Ref<HTMLDivElement>) {
	const bulkAction = get('bulk-action');
	const { componentLoader, router } = useToolsContext();
	const { pathname, search, hash } = useLocation();
	const frootModals = useRef(null);
	const { user } = useUserDataContext();
	const {
		menuState,
		activeItem,
		hasRegisteredAllExternals,
		items,
		viewLoading: loading,
		services,
		hiddenPaths: rawHiddenPaths,
		redirects,
		viewSelects: rawViewSelects,
	} = useRootSelector((s) => s.navigation);
	const { settings } = items;

	const { parsedMicroFEs, parsedIframes, parsedTabComponents, parsedWebappComponents } = useMemo(
		parseServices(services, componentLoader),
		[],
	);
	useEffect(() => {
		loadHashChange(frootModals, componentLoader, router);

		return () => {
			router.off('hashChange', hashChange(frootModals));
		};
	}, []);
	useEffect(() => {
		const routeChange = () => {
			frootModals?.current?.close('webapp');
		};

		router.on('routeChange', routeChange);

		return () => {
			router.off('routeChange', routeChange);
		};
	}, []);
	const webappRoutes = [...parsedWebappComponents.flatMap((item) => item.routes)];
	const hiddenPaths = useMemo(getHiddenPaths(rawHiddenPaths), []);
	const parsedViewSelects = useMemo(getViewSelects(rawViewSelects), []);
	const activeNavBarItem = activeItem?.parent || activeItem;
	const menuPinned = menuState[activeNavBarItem?.key] === MenuState.PINNED;
	const menuDetached = menuState[activeNavBarItem?.key] === MenuState.DETACHED;
	const hasSettingsBar = !!settings?.find(
		(item) => item.key === activeItem?.key || item.key === activeNavBarItem?.key,
	);

	useEffect(() => {
		if (user) {
			saveViewMode(user, rawViewSelects, pathname);
		}
	}, [pathname, user]);

	useEffect(() => {
		const currentUrl = pathname + search + hash;
		const firstMatchingRedirect = getMatchingRedirect(redirects, currentUrl);

		if (firstMatchingRedirect) {
			const redirectTo = getRedirectedUrl(firstMatchingRedirect, currentUrl);
			const redirectWithSearchAndHash = extendWithSearchAndHash(redirectTo, search, hash);
			const newSearch = new URL(`${window.location.origin}${redirectWithSearchAndHash}`).search;

			logRedirect(logger, currentUrl, redirectWithSearchAndHash);
			router.navigateTo(redirectWithSearchAndHash, { replace: true, search: newSearch });
		}
	}, [pathname, search, hash]);

	if (!hasRegisteredAllExternals) {
		return (
			<FullPanel
				isMenuPinned={menuPinned}
				isMenuDetached={menuDetached}
				hasSubMenu={!!activeItem?.parent?.submenu}
				hasSettingsBar={hasSettingsBar}
				verticalOverflow={false}
			>
				<Loading />
			</FullPanel>
		);
	}

	/* Micro frontend component is hidden while loading */
	return (
		<FullPanel
			isMenuPinned={menuPinned}
			isMenuDetached={menuDetached}
			hasSubMenu={!!activeItem?.parent?.submenu}
			hasSettingsBar={hasSettingsBar}
			verticalOverflow={pathname.includes('/insights')}
			data-test="main-area"
		>
			{loading && <Loading />}
			<Wrapper visible={!loading} data-neat="main-area">
				<Routes>
					{hiddenPaths}
					{parsedMicroFEs.map((item) => item.component)}
					{parsedViewSelects}
					{parsedIframes.map((item) => item.component)}
					{parsedTabComponents.map((item) => item.component)}
					<Route
						viewStackKey="webapp-new"
						path={webappRoutes?.[0]}
						otherPaths={webappRoutes}
						element={<WebappComponent components={parsedWebappComponents} />}
					/>
					<Route viewStackKey="404" path="/*" element={<NotFoundPage />} />
				</Routes>
			</Wrapper>
			<PersistentProgressbar bulkAction={bulkAction} />
			<div ref={ref} />
			<div id="modal-container" />
			{/* this selector is expected by neat and is rendered in webapp, which is no longer rendered at all times */}
			<div id="application" style={{ display: 'none' }} />
		</FullPanel>
	);
}

export default React.forwardRef(MainArea);
