export enum CappingServices {
	REPORTS = 'reports',
	DEALS = 'deals',
	CUSTOM_FIELDS = 'custom_fields',
}

export enum Tiers {
	DIAMOND = 'diamond',
	GOLD = 'gold',
	PLATINUM = 'platinum',
	SILVER = 'silver',
}

export interface CappingEndpointReturn {
	cap: number;
	usage: number;
}
