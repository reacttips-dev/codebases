import React from 'react';
import { Route as ReactRoute, RouteProps, matchPath } from 'react-router';
import { ComponentType, Service } from '../components/menu';
import ViewStackMicroFEComponent from '../components/ViewStackMicroFEComponent';
import ViewStackIFrameComponent from '../components/ViewStackIFrameComponent';
import ViewStackTabViewComponent from '../components/ViewStackTabViewComponent';
import ForbiddenPage from '../components/ForbiddenPage';
import ViewSelect from '../components/ViewSelect';

export interface CustomRoute extends RouteProps {
	viewStackKey?: string;
	otherPaths?: string[];
}

export const Route = (props: CustomRoute) => <ReactRoute {...props} />;

const shouldAppendPath = (route: string | string[], path): boolean => {
	const routes = Array.isArray(route) ? route : [route];
	const foundPathMatch = routes.some((current) => {
		return matchPath(current, path) !== null;
	});

	return !foundPathMatch;
};

export const parseMicroFEs = (componentLoader: ComponentLoader) => (service: Service) => {
	// Fix TS issue
	if (service.componentType !== ComponentType.microFE) {
		return;
	}

	const { key, routes, microFEComponent } = service;

	return {
		routes,
		component: (
			<Route
				key={key}
				viewStackKey={key}
				path={routes[0]}
				otherPaths={routes}
				element={
					<ViewStackMicroFEComponent componentName={microFEComponent} componentLoader={componentLoader} />
				}
			/>
		),
	};
};

export const parseIframes = (componentLoader: ComponentLoader) => (service: Service) => {
	// Fix TS issue
	if (service.componentType !== ComponentType.iframe) {
		return;
	}

	const { routes, key } = service;

	return {
		routes,
		component: (
			<Route
				key={key}
				viewStackKey={key}
				path={routes[0]}
				element={
					<ViewStackIFrameComponent
						componentProps={{ ...service, serviceKey: key }}
						componentLoader={componentLoader}
					/>
				}
			/>
		),
	};
};

export const parseTabComponents = (services: Service[], componentLoader: ComponentLoader) => {
	return Object.entries(services).reduce((acc, [key, service]) => {
		if (service.componentType === 'tabComponent') {
			const { routes } = service;
			const newRoutes = [];

			if (service.tab.componentType) {
				newRoutes.push(...routes);
			}

			if (acc.findIndex((el) => el.group === service.tab.group) !== -1) {
				return acc;
			}

			const tabs = Object.entries(services).reduce((groups, [, item]) => {
				if (
					item.componentType === 'tabComponent' &&
					(item.tab.group === service.tab.group || item.tab.group?.key === service.tab.group?.key)
				) {
					const pageTitle = item.tab.pageTitle || item.tab.title;

					groups.push({
						...item,
						routes: item.routes,
						path: item.path,
						tab: {
							...item.tab,
							pageTitle,
						},
						index: item.tab.index,
					});

					if (item.key !== service.key && item.tab.componentType) {
						newRoutes.push(...item.routes);
					}
				}

				return groups;
			}, []);

			acc.push({
				group: service.tab.group,
				routes: newRoutes,
				component: (
					<Route
						key={key}
						viewStackKey={key}
						path={newRoutes[0]}
						otherPaths={newRoutes}
						element={
							<ViewStackTabViewComponent
								tabs={tabs}
								componentProps={{ ...service, serviceKey: key }}
								componentLoader={componentLoader}
							/>
						}
					/>
				),
			});
		}
		return acc;
	}, []);
};

const fixRoutes = (componentType: string, route: string | string[], path: string) => {
	const routes = [];

	if (
		componentType !== ComponentType.iframe &&
		((path && !route) || (path && route && shouldAppendPath(route, path)))
	) {
		routes.push(path);
	}

	if (route) {
		if (Array.isArray(route)) {
			routes.push(...route);
		} else {
			routes.push(route);
		}
	}

	return routes;
};

export const parseServices = (services: Service[], componentLoader: ComponentLoader) => () => {
	const parsedServices = services.map((service) => ({
		...service,
		routes:
			service.componentType === ComponentType.juraComponent
				? ['']
				: fixRoutes(service.componentType, service.route || '', service.path),
	}));
	const microFEs = parsedServices.filter(
		(service) => service.componentType === ComponentType.microFE && service.routes.length > 0,
	);
	const iframes = parsedServices.filter(
		(service) => service.componentType === ComponentType.iframe && !service.skipFroot && service.routes.length > 0,
	);
	const tabComponents = parsedServices.filter(
		(service) => service.componentType === ComponentType.tabComponent && service.routes.length > 0,
	);
	const webappComponents = parsedServices.filter(
		(service) => service.componentType === ComponentType.webapp && service.routes.length > 0,
	);

	const parsedMicroFEs = microFEs.map(parseMicroFEs(componentLoader));
	const parsedIframes = iframes.map(parseIframes(componentLoader));
	const parsedTabComponents = parseTabComponents(tabComponents, componentLoader);

	return {
		parsedMicroFEs,
		parsedIframes,
		parsedTabComponents,
		parsedWebappComponents: webappComponents,
	};
};

export const getHiddenPaths = (hiddenPaths) => () => {
	return hiddenPaths.map((path) => (
		<Route viewStackKey="forbidden" path={path} key={path} element={<ForbiddenPage />} />
	));
};

export const getViewSelects = (viewSelects) => () => {
	return viewSelects.map(({ name, defaultRoute, routes }) => (
		<Route key={name} path={defaultRoute} element={<ViewSelect view={name} routes={routes} />} />
	));
};
