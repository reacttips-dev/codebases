import React from 'react';

import UserFilter from './UserFilter';
import PeriodFilter from './PeriodFilter';
import { getQuickFilters } from '../../api/commands/quick-filters';

interface QuickFiltersProps {
	dashboardId: string;
}

const QuickFilters: React.FC<QuickFiltersProps> = ({ dashboardId }) => {
	const quickFilters = getQuickFilters(dashboardId);
	const quickFiltersProps = { dashboardId, quickFilters };

	return (
		<>
			<PeriodFilter {...quickFiltersProps} />
			<UserFilter {...quickFiltersProps} />
		</>
	);
};

export default QuickFilters;
