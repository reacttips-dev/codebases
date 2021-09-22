import React from 'react';
import { useQuery } from '@apollo/client';

import {
	SelectedItem,
	GetSidemenuSettingsResponse,
	SidemenuSettings,
} from '../../../types/apollo-query-types';
import { GET_SIDEBAR_SETTINGS } from '../../../api/graphql/settingsApi';
import Sidemenu from '../../../sidemenu';
import BoardWrapper from './BoardWrapper';
import ErrorBoundary from '../../../atoms/ErrorBoundary';
import FullscreenSpinner from '../../../atoms/FullscreenSpinner/FullscreenSpinner';
import ErrorMessage from '../../../molecules/ErrorMessage';
import { getGoalsSidemenuItems } from './sideMenuUtils';

interface InsightsWrapperProps {
	selectedItem: SelectedItem;
}

const InsightsWrapper: React.FC<InsightsWrapperProps> = ({ selectedItem }) => {
	const {
		data: {
			sidebarSettings: { __typename, ...settings },
		},
		loading,
		error,
	} = useQuery<GetSidemenuSettingsResponse>(GET_SIDEBAR_SETTINGS);

	if (!settings) {
		return null;
	}

	if (error) {
		return <ErrorMessage allowed message={`Error! ${error?.message}`} />;
	}

	if (!settings || loading) {
		return <FullscreenSpinner />;
	}

	const filteredSettings = {
		...settings,
		reports: settings.reports.filter((report) => !report?.is_goals_report),
	};

	const sidebarSettings: SidemenuSettings = {
		dashboards: filteredSettings.dashboards,
		goals: getGoalsSidemenuItems(settings.reports),
		reports: filteredSettings.reports,
	};

	return (
		<>
			<Sidemenu
				selectedItem={selectedItem}
				sidebarSettings={sidebarSettings}
			/>
			<ErrorBoundary>
				<BoardWrapper selectedItem={selectedItem} />
			</ErrorBoundary>
		</>
	);
};

export default InsightsWrapper;
