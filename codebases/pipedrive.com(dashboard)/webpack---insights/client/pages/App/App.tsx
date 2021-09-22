import React, { useEffect } from 'react';
import moment from 'moment';
import { useQuery, QueryResult } from '@apollo/client';

import {
	GET_USER_SETTINGS,
	GET_REPORT_SELECT_OPTIONS,
} from '../../api/graphql';
import {
	CappingApiClient,
	GET_CAP_MAPPING,
	GET_FEATURE_CAPPING,
} from '../../api/featureCapping.ts';
import { cappingState } from '../../api/vars/cappingState';
import { capMappingState } from '../../api/vars/capMappingState';
import { InsightsApiClient } from '../../api/apollo/insightsApiClient';
import { isInsightsEnabled } from '../../api/webapp';
import useRouting from '../../hooks/useRouting';
import ErrorMessage from '../../molecules/ErrorMessage';
import ReportCreatorFromUrl from './insightsWrapper/ReportCreatorFromUrl';
import NoDealsMessage from '../../atoms/NoDealsMessage';
import { containsErrorWithCode } from '../../atoms/ReportErrorMessage/networkErrors';
import { ERROR_CODES } from '../../utils/constants';
import FullscreenSpinner from '../../atoms/FullscreenSpinner/FullscreenSpinner';
import { GET_GOALS, GoalsApiClient } from '../../api/goals';
import { GOALS_AUTH_PARAMS } from '../../hooks/goals/goalUtils';
import { goalsState } from '../../api/vars/goalsState';

import styles from './App.pcss';

const App: React.FC = () => {
	useRouting();

	if (!isInsightsEnabled()) {
		return (
			<div className={styles.insights}>
				<ErrorMessage allowed={false} />
			</div>
		);
	}

	const {
		loading: settingsLoading,
		error: settingsError,
		data: settingsData,
	} = useQuery(GET_USER_SETTINGS);

	const {
		loading: filtersLoading,
		error: filtersError,
		data: filtersData,
	} = useQuery(GET_REPORT_SELECT_OPTIONS, {
		client: InsightsApiClient,
		skip: settingsLoading || !!settingsError,
	});

	const { loading: goalsLoading, error: goalsError } = useQuery(GET_GOALS, {
		client: GoalsApiClient,
		variables: {
			path: `/find?${GOALS_AUTH_PARAMS}&period.start=${moment()
				.locale('en')
				.subtract(1, 'years')
				.format('YYYY-MM-DD')}`,
		},
	});

	const { loading: cappingLoading, error: cappingError } = useQuery(
		GET_FEATURE_CAPPING,
		{
			client: CappingApiClient,
			variables: { path: '/features/reports' },
		},
	);

	const { loading: capMappingLoading, error: capMappingError } = useQuery(
		GET_CAP_MAPPING,
		{
			client: CappingApiClient,
			variables: { path: '/mapping' },
		},
	);

	useEffect(() => {
		goalsState({ loading: goalsLoading, error: goalsError });
		cappingState({ loading: cappingLoading, error: cappingError });
		capMappingState({ loading: capMappingLoading, error: capMappingError });
	});

	const renderError = (error: QueryResult['error']) => {
		if (error) {
			if (
				containsErrorWithCode(error, ERROR_CODES.PRIVATE_INDEX_MISSING)
			) {
				return (
					<div className={styles.insights}>
						<NoDealsMessage />
					</div>
				);
			}

			return (
				<div className={styles.insights}>
					<ErrorMessage allowed message={`Error! ${error.message}`} />
				</div>
			);
		}

		return null;
	};

	if (settingsLoading || filtersLoading) {
		return <FullscreenSpinner />;
	}

	if (settingsError || filtersError) {
		return renderError(settingsError || filtersError);
	}

	if (filtersData && settingsData) {
		return (
			<div className={styles.insights} data-test="insights-page">
				<ReportCreatorFromUrl />
			</div>
		);
	}

	return <FullscreenSpinner />;
};

export default App;
