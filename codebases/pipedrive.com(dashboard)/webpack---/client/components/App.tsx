import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorBoundary, useTranslator } from '@pipedrive/react-utils';
import { fetchDeals } from '../actions/deals';
import { fetchAllStatistics } from '../actions/summary';
import { getSelectedPipelineName } from '../selectors/pipelines';
import { getPipelineEditMode } from '../selectors/edit';
import { Container } from './StyledComponents';
import setDocumentTitle from '../utils/settings/setDocumentTitle';
import SnackbarMessage from './SnackbarMessage';
import { getLogger } from '../shared/api/webapp';
import Error from './Board/EmptyState/Error';
import { EditModes, ViewTypes } from '../utils/constants';
import PipelineApp from './PipelineApp';
import { setSelectedFilterOnListen } from '../actions/filters';
import { routePipelineView } from '../actions/pipelines';
import { setIsActive, waitUntilDealsHaveLoadedAndTrackViewOpened } from '../actions/view';
import saveUserSettings from '../utils/settings/saveUserSettings';
import { Levels } from '@pipedrive/logger-fe';

const SettingsAppLazy = React.lazy(() => import(/* webpackChunkName: "SettingsApp" */ './SettingsApp'));

export interface AppProps {
	visible?: boolean;
}

const level: Levels = 'error';

export const loggingData = {
	message: 'Something went wrong.',
	facility: 'pipeline-view',
	level,
};

const App: React.FunctionComponent<AppProps> = ({ visible }) => {
	const dispatch = useDispatch();
	const { pipelineName, pipelineEditMode } = useSelector((state: PipelineState) => ({
		pipelineName: getSelectedPipelineName(state),
		pipelineEditMode: getPipelineEditMode(state) as EditModes,
	}));
	const showEditScreen = pipelineEditMode === EditModes.CREATE || pipelineEditMode === EditModes.EDIT;
	const translator = useTranslator();
	const logger = getLogger();

	useEffect(() => {
		dispatch(routePipelineView(translator));

		setDocumentTitle(`${pipelineName} - ${translator.gettext('Deals')}`);

		dispatch(fetchDeals());
		dispatch(fetchAllStatistics({ includeGoals: true }));

		if (app.global.bind) {
			app.global.bind('deals.pipeline.filter.changed', (pipelineFilterKey) => {
				dispatch(setSelectedFilterOnListen(pipelineFilterKey, ViewTypes.PIPELINE));
			});
		}
	}, []);

	useEffect(() => {
		if (visible) {
			saveUserSettings('deals_view_mode', 'pipeline');
			dispatch(waitUntilDealsHaveLoadedAndTrackViewOpened());

			setDocumentTitle(`${pipelineName} - ${translator.gettext('Deals')}`);
		}

		dispatch(setIsActive(visible));
	}, [visible, pipelineName]);

	return (
		<ErrorBoundary error={<Error />} loggingData={loggingData} logger={logger}>
			<Container data-test="pipeline-view">
				{showEditScreen ? (
					<React.Suspense fallback={<div />}>
						<SettingsAppLazy />
					</React.Suspense>
				) : (
					<PipelineApp />
				)}
				<SnackbarMessage />
				<div id="pipeline-view-deal-actions-popover" />
			</Container>
		</ErrorBoundary>
	);
};

export default App;
