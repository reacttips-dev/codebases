export interface MenuDivider {
	type: 'divider';
	key?: string;
	title?: string;
	conditions?: string[];
	coachmark?: MenuCoachmark;
}

export interface MenuTitle {
	type: 'title';
	key?: string;
	title: string;
	coachmark?: MenuCoachmark;
	props?: object;
}

export interface MenuLinkPill {
	size?: 's';
	color?: 'green' | 'blue' | 'red' | 'yellow' | 'purple' | 'white';
	outline?: boolean;
	value?: any;
	countKey?: string;
}
export interface MenuCoachmark {
	tag: string;
	content: string;
	actions?: [
		{
			label: string;
			handler: 'close' | 'goto';
		},
	];
	appearance?: any;
}

type StringOrRexExp = string | RegExp;

export enum ActionTypes {
	MODAL = 'modal',
}

export interface ModalAction {
	type: ActionTypes.MODAL;
	component: string;
	options?: object;
}

export type Action = ModalAction;

export interface MenuLink {
	type?: 'link';
	key?: string;
	parent?: MenuLink;
	title?: string;
	icon?: string;
	customIcon?: object;
	path?: string;
	action?: Action;
	featureFlag?: string;
	conditions?: string[];
	activeOnPaths?: StringOrRexExp[];
	target?: '_blank' | '_self' | '_parent' | '_top';
	submenu?: MenuItem[];
	submenuFooter?: MenuFooter[];
	disabled?: boolean;
	pill?: MenuLinkPill;
	badge?: string;
	coachmark?: MenuCoachmark;
	warning?: boolean;
	keyboardShortcut?: string;
	service?: string;
}

export interface MenuComponent {
	type: 'component';
	key?: string;
	component: React.ComponentType;
	componentName?: string;
	coachmark?: MenuCoachmark;
}

export interface MenuFooter {
	key: string;
	service: string;
	type: 'subMenuFooter';
	componentType: ComponentType.microFE;
	microFEComponent: string;
}

export interface MenuLogo {
	type: 'logo';
	path?: string;
	key?: string;
	icon?: string;
	coachmark?: MenuCoachmark;
}

export type MenuItem = MenuDivider | MenuTitle | MenuLink | MenuComponent | MenuLogo;

interface BaseService {
	key: string;
	path: string;
	routes?: string[];
}

export enum ComponentType {
	microFE = 'microFE',
	juraComponent = 'jura_component',
	iframe = 'iframe',
	tabComponent = 'tabComponent',
	webapp = 'webapp',
}

export interface MicroFEService extends BaseService {
	componentType: ComponentType.microFE;
	microFEComponent: string;
	route: string[] | string;
}

export interface JuraService extends BaseService {
	componentType: ComponentType.juraComponent;
	juraComponent: string;
}

export interface InjectParams {
	params?: string[];
	hash?: string;
}
export interface IframeService extends BaseService {
	skipFroot: boolean;
	componentType: ComponentType.iframe;
	serviceUrl: string;
	readyMessage: string;
	route: string[] | string;
	pageTitle?: string;
	inject?: InjectParams;
}

export interface Tab extends BaseService {
	index: number;
	group: {
		key: string;
		title?: string;
		titleComponent?: any;
	};
	title?: string;
	pageTitle?: string;
	componentType?: ComponentType.iframe | ComponentType.microFE;
}

export interface TabService extends BaseService {
	componentType: ComponentType.tabComponent;
	tab: Tab;
	route: string[] | string;
}

export interface WebappService extends BaseService {
	componentType: ComponentType.webapp;
	route: string[];
	function: string;
}

export type Service = MicroFEService | JuraService | IframeService | TabService | WebappService;

export interface Menus {
	primary?: MenuItem[];
	secondary?: MenuItem[];
	more?: MenuItem[];
	detached?: MenuItem[];
	settings?: MenuItem[];
}

export enum MenuState {
	DETACHED = 'detached',
	PINNED = 'pinned',
	HIDDEN = 'hidden',
}

export interface MenuStateLocal {
	[key: string]: MenuState;
}

export interface MenuStateUserSetting {
	key: string;
	value: MenuState;
}
