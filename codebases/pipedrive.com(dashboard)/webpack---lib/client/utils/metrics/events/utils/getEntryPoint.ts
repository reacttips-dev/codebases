import { EntryPoint } from 'Utils/EntryPoint';

const entryPointsMap: { readonly [K in EntryPoint]: string } = {
	[EntryPoint.LeadsList]: 'leads_list',
	[EntryPoint.LeadDetails]: 'lead_details',
	[EntryPoint.LeadDetailsMenu]: 'lead_details_menu',
};

export const getEntryPoint = (entryPoint: EntryPoint) => {
	return entryPointsMap[entryPoint];
};
