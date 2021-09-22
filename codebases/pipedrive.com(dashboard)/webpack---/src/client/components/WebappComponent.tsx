import React, { useEffect, useState, useRef, MutableRefObject } from 'react';
import useToolsContext from '../hooks/useToolsContext';
import Logger from '@pipedrive/logger-fe';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import type { View } from 'backbone';

import { setViewLoading } from '../store/navigation/actions';
import ErrorBoundary from '../tools/ErrorBoundary';
import useViewStackVisibleContext from '../hooks/useViewStackVisibleContext';

import DevErrorPage from './DevErrorPage';
import { matchPath, useLocation } from 'react-router';
import { Service, WebappService } from './menu';
import useUserDataContext from '../hooks/useUserDataContext';
import useComponentLoader from '../hooks/useComponentLoader';
import { useDebouncedState } from '../hooks/useDebouncedState';

const logger = new Logger('froot', 'webapp');

interface Props {
	components: Service[];
}

export const WebappContainer = styled.div<{ visible: boolean }>`
	display: ${({ visible }) => (visible ? 'flex' : 'none')};
	height: 100%;
	width: 100%;
	position: relative;

	#applicationContainer,
	#application {
		display: flex;
		flex: 0 auto;
		width: 100%;
	}
`;

const findRoute = (components) => {
	const route = components.find((component) => {
		const foundRoute = component.routes.find((route) => matchPath(route, location.pathname));

		return foundRoute;
	});
	let params = {};

	if (route) {
		route.routes.forEach((route) => {
			const matches = matchPath(route, location.pathname);

			if (matches) {
				params = matches.params;
			}
		});
	}

	return { route, params };
};

const updateRoute = async ({ webapp, currentFunction, currentProps, route, props, setLoading, setError }) => {
	currentFunction.current = route.function;
	currentProps.current = props;

	setError(null);
	setLoading(true);

	await webapp.current.AppRouter[route.function](...props).catch(async (err) => {
		logger.logError(err, `Could not load webapp component ${route.function}`);
		setError(err);
		setLoading(false);
	});
	setLoading(false);
	webapp.current.AppRouter.setLastRoute(route.function);
};

const getRouteAndProps = ({ components }) => {
	const { route, params } = findRoute(components) as { route: WebappService; params: any };
	const props = Object.keys(params).map((param) => params[param]);

	return { route, props };
};

const load = async ({ webapp, componentLoader, currentFunction, currentProps, setError, components, setLoading }) => {
	try {
		webapp.current = await componentLoader.load('webapp:main');

		const { route, props } = getRouteAndProps({ components });

		webapp.current.AppRouter.initialize();
		webapp.current.AppRouter.setLastRoute(route.function); // First init needed
		updateRoute({ webapp, currentFunction, currentProps, route, props, setLoading, setError });
	} catch (err) {
		logger.logError(err, 'Could not load webapp');

		setError(err);
	} finally {
		setLoading(false);
	}
};

type useLocationChangeProps = {
	webapp: MutableRefObject<Webapp>;
	currentFunction: MutableRefObject<string>;
	currentProps: MutableRefObject<object>;
	components: any;
	router: any;
	setLoading: (loading: boolean) => void;
	setError: (error: any) => void;
};
const useLocationChange = (
	visible,
	location,
	{ webapp, currentFunction, currentProps, components, setLoading, setError, router }: useLocationChangeProps,
) => {
	useEffect(() => {
		if (!webapp.current) {
			return;
		}

		if (visible) {
			const { route, props } = getRouteAndProps({ components });
			if (router.isCurrentPathSilent()) {
				return;
			}

			if (
				route &&
				(currentFunction.current !== route.function ||
					JSON.stringify(props) !== JSON.stringify(currentProps.current))
			) {
				updateRoute({ webapp, currentFunction, currentProps, route, props, setLoading, setError });

				return;
			}
		}

		webapp.current.AppRouter.setLastRoute('froot');
	}, [location, visible, webapp?.current]);

	// webapp lifecycle methods are not called when we hide/show webapp
	// so we need to call them manually for the current view
	useEffect(() => {
		if (!webapp.current) {
			return;
		}

		const triggerEventHandler = (handler: 'blur' | 'focus') => {
			const { currentView } = webapp.current.AppRouter;

			if (currentView && typeof currentView[handler] === 'function') {
				currentView[handler]();
			}
		};

		if (visible) {
			triggerEventHandler('focus');
		} else {
			triggerEventHandler('blur');
		}
	}, [visible]);
};

const Error = ({ error }) => {
	const { configuration } = useUserDataContext();
	const { componentLoader } = useToolsContext();
	const [ErrorPage] = useComponentLoader('froot:ErrorPage', componentLoader);

	if (error && ErrorPage) {
		const response = error?.response ?? {};
		const { meta, errors } = response;

		return configuration.ENV === 'dev' ? <DevErrorPage meta={meta} errors={errors} /> : <ErrorPage />;
	}

	return null;
};

interface WebappBackboneView extends View {
	onBlur?: () => void;
	onFocus?: () => void;
}
type Webapp = {
	AppRouter: {
		lastRoute: string;
		setLastRoute: (lastRoute: string) => void;
		currentView?: WebappBackboneView;
		[key: string]: any;
	};
};
const WebappComponent = ({ components }: Props) => {
	const { componentLoader, router } = useToolsContext();
	const visible = useDebouncedState(useViewStackVisibleContext());
	const webapp = useRef<Webapp>(null);
	const [error, setError] = useState(null);
	const dispatch = useDispatch();
	const location = useLocation();
	const currentFunction = useRef<string>(null);
	const currentProps = useRef<object>(null);
	const setLoading = (isLoading: boolean) => {
		dispatch(setViewLoading(isLoading));
	};

	useEffect(() => {
		setLoading(true);
		load({
			webapp,
			componentLoader,
			currentFunction,
			currentProps,
			components,
			setError,
			setLoading,
		});
	}, [components]);

	useLocationChange(visible, location, {
		webapp,
		currentFunction,
		currentProps,
		components,
		router,
		setLoading,
		setError,
	});

	return (
		<>
			<Error error={error} />
			<ErrorBoundary componentName="webapp">
				<WebappContainer visible={!error}>
					<div id="sales-phone-dialler" />
					<div id="applicationContainer">
						<div id="application" />
					</div>
				</WebappContainer>
			</ErrorBoundary>
		</>
	);
};

export default WebappComponent;
