import React from 'react';
import { connect } from 'react-redux';
import { Option, Button, Icon } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import { Container, FooterContainer } from './StyledComponents';
import { trackPipelineChange, isAdmin } from '../../../shared/api/webapp';
import { getPipelines, getSelectedPipeline, getSelectedPipelineId } from '../../../selectors/pipelines';
import { setSelectedPipeline } from '../../../actions/pipelines';
import { setPipelineEditMode, setPipelineCreateMode, setEntryPoint } from '../../../actions/edit';
import setDocumentTitle from '../../../utils/settings/setDocumentTitle';
import SortPipelinesModal from '../../EditPipeline/SortPipelinesModal';
import { EntryPoints, FlowCoachmarkTypes, ViewTypes } from '../../../utils/constants';
import { getViewerState } from '../../../selectors/view';
import { closeFlowCoachmark, useAddFlowCoachmark } from '../../../utils/flowCoachmarks';
import useExternalComponent from '../../useExternalComponent';

export interface PipelineSelectProps {
	isViewer: boolean;
	allowEdit: boolean;
	pipelines: Pipedrive.Pipelines;
	selectedPipelineId: number;
	selectedPipeline: Pipedrive.Pipeline;
	setSelectedPipeline: typeof setSelectedPipeline;
	setPipelineEditMode: typeof setPipelineEditMode;
	setPipelineCreateMode: typeof setPipelineCreateMode;
	setEntryPoint: typeof setEntryPoint;
	viewType: ViewTypes;
}

const PipelineSelect: React.FunctionComponent<PipelineSelectProps> = (props) => {
	const {
		pipelines,
		selectedPipeline,
		selectedPipelineId,
		setSelectedPipeline,
		setPipelineCreateMode,
		setPipelineEditMode,
		setEntryPoint,
		allowEdit,
		isViewer,
		viewType,
	} = props;
	const translator = useTranslator();
	const [isSortPipelineModalVisible, setSortPipelineModalVisible] = React.useState(false);
	const hasMultiplePipelines = Object.keys(pipelines).length > 1;
	const canEditPipelineSettings = !!isAdmin() && !isViewer && allowEdit;

	const getSelectedPipelineName = (pipelineId: number) => {
		return pipelines[pipelineId].name;
	};

	const getSelectedPipeline = (pipelineId: number) => {
		return pipelines[pipelineId];
	};

	const enterEditMode = (pipeline, entryPoint) => {
		setPipelineEditMode(pipeline);
		setEntryPoint(entryPoint);
	};

	const onChangePipeline = async (pipelineId: number) => {
		trackPipelineChange(pipelineId, selectedPipelineId);
		setSelectedPipeline(pipelineId, viewType);
		setDocumentTitle(`${getSelectedPipelineName(pipelineId)} - ${translator.gettext('Deals')}`);
	};

	useAddFlowCoachmark(FlowCoachmarkTypes.EDIT_PIPELINE);

	const renderDropMenuFooter = (pipelineId: number, closePopover: () => void) => {
		const selectedPipeline = getSelectedPipeline(pipelineId);

		if (!canEditPipelineSettings) {
			return false;
		}

		return (
			<FooterContainer>
				<React.Fragment>
					<Option
						data-test="create-pipeline-settings"
						onClick={() => {
							setPipelineCreateMode(translator);

							// Need to close popover in case the pipeline creation fails
							closePopover();
						}}
					>
						<Icon icon="plus" size="s" />
						<span>{translator.gettext('New pipeline')}</span>
					</Option>
					<Option
						data-test="edit-pipeline-settings"
						onClick={() => enterEditMode(selectedPipeline, EntryPoints.DROPMENU_FOOTER_EDIT)}
					>
						<Icon icon="pencil" size="s" />
						<span>{translator.gettext('Edit pipeline')}</span>
					</Option>
					{hasMultiplePipelines && (
						<Option
							onClick={() => {
								setSortPipelineModalVisible(true);
								closePopover();
							}}
							data-test="reorder-pipelines-option"
						>
							<Icon icon="drag-handle" size="s" />
							<span>{translator.gettext('Reorder pipelines')}</span>
						</Option>
					)}
				</React.Fragment>
			</FooterContainer>
		);
	};

	const PIPELINE_SELECT_COMPONENT = 'filter-components:pipeline-select';

	const PipelineSelectComponent = useExternalComponent(PIPELINE_SELECT_COMPONENT);

	if (!PipelineSelectComponent) {
		return null;
	}

	return (
		<Container>
			<PipelineSelectComponent
				onEdit={(pipeline) => {
					enterEditMode(getSelectedPipeline(pipeline.id), EntryPoints.DROPMENU_EDIT);
				}}
				onChange={onChangePipeline}
				footer={(closePopover) => renderDropMenuFooter(selectedPipelineId, closePopover)}
				selectedPipeline={selectedPipelineId}
				canEditPipelineSettings={canEditPipelineSettings}
			/>
			{canEditPipelineSettings && (
				<Button
					data-coachmark="pipeline-select"
					onClick={() => {
						closeFlowCoachmark(FlowCoachmarkTypes.EDIT_PIPELINE);
						enterEditMode(selectedPipeline, EntryPoints.EDIT);
					}}
				>
					<Icon icon="pencil" size="s" />
				</Button>
			)}

			{isSortPipelineModalVisible && (
				<SortPipelinesModal
					isVisible={isSortPipelineModalVisible}
					closeModal={() => setSortPipelineModalVisible(false)}
				/>
			)}
		</Container>
	);
};

const mapStateToProps = (state: PipelineState) => ({
	isViewer: getViewerState(state),
	pipelines: getPipelines(state),
	selectedPipelineId: getSelectedPipelineId(state),
	selectedPipeline: getSelectedPipeline(state),
});

const mapDispatchToProps = {
	setSelectedPipeline,
	setPipelineCreateMode,
	setPipelineEditMode,
	setEntryPoint,
};

export default connect(mapStateToProps, mapDispatchToProps)(PipelineSelect);
