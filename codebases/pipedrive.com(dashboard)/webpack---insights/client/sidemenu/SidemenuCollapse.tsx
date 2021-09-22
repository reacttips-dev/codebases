import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { get } from 'lodash';
import { useTranslator } from '@pipedrive/react-utils';
import { Spinner } from '@pipedrive/convention-ui-react';

import { SidemenuSettings } from '../types/apollo-query-types';
import { PERMISSION_TYPES } from '../utils/constants';
import usePlanPermissions from '../hooks/usePlanPermissions';
import SidemenuCollapseHeader from './sidemenuCollapseHeader';
import SidemenuCollapseContent from './sidemenuCollapseContent';
import { InsightsApiClient } from '../api/apollo/insightsApiClient';
import { GET_CACHED_REPORT_IS_EDITING } from '../api/graphql/index';
import ErrorMessage from '../molecules/ErrorMessage';
import { goalsState } from '../api/vars/goalsState';
import { MenuItem } from '../pages/App/insightsWrapper/sideMenuUtils';

import styles from './SidemenuCollapse.pcss';

interface SidemenuCollapseProps {
	itemId: string;
	itemType: string;
	type: keyof SidemenuSettings;
	items: MenuItem[];
	searchText: string;
	isNew: boolean;
}

const SidemenuCollapse: React.FC<SidemenuCollapseProps> = ({
	itemId,
	itemType,
	type,
	items,
	searchText,
	isNew,
}) => {
	const translator = useTranslator();
	const [collapsed, setCollapsed] = useState(false);
	const hasItems = items?.length > 0;
	const isSearch = !!searchText;
	const isDashboard = type === 'dashboards';
	const isGoal = type === 'goals';
	const { hasPermission } = usePlanPermissions();
	const { loading: goalsLoading, error: goalsError } = goalsState();
	const canHaveMultipleDashboards = hasPermission(
		PERMISSION_TYPES.static.haveMultipleDashboards,
	);
	const isEditingQuery = useQuery(GET_CACHED_REPORT_IS_EDITING, {
		client: InsightsApiClient,
		variables: { id: itemId },
	});
	const isEditing = get(
		isEditingQuery,
		'data.cachedReports.unsavedReport.is_editing',
	);

	const isNewOrEditing = isNew || isEditing;

	const renderMenuItems = (isNavigationDisabled: boolean) => {
		if (isGoal) {
			if (goalsLoading) {
				return (
					<div className={styles.loader}>
						<Spinner size="s" light />
					</div>
				);
			}

			if (goalsError) {
				return <ErrorMessage allowed />;
			}
		}

		if (hasItems) {
			return (
				<SidemenuCollapseContent
					itemId={itemId}
					collapsed={collapsed}
					type={type}
					items={items}
					searchText={searchText}
					isNavigationDisabled={isNavigationDisabled}
					canHaveMultipleDashboards={
						isDashboard && canHaveMultipleDashboards
					}
				/>
			);
		}

		if (isSearch) {
			return (
				<div
					className={styles.emptyMessage}
					data-test={`empty-message-${type}`}
				>
					{translator.gettext('No matches found')}
				</div>
			);
		}

		return (
			<div className={styles.emptyMessage}>
				{isGoal
					? translator.gettext('No goals')
					: translator.gettext('No reports')}
			</div>
		);
	};

	return (
		<section className={styles.collapse}>
			<SidemenuCollapseHeader
				collapsed={collapsed}
				setCollapsed={setCollapsed}
				type={type}
				isCollapsingDisabled={!hasItems}
				isNewReport={isNew}
				isEditingReport={isEditing}
				itemId={itemId}
				itemType={itemType}
				items={items}
			/>
			{renderMenuItems(isNewOrEditing)}
		</section>
	);
};

export default React.memo(SidemenuCollapse);
