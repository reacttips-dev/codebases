import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import useUserDataContext from '../hooks/useUserDataContext';
import useToolsContext from '../hooks/useToolsContext';

import Loading from './Loading';

export type ViewSelectDefinition = {
	name: string;
	defaultRoute: string;
	routes: string[];
};

function getViewModePath(user: any, view: string, routes: string[]) {
	if (!routes) {
		throw new Error("ViewSelect can't be used without defining its routes.");
	}

	const viewPath = user.settings.get(`${view}_view_mode`);

	return routes.find((path) => path === viewPath) || routes[0];
}

export function saveViewMode(user: any, viewPaths: ViewSelectDefinition[], currentPath: string) {
	viewPaths.forEach(({ name, routes }) => {
		routes.forEach((path) => {
			if (currentPath.includes(path)) {
				user.settings.saveViewModeToUserSettings(name, path);
			}
		});
	});
}

function ViewSelect({ view, routes }: { view: string; routes: string[] }) {
	const { user } = useUserDataContext();
	const { router } = useToolsContext();
	const { hash, search } = useLocation();

	useEffect(() => {
		if (user) {
			const viewPath = getViewModePath(user, view, routes);

			if (viewPath) {
				router.navigateTo(viewPath + search + hash, { replace: true });
			}
		}
	}, [user]);

	return <Loading />;
}

export default ViewSelect;
