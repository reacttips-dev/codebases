import { API, ComponentLoader, FrootRouter, CompanyUsersAttributes, UserSelf, Field } from '@pipedrive/types';

export type DeepPartial<T> = {
	[P in keyof T]?: DeepPartial<T[P]>;
};

export interface CompoundField {
	value: string;
	label: string;
}

export interface AddressGmaps {
	description: string;
}

export type UpcomingActivity = {
	type: string;
	dueDate: string;
	dueTime: string | null;
} | null;

export interface WebappCustomFieldsValues {
	[key: string]: undefined | string | number | number[] | CompoundField | CompoundField[];
}

export interface OrganizationCreate {
	name: string;
	owner_id?: number;
	visible_to?: number;
	address?: string;
}

export interface Organization extends OrganizationCreate, WebappCustomFieldsValues {
	id: number;
}

export interface PersonCreate {
	name: string;
	owner_id?: number;
	org_id?: number;
	visible_to?: number;
	phone?: CompoundField[];
	email?: CompoundField[];
}

export interface Person extends Required<PersonCreate>, WebappCustomFieldsValues {
	id: number;
}

export interface Response<T> {
	success: boolean;
	statusCode: number;
	additional_data: {
		more_items_in_collection: boolean;
		total_count?: number;
	};
	data: T;
}

export interface Currency {
	active_flag: boolean;
	code: string;
	decimal_points: number;
	id: number;
	is_custom_flag: boolean;
	name: string;
	symbol: string;
}
type ContextualViewOpenProps = {
	componentName: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	componentOptions: any;
	onClose: () => void;
	onNext: (() => void) | boolean;
	onPrevious: (() => void) | boolean;
	hideFeedbackForm?: boolean;
	hasSidebar?: boolean;
};

export type ContextualView = {
	open: (props: ContextualViewOpenProps) => void;
	close: () => void;
};
export interface WebappApiContextInterface {
	readonly currencies: Currency[];
	readonly advancedPermissions: boolean;
	readonly teamsFeature: boolean;
	readonly userNamesFromIds: Record<string, Backbone.Model<CompanyUsersAttributes> | undefined>;
	readonly router: FrootRouter;
	readonly isUserAdmin: boolean;
	readonly leadDefaultVisibility: number;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	readonly customActivityTypesMapping: any;
	readonly isLeadboosterEnabled: boolean;
	readonly canChangeVisibility: boolean;
	readonly canDeleteActivities: boolean;
	readonly trackUsage: (
		view: string,
		component: string,
		eventAction: string,
		eventData: Record<string, unknown>,
	) => void;
	readonly isLiveChatEnabled: boolean;
	readonly isProspectorEnabled: boolean;
	readonly isWorkflowAutomationEnabled: boolean;
	readonly isMenuWaitressSidebarPinned: boolean;
	readonly isLeadsInboxActiveUser: boolean;
	readonly componentLoader: ComponentLoader;
	readonly userSelf: UserSelf;
	readonly permissions: {
		readonly canUseImport: boolean;
		readonly canUseExport: boolean;
	};
	readonly contextualView: ContextualView;
	readonly createEmptyFiltersCollection: API['createEmptyFiltersCollection'];
	readonly modelCollectionFactory: any; // eslint-disable-line @typescript-eslint/no-explicit-any
	readonly fields: { lead: Field[]; person: Field[]; organization: Field[] };
	readonly locale: string;
}

export enum LabelColors {
	Blue = 'blue',
	Red = 'red',
	Green = 'green',
	Purple = 'purple',
	Yellow = 'yellow',
	Gray = 'gray',
}

export type LabelId = string;

export interface PersonDuplicate {
	details: {
		phone: string | null;
		email: string | null;
		org_id: number | null;
		org_name: string | null;
	};
	id: number;
	title: string;
	type: 'person';
}

export interface OrgDuplicate {
	details: {
		org_address: string;
	};
	id: number;
	title: string;
	type: 'organization';
}

export type Duplicate = PersonDuplicate | OrgDuplicate;

export type CustomActivityTypesMapping = {
	[activityType: string]: string;
};

export type SocketActivity = {
	id: number;
	subject: string;
	note: string;
	lead_id: string | null;
	type: string;
	user_id: number | null;
	due_date: string;
	due_time: string | null;
	done: boolean;
	add_time: string;
	update_time: string;
};

export type SocketEvent<T = Record<string, unknown>> = {
	_meta: Record<string, unknown>;
	message: string;
	alert_type: string;
	alert_action: string;
	related_objects: Record<string, unknown>;
	current: T | null;
	previous: T | null;
};

export type FrootRouterEvent = {
	path: string;
};

export type LeadFilterStatus = 'ALL' | 'ARCHIVED';

export enum ConvertEntity {
	SingleDeal = 'SingleDeal',
	DealList = 'DealList',
	Filter = 'Filter',
}

export type FilterByOptions = {
	filterId?: number;
	userId?: number;
	everyone?: boolean;
};

export interface ListViewRef {
	scrollToItem: (index: number) => void;
}

export const UserTypeName = 'User';

export const TeamTypeName = 'Team';
