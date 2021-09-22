import React from 'react';
import { Select, Radio } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import { DealsData, DeleteStageDealsDialogContentOptions } from '..';
import { Wrapper, ParagraphWithCounter } from '../StyledComponents';

interface OwnProps {
	dealsCount: number;
	stages: Pipedrive.Stage[];
	stageBeingDeleted: Pipedrive.Stage;
	onChange: (dealsData: DealsData | null) => void;
	dealsData: DealsData;
}

const DeleteStageDealsDialogContent = (props: OwnProps) => {
	const translator = useTranslator();
	const { dealsCount, stages, stageBeingDeleted, onChange, dealsData } = props;

	return (
		<Wrapper>
			<ParagraphWithCounter>
				{translator.ngettext(
					'What would you like to do with the deal in this stage?',
					'What would you like to do with the %d deals in this stage?',
					dealsCount,
					dealsCount,
				)}
			</ParagraphWithCounter>

			<Radio
				name={'dealsOptionSelect'}
				data-test={'delete-stage-option-move-deals'}
				checked={dealsData.option === DeleteStageDealsDialogContentOptions.MOVE}
				onChange={() =>
					onChange({
						...dealsData,
						option: DeleteStageDealsDialogContentOptions.MOVE,
					})
				}
			>
				{translator.gettext('Move to another stage')}
			</Radio>

			<Select
				disabled={dealsData.option === DeleteStageDealsDialogContentOptions.DELETE}
				data-test="delete-stage-dialog-select-stage"
				popupClassName="selectStage"
				placeholder={translator.gettext('Select stage')}
				onChange={(stageId: number) => onChange({ ...dealsData, newStageId: stageId })}
			>
				{stages
					.filter((stage: Pipedrive.Stage) => stage.id !== stageBeingDeleted.id)
					.map((stage: Pipedrive.Stage) => (
						<Select.Option key={stage.id} value={stage.id}>
							{stage.name || `(${translator.gettext('No name')})`}
						</Select.Option>
					))}
			</Select>

			<Radio
				name={'dealsOptionSelect'}
				data-test="delete-stage-option-delete-deals"
				checked={dealsData.option === DeleteStageDealsDialogContentOptions.DELETE}
				onChange={() => onChange({ ...dealsData, option: DeleteStageDealsDialogContentOptions.DELETE })}
			>
				{translator.gettext('Delete Deals')}
			</Radio>
		</Wrapper>
	);
};

export default DeleteStageDealsDialogContent;
