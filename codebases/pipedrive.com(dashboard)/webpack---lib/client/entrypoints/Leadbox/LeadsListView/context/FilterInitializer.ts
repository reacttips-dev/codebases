import { useContext, useEffect, useRef } from 'react';
import { createFragmentContainer, graphql } from '@pipedrive/relay';
import { LeadboxFiltersContext } from 'Leadbox/LeadboxFiltersContext';
import { useComponentDidUpdate } from 'Hooks/useComponentDidUpdate';
import { useListContext } from 'Leadbox/LeadsListView/context/ListProvider';

import type { FilterInitializer_activeFilters } from './__generated__/FilterInitializer_activeFilters.graphql';

type Props = {
	activeFilters: FilterInitializer_activeFilters;
};

const FilterInitializerWithoutData = ({ activeFilters }: Props) => {
	const filterContext = useContext(LeadboxFiltersContext);
	const { relayList } = useListContext();

	// If filters are not initialized -> it means it's the first fetch of the data
	// and filters should be initialized in the response. In such a case filters
	// will change but we want to avoid automatic refetch in the useEffect
	const areFiltersInitialized = useRef(filterContext.is.initialized);

	useComponentDidUpdate(() => {
		if (!areFiltersInitialized.current) {
			areFiltersInitialized.current = true;

			return;
		}

		relayList.refetch({ filter: filterContext.get.filter });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filterContext.get.filter]);

	useEffect(() => {
		if (!filterContext.is.initialized) {
			filterContext.set.initialize({
				sources: activeFilters?.sources ? [...activeFilters.sources.map((e) => e.id)] : [],
				labels: activeFilters?.labels ? [...activeFilters.labels.map((e) => e.id)] : [],
				filter: activeFilters?.filter?.id ?? null,
				owner: activeFilters?.user
					? activeFilters?.user.id
					: activeFilters?.team
					? activeFilters?.team.id
					: null,
			});
		}
	}, [activeFilters, filterContext.set, filterContext.is.initialized]);

	return null;
};

export const FilterInitializer = createFragmentContainer(FilterInitializerWithoutData, {
	activeFilters: graphql`
		fragment FilterInitializer_activeFilters on LeadActiveFilters {
			sources {
				id
			}
			labels {
				id
			}
			filter {
				id
			}
			owner {
				id
			}
			user {
				id
			}
			team {
				id
			}
		}
	`,
});
