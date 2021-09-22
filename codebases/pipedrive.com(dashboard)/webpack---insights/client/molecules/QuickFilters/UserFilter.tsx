import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Button, Icon } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import { QuickFilters } from '../../types/apollo-query-types';
import { trackDashboardQuickFiltersApplied } from '../../utils/metrics/dashboard-analytics';
import {
	getFilterValue,
	FiltersMenuValue,
	getActiveUserFilter,
	ActiveFilter,
	QuickFilterUserTypes,
} from '../../utils/quickFilterUtils';
import { updateQuickFilters } from '../../api/commands/quick-filters';
import { getComponentLoader } from '../../api/webapp';

import styles from './QuickFilters.pcss';

interface UserFilterProps {
	dashboardId: string;
	quickFilters: QuickFilters;
}

const UserFilter: React.FC<UserFilterProps> = ({
	dashboardId,
	quickFilters,
}) => {
	const translator = useTranslator();
	const [FiltersMenu, setFiltersMenu] = useState<{
		component: React.FC<any>;
	}>(null);
	const [WebappAPI, setWebappAPI] = useState<Pipedrive.API>();
	const [activeFilter, setActiveFilter] = useState<ActiveFilter>(null);
	const hasUserFilter = activeFilter?.value !== null;

	const loadFiltersMenu = async () => {
		const [component, userSelf, companyUsers, teams] = await Promise.all([
			getComponentLoader()?.load('filter-components:filters-menu'),
			getComponentLoader()?.load('webapp:user'),
			getComponentLoader()?.load('webapp:users'),
			getComponentLoader()?.load('webapp:teams'),
		]);

		setWebappAPI({ userSelf, companyUsers, teams } as Pipedrive.API);
		setFiltersMenu({ component });
	};

	useEffect(() => {
		loadFiltersMenu();
	}, []);

	useEffect(() => {
		if (WebappAPI) {
			setActiveFilter(
				getActiveUserFilter(quickFilters?.user, WebappAPI, translator),
			);
		}
	}, [WebappAPI, quickFilters?.user]);

	const updateUser = (type: QuickFilterUserTypes, user: FiltersMenuValue) => {
		const defaultValue = getFilterValue(user);
		const filterValue =
			defaultValue === null
				? null
				: {
						type,
						operands: [
							{
								defaultValue,
								name: 'isExactly',
							},
						],
				  };

		const activeFilterValue =
			defaultValue === null
				? {
						type: null,
						value: null,
						name: translator.gettext('User'),
				  }
				: { type, value: defaultValue, name: user.name };

		setActiveFilter(activeFilterValue);
		updateQuickFilters({
			dashboardId,
			user: filterValue,
			period: quickFilters?.period || null,
		});

		trackDashboardQuickFiltersApplied(dashboardId, 'user', null, type);
	};

	if (!FiltersMenu) {
		return <></>;
	}

	return (
		<div
			className={classNames(styles.userSelect, {
				[styles.buttonWithOutBorderRadius]: hasUserFilter,
			})}
			data-test="quick-filter-user-select"
		>
			<FiltersMenu.component
				type="deal"
				tabIndex={1}
				onSelectFilter={updateUser}
				activeFilter={activeFilter}
				excludeFiltersTab
				excludeTabs
				buttonProps={{
					active: hasUserFilter,
					children: (
						<>
							<Icon icon="person" size="s" />
							<span>
								{activeFilter.name ||
									translator.gettext('User')}
							</span>
							<Icon icon="triangle-down" size="s" />
						</>
					),
				}}
				inputProps={{
					placeholder: translator.gettext('Search user or team'),
				}}
				popoverProps={{
					portalTo: document.body,
				}}
			/>
			{hasUserFilter && (
				<Button
					className={styles.removeButton}
					onClick={() => updateUser(null, null)}
					active
					data-test="remove-user-quick-filter"
				>
					<Icon icon="cross" size="s" />
				</Button>
			)}
		</div>
	);
};

export default UserFilter;
