import { Menus, MenuItem, MenuLink } from './index';
import Logger from '@pipedrive/logger-fe';

const logger = new Logger('froot', 'activeItem');

function pathMatches(path, pathName, checkForRegex) {
	return checkForRegex ? new RegExp(path).test(pathName) : pathName.startsWith(path);
}

function findActiveItem(items: MenuItem[], pathName: string, checkForRegex?: boolean) {
	const isActiveOnPath = (path) => {
		if (typeof path === 'string') {
			return pathMatches(path, pathName, checkForRegex);
		}

		if (path && typeof path === 'object' && typeof path.test === 'function') {
			return path.test(pathName);
		}

		logger.logError(
			new Error('Path is not a string nor regular expression'),
			'Path is not a string nor regular expression',
			'error',
			{ path },
		);
	};

	for (const item of items) {
		if (item.type !== 'link' || !item.path) {
			continue;
		}

		if (pathName === item.path) {
			return item;
		}

		if (item.activeOnPaths?.some(isActiveOnPath)) {
			return item;
		}
	}
}

export function getActiveItem(menu: Menus, pathName: string): { activeItem: MenuLink } {
	if (!pathName) {
		return { activeItem: null };
	}

	const keys = Object.keys(menu);

	for (const key of keys) {
		const items: Array<MenuItem> = menu[key];

		for (const item of items) {
			if (item.type !== 'link' || !item.submenu) {
				continue;
			}

			const activeItem = findActiveItem(item.submenu, pathName, true);

			if (activeItem) {
				return { activeItem };
			}
		}

		const activeItem = findActiveItem(items, pathName);

		if (activeItem) {
			return { activeItem };
		}
	}

	return { activeItem: null };
}

export function isItemActive(item: MenuLink, activeItem: MenuLink) {
	if (!activeItem) {
		return false;
	}

	if (activeItem.key === item.key) {
		return true;
	}

	return activeItem.parent?.key === item.key;
}
