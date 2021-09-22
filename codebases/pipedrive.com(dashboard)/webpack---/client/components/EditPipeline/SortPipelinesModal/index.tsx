import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { useTranslator } from '@pipedrive/react-utils';
import { post } from '@pipedrive/fetch';
import { Button, Message, Spacing } from '@pipedrive/convention-ui-react';
import { StyledModal } from './StyledComponents';
import { addSnackbarMessage } from '../../SnackbarMessage/actions';
import { SnackbarMessages } from '../../SnackbarMessage/getMessage';
import { getPipelines, getPipelinesLength } from '../../../selectors/pipelines';
import reloadPage from '../../../utils/reloadPage';
import { getPipelineReorderedMetrics } from '../../../utils/metrics';
import { getPdMetrics } from '../../../shared/api/webapp';
import { SortableElementTiles } from '../../../sortable-elements';

type OwnProps = {
	isVisible: boolean;
	closeModal: () => void;
};

type StateProps = {
	pipelines: Pipedrive.Pipelines;
	pipelinesLength: number;
};

type DispatchProps = {
	addSnackbarMessage: typeof addSnackbarMessage;
};

export type SortPipelinesModalProps = OwnProps & StateProps & DispatchProps;

const SortPipelinesModal: React.FunctionComponent<SortPipelinesModalProps> = ({
	pipelines: propsPipelines,
	pipelinesLength,
	isVisible,
	closeModal,
	addSnackbarMessage,
}) => {
	const translator = useTranslator();
	const [isLoading, setLoading] = React.useState(false);
	const [pipelines, setPipelines] = React.useState(() => {
		return _.sortBy(Object.values(propsPipelines), 'order_nr').map((pipeline: Pipedrive.Pipeline) => ({
			id: pipeline.id,
			name: pipeline.name,
		}));
	});
	const [pipelineDragCount, setPipelineDragCount] = React.useState(0);

	const movePipeline = (dragIndex: number, hoverIndex: number) => {
		const updatedPipelines = [...pipelines];
		const pipeline = updatedPipelines.splice(dragIndex, 1)[0];

		updatedPipelines.splice(hoverIndex, 0, pipeline);

		setPipelines(updatedPipelines);
	};

	const saveOrder = async () => {
		setLoading(true);

		try {
			await post('/api/v1/pipelines/reorder', {
				pipelines: pipelines.map((pipeline) => pipeline.id),
			});

			const context = getPipelineReorderedMetrics(pipelinesLength, pipelineDragCount);

			getPdMetrics().trackUsage(null, 'pipelines', 'reordered', context);

			// We do a hard reload because we want to make sure that
			// the order of pipelines is refreshed everywhere in the app.
			reloadPage();
		} catch (err) {
			addSnackbarMessage({ key: SnackbarMessages.ACTION_FAILURE });
		} finally {
			closeModal();
		}
	};

	return (
		<StyledModal
			data-test="reorder-pipelines-modal"
			visible={isVisible}
			header={translator.gettext('Reorder pipelines')}
			onClose={closeModal}
			footer={
				<React.Fragment>
					<Button data-test="reorder-pipelines-modal-cancel" onClick={closeModal}>
						{translator.gettext('Cancel')}
					</Button>
					<Button
						data-test="reorder-pipelines-modal-save"
						loading={isLoading}
						color="green"
						onClick={saveOrder}
					>
						{translator.gettext('Save')}
					</Button>
				</React.Fragment>
			}
		>
			<Spacing all="none">
				<Message visible>
					{translator.gettext('Changing the order of the pipelines will change the order for all users')}
				</Message>
			</Spacing>

			<Spacing all="m">
				<SortableElementTiles
					onMove={movePipeline}
					onDrop={() => setPipelineDragCount(pipelineDragCount + 1)}
					elements={pipelines.map((pipeline: Pipedrive.Pipeline) => ({
						id: pipeline.id,
						Component: () => <span>{pipeline.name}</span>,
					}))}
				/>
			</Spacing>
		</StyledModal>
	);
};

const mapStateToProps = (state) => ({
	pipelines: getPipelines(state),
	pipelinesLength: getPipelinesLength(state),
});

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, { addSnackbarMessage })(
	SortPipelinesModal,
);
