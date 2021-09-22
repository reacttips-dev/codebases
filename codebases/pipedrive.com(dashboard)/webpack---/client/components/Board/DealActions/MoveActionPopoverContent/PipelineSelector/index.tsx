import React, { useEffect, useState } from 'react';
import { Select, Spacing } from '@pipedrive/convention-ui-react';
import { sortBy, orderBy } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslator } from '@pipedrive/react-utils';

import MiniPipeline from '../../../../Shared/MiniPipeline';
import validateRequiredFields from '../../../../../utils/validateRequiredFields';
import { closeActionPopovers } from '../../../../../actions/actionPopovers';
import { moveDealToOtherPipeline, moveDealToStage, unhideDeal } from '../../../../../actions/deals';
import { getPipelines, getSelectedPipelineId } from '../../../../../selectors/pipelines';
import { SelectGroup, Label } from '../StyledComponents';

interface PipelineSelectorProps {
	deal: Pipedrive.Deal;
	setOnSaveHandler: (func: () => void) => void;
}

const PipelineSelector = ({ deal, setOnSaveHandler }: PipelineSelectorProps) => {
	const dispatch = useDispatch();
	const translator = useTranslator();
	const { selectedPipelineId, pipelines } = useSelector((state: PipelineState) => ({
		selectedPipelineId: getSelectedPipelineId(state),
		pipelines: getPipelines(state),
	}));
	const [currentSelectedPipelineId, setCurrentSelectedPipelineId] = useState<number>(selectedPipelineId);
	const [currentSelectedStageId, setCurrentSelectedStageId] = useState<number>(deal.stage_id);

	useEffect(() => {
		const saveDeal = () => {
			dispatch(closeActionPopovers());
			if (currentSelectedPipelineId === selectedPipelineId) {
				dispatch(moveDealToStage(deal, deal.stage_id, currentSelectedStageId, false));
			} else {
				dispatch(moveDealToOtherPipeline(deal, currentSelectedPipelineId, currentSelectedStageId));
			}
		};

		const handleSaveDeal = () => {
			validateRequiredFields({
				deal,
				dealUpdateProperties: {
					pipeline_id: currentSelectedPipelineId,
					stage_id: currentSelectedStageId,
				},
				onSave: saveDeal,
				onError: saveDeal,
				updateDealOnSave: true,
				onCancel: () => {
					dispatch(unhideDeal(deal));
				},
			});
		};

		setOnSaveHandler(() => handleSaveDeal);
	}, [
		dispatch,
		closeActionPopovers,
		deal,
		currentSelectedPipelineId,
		selectedPipelineId,
		moveDealToStage,
		currentSelectedStageId,
		moveDealToOtherPipeline,
		validateRequiredFields,
		unhideDeal,
	]);

	return (
		<>
			<SelectGroup>
				<Label>{translator.gettext('Pipeline')}</Label>
				<Select<number>
					defaultValue={selectedPipelineId}
					onChange={(selectedPipelineId: number) => {
						const allStagesForPipeline = Object.values(pipelines[selectedPipelineId].stages);
						const firstStageInPipeline = sortBy(allStagesForPipeline, 'order_nr')[0];

						setCurrentSelectedPipelineId(Number(selectedPipelineId));
						setCurrentSelectedStageId(firstStageInPipeline.id);
					}}
					data-test="deal-actions-move-popover-select-pipeline"
				>
					{orderBy(Object.values(pipelines), 'order_nr')
						.filter((pipeline) => pipeline.stage_ids.length > 0)
						.map((pipeline: Pipedrive.Pipeline) => {
							return (
								<Select.Option
									key={pipeline.id}
									value={pipeline.id}
									data-test={`deal-actions-move-popover-select-pipeline-${pipeline.id}`}
								>
									{pipeline.name}
								</Select.Option>
							);
						})}
				</Select>
			</SelectGroup>
			<Spacing top="m">
				<SelectGroup>
					<Label>{translator.gettext('Stage')}</Label>
					<MiniPipeline
						stages={pipelines[currentSelectedPipelineId].stages}
						activeStageId={currentSelectedStageId}
						onClickStage={(stageId) => {
							setCurrentSelectedStageId(stageId);
						}}
					/>
				</SelectGroup>
			</Spacing>
		</>
	);
};

export default PipelineSelector;
