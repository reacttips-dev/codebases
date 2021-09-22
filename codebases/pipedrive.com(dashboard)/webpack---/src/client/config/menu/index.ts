import { Menus, MenuLink, MenuState, Service, MenuItem } from '../../components/menu';
import ThirdPartyLinks from '../../components/menu/ThirdPartyLinks';

const components = { ThirdPartyLinks };

function addParentsAndTypesAndServices(items, services: Service[], parent?: MenuLink) {
	return items.reduce((acc, item) => {
		if (item.service) {
			const service = services.find((service) => service.key === item.service);

			if (service) {
				Object.assign(item, { ...service, ...item });
			} else {
				return acc;
			}
		}

		if (item.type === 'component') {
			item.component = components[item.componentName];
		}

		if (!('type' in item)) {
			item.type = 'link';
		}

		if (item.type === 'link' && parent) {
			item.parent = parent;
		}

		if (item.type === 'link' && item.submenu) {
			item.submenu = addParentsAndTypesAndServices(item.submenu, services, item);
			if (item.submenuFooter) {
				item.submenuFooter = addParentsAndTypesAndServices(item.submenuFooter, services, item);
			}
		}

		acc.push(item);

		return acc;
	}, []);
}

export function getInitialMenuState(menu: Menus) {
	let menuState = menu.primary
		.filter((item) => item.type === 'link')
		.reduce((result, item) => {
			result[item.key] = MenuState.PINNED;

			return result;
		}, {});

	menuState = menu.detached.reduce((result, item) => {
		result[item.key] = MenuState.DETACHED;

		return result;
	}, menuState);

	return menuState;
}

function buildSettingsMenu(items: Menus) {
	const result: MenuItem[] = [];

	const settings = items.detached.find((m) => m.key === 'settings');

	if (settings) {
		result.push(settings);
	}

	const tools = items.detached.find((m) => m.key === 'tools_and_apps');

	if (tools) {
		result.push(tools);
	}

	const account = items.secondary?.find((m) => m.key === 'account') as MenuLink;
	const workflow = account?.submenu.find((m) => m.key === 'workflow_automation');

	if (workflow) {
		result.push(workflow);
	}

	const billing = account?.submenu.find((m) => m.key === 'billing_fe') as MenuLink;

	if (billing) {
		result.push(billing);
	}

	return result;
}

export function buildMenu(menus, services: Service[]): Menus {
	const enhancedMenus = Object.entries(menus).reduce<Menus>((acc, [key, menuItems]) => {
		acc[key] = addParentsAndTypesAndServices(menuItems, services);

		return acc;
	}, {});

	// NOTE: This should either be removed or come directly from menu-waitress. See FUN-1281
	enhancedMenus.settings = buildSettingsMenu(enhancedMenus);

	return enhancedMenus;
}
