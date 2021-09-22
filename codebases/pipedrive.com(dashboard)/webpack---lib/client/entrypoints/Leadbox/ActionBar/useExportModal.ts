import { ContextType, useContext } from 'react';
import { fromGlobalId, isTypeOf } from '@adeira/graphql-global-id';
import { LeadboxFiltersContext } from 'Leadbox/LeadboxFiltersContext';
import { WebappApiContext } from 'Components/WebappApiContext';
import { useIsArchivedRoute } from 'Hooks/useRoutes';
import { TeamTypeName, UserTypeName } from 'Types/types';
import { useListContext } from 'Leadbox/LeadsListView/context/ListProvider';

type ExportListModalParams = {
	collection: {
		type: 'lead';
		options: {
			filter: {
				filter_id?: number;
				user_id?: number;
				team_id?: number;
			};
		};
	};
	summary: {
		total: number;
	};
	extraParams: {
		labels?: string;
		source?: string;
		archived: boolean;
	};
};

export const getExportModalParams = (
	totalCount: number,
	inboxFilters: ContextType<typeof LeadboxFiltersContext>,
	archived: boolean,
): ExportListModalParams => {
	const filter = inboxFilters.get.filter;

	return {
		collection: {
			type: 'lead',
			options: {
				filter: {
					filter_id: filter.filter ? Number(fromGlobalId(filter.filter)) : undefined,
					user_id:
						filter.owner && isTypeOf(UserTypeName, filter.owner)
							? Number(fromGlobalId(filter.owner))
							: undefined,
					team_id:
						filter.owner && isTypeOf(TeamTypeName, filter.owner)
							? Number(fromGlobalId(filter.owner))
							: undefined,
				},
			},
		},
		summary: { total: totalCount },
		extraParams: {
			labels: filter.labels.map((label) => fromGlobalId(label)).join(','),
			source: filter.sources.map((source) => fromGlobalId(source)).join(','),
			archived,
		},
	};
};

export const useExportModal = () => {
	const inboxFilters = useContext(LeadboxFiltersContext);
	const { selectedRows } = useListContext();
	const { componentLoader } = useContext(WebappApiContext);
	const archived = useIsArchivedRoute();

	const totalCount = selectedRows.totalLeads;

	const onExportClick = async () => {
		const modals = await componentLoader.load('froot:modals');
		modals.open('webapp:modal', {
			modal: 'export/list-export-modal',
			params: getExportModalParams(totalCount, inboxFilters, archived),
		});
	};

	return onExportClick;
};
