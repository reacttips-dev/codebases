import React from 'react';
import { Radio, Select } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import { Wrapper, ParagraphWithCounter } from '../StyledComponents';
import { getDeactivateEntitiesLabel } from '../../../../../../utils/deletePipelineOrStage';

interface OwnProps {
	stages: Pipedrive.Stage[];
	stageBeingDeleted: Pipedrive.Stage;
	onChange: (playbookAndWebFormOptions: HandlePlaybooksAndWebFormsOptions | null) => void;
	playbooks: Pipedrive.LeadBooster.Playbook[];
	webForms: Pipedrive.WebForms.WebForm[];
	playbooksAndWebFormsOptions: HandlePlaybooksAndWebFormsOptions | null;
}

const DeleteStagePlaybooksAndWebFormsDialogContent = (props: OwnProps) => {
	const { stages, stageBeingDeleted, onChange, playbooks, webForms, playbooksAndWebFormsOptions } = props;
	const translator = useTranslator();

	const playbookUuids = playbooks.map(({ uuid }) => uuid);
	const webFormIds = webForms.map(({ id }) => id);

	const playbooksCount = playbooks.length;
	const webFormsCount = webForms.length;

	return (
		<Wrapper>
			<ParagraphWithCounter>
				{playbooksCount === 1 &&
					translator.gettext(
						'The following LeadBooster playbook saves new deals to this stage: %s.',
						playbooks[0].name,
					)}
				{playbooksCount > 1 &&
					translator.gettext(
						'The following LeadBooster playbooks save new deals to this stage: %s.',
						playbooks.map(({ name }) => name).join(', '),
					)}
				{playbooksCount > 0 && webFormsCount > 0 && '\n'}
				{webFormsCount === 1 &&
					translator.gettext('The following Web Form saves new deals to this stage: %s.', webForms[0].name)}
				{webFormsCount > 1 &&
					translator.gettext(
						'The following Web Forms save new deals to this stage: %s.',
						webForms.map(({ name }) => name).join(', '),
					)}
			</ParagraphWithCounter>
			<p>{translator.gettext('Where would you like new deals to be saved?')}</p>

			<Radio
				data-test="delete-stage-option-save-playbooks-and-web-forms"
				name={'playbooksAndWebFormsOptionSelect'}
				checked={
					playbooksAndWebFormsOptions === null || playbooksAndWebFormsOptions.option === 'USE_DIFFERENT_STAGE'
				}
				onChange={() =>
					onChange({
						option: 'USE_DIFFERENT_STAGE',
						playbookUuids,
						webFormIds,
						oldStageId: stageBeingDeleted.id,
						newStageId: 0,
					})
				}
			>
				{translator.gettext('Save to another stage')}
			</Radio>

			<Select
				data-test="delete-stage-dialog-playbook-and-web-form-select-stage"
				disabled={playbooksAndWebFormsOptions && playbooksAndWebFormsOptions.option !== 'USE_DIFFERENT_STAGE'}
				popupClassName="selectStage"
				placeholder={translator.gettext('Select stage')}
				onChange={(stageId: number) =>
					onChange({
						option: 'USE_DIFFERENT_STAGE',
						playbookUuids,
						webFormIds,
						oldStageId: stageBeingDeleted.id,
						newStageId: stageId,
					})
				}
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
				data-test="delete-stage-option-deactivate-playbooks-and-web-forms"
				name={'playbooksAndWebFormsOptionSelect'}
				checked={playbooksAndWebFormsOptions && playbooksAndWebFormsOptions.option === 'DEACTIVATE'}
				onChange={() =>
					onChange({
						option: 'DEACTIVATE',
						playbookUuids,
						webFormIds,
					})
				}
			>
				{getDeactivateEntitiesLabel(playbooksCount, webFormsCount, translator)}
			</Radio>
		</Wrapper>
	);
};

export default DeleteStagePlaybooksAndWebFormsDialogContent;
