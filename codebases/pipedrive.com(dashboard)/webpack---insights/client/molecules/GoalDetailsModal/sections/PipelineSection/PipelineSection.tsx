import React from 'react';
import { Select, Spacing } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import { getPipelines, getPipelineStages } from '../../../../api/webapp';

import styles from '../GoalDetailsModalSection.pcss';

interface PipelineSectionProps {
	pipeline: number;
	setPipeline: (pipelineId: number) => void;
	stage?: number;
	setStage: (stageId: number) => void;
	isStageSelectionVisible: boolean;
}

const PipelineSection: React.FC<PipelineSectionProps> = ({
	pipeline,
	setPipeline,
	stage,
	setStage,
	isStageSelectionVisible,
}) => {
	const translator = useTranslator();

	const renderStageSelection = () => {
		return (
			<>
				<Spacing horizontal="s" />
				<Select
					className={styles.fullWidth}
					onChange={(stageId: number) => setStage(stageId)}
					value={stage}
				>
					{getPipelineStages(pipeline).map(
						(stage: Pipedrive.Stage) => (
							<Select.Option key={stage.id} value={stage.id}>
								{stage.name}
							</Select.Option>
						),
					)}
				</Select>
			</>
		);
	};

	return (
		<div className={styles.row}>
			<div className={styles.label}>{translator.gettext('Pipeline')}</div>
			<div className={styles.fieldSection}>
				<Select
					className={styles.fullWidth}
					onChange={(pipelineId: number) => setPipeline(pipelineId)}
					value={pipeline}
				>
					{!isStageSelectionVisible && (
						<Select.Option value={null}>
							{translator.gettext('All pipelines')}
						</Select.Option>
					)}
					{getPipelines().map((pipeline: Pipedrive.Pipeline) => (
						<Select.Option key={pipeline.id} value={pipeline.id}>
							{pipeline.name}
						</Select.Option>
					))}
				</Select>
				{isStageSelectionVisible && renderStageSelection()}
			</div>
		</div>
	);
};

export default PipelineSection;
