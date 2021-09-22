import React, { useState } from 'react';
// @ts-ignore
import { useDispatch, useSelector } from 'react-redux';
import { StyledDialog } from './StyledComponents';
import { Button, Icon } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import { getPipelineEditModeStages } from '../../../../../selectors/edit';
import { deleteStage } from '../../../../../actions/edit';
import DeleteStagePlaybooksAndWebFormsDialogContent from './DeleteStagePlaybooksAndWebFormsDialogContent';
import DeleteStageDealsDialogContent from './DeleteStageDealsDialogContent';

type DeleteStageDialogProps = {
	stage: Pipedrive.Stage;
	dealsCount: number;
	playbooksUsingThisStage: Pipedrive.LeadBooster.Playbook[];
	webFormsUsingThisStage: Pipedrive.WebForms.WebForm[];
	onClose: () => void;
};

export enum DeleteStageDealsDialogContentOptions {
	DELETE = 'DELETE',
	MOVE = 'MOVE',
}

export interface DealsData {
	option: string;
	stageId?: number;
	newStageId?: number;
}

const DeleteStageDialog: React.FunctionComponent<DeleteStageDialogProps> = ({
	stage,
	dealsCount,
	playbooksUsingThisStage,
	webFormsUsingThisStage,
	onClose,
}) => {
	const translator = useTranslator();
	const stages = useSelector((state: PipelineState) => getPipelineEditModeStages(state));
	const dispatch = useDispatch();

	const [playbooksAndWebFormsOptions, setPlaybooksAndWebFormsOptions] =
		useState<null | HandlePlaybooksAndWebFormsOptions>(null);

	const [dealsData, setDealsData] = useState<null | DealsData>({
		option: DeleteStageDealsDialogContentOptions.MOVE,
	});

	const canSubmitDealsData = () => {
		const { option, newStageId } = dealsData;

		return (
			(option === DeleteStageDealsDialogContentOptions.MOVE && newStageId) ||
			option === DeleteStageDealsDialogContentOptions.DELETE ||
			dealsCount === 0
		);
	};

	const canSubmitPlaybooksAndWebFormsData = () => {
		return (
			playbooksUsingThisStage.length === 0 ||
			webFormsUsingThisStage.length === 0 ||
			(playbooksAndWebFormsOptions !== null &&
				(playbooksAndWebFormsOptions.option === 'DEACTIVATE' ||
					(playbooksAndWebFormsOptions.option === 'USE_DIFFERENT_STAGE' &&
						playbooksAndWebFormsOptions.newStageId)))
		);
	};

	return (
		<StyledDialog
			data-test="delete-stage-dialog"
			title={translator.gettext('Delete %s stage', stage.name)}
			actions={
				<>
					<Button data-test="delete-stage-dialog-cancel-button" onClick={onClose}>
						{translator.gettext('Cancel')}
					</Button>

					<Button
						data-test="delete-stage-dialog-save-button"
						disabled={!(canSubmitDealsData() && canSubmitPlaybooksAndWebFormsData())}
						onClick={(ev) => {
							ev.stopPropagation();
							dispatch(deleteStage(stage.id, dealsData, playbooksAndWebFormsOptions));
						}}
						color="red"
					>
						<Icon icon="trash" color="white" size="s" />
						{translator.gettext('Delete stage')}
					</Button>
				</>
			}
			visible={true}
			closeOnEsc
			onClose={onClose}
		>
			{(dealsCount > 0 || playbooksUsingThisStage.length > 0 || webFormsUsingThisStage.length > 0) && (
				<p>{translator.gettext('Before deleting this pipeline stage, please specify the following:')}</p>
			)}

			{dealsCount === 0 ? (
				<span>{translator.gettext('There are no deals in this stage right now.')}</span>
			) : (
				<DeleteStageDealsDialogContent
					stageBeingDeleted={stage}
					stages={stages}
					dealsCount={dealsCount}
					onChange={(data) => setDealsData(data)}
					dealsData={dealsData}
				/>
			)}

			{(playbooksUsingThisStage.length > 0 || webFormsUsingThisStage.length > 0) && (
				<DeleteStagePlaybooksAndWebFormsDialogContent
					stages={stages}
					stageBeingDeleted={stage}
					onChange={(options) => setPlaybooksAndWebFormsOptions(options)}
					playbooks={playbooksUsingThisStage}
					webForms={webFormsUsingThisStage}
					playbooksAndWebFormsOptions={playbooksAndWebFormsOptions}
				/>
			)}
		</StyledDialog>
	);
};

export default DeleteStageDialog;
