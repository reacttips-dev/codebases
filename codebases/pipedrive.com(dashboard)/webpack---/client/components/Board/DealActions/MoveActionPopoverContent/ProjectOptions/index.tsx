import React, { useEffect, useState } from 'react';
import { Checkbox, Spacing } from '@pipedrive/convention-ui-react';
import { useDispatch } from 'react-redux';
import { useTranslator } from '@pipedrive/react-utils';

import { addSnackbarMessage } from '../../../../SnackbarMessage/actions';
import { closeActionPopovers } from '../../../../../actions/actionPopovers';
import { openAddProjectModal } from '../../../../../utils/modals';
import { setDealWonLostOrDeletedCoachmark } from '../../../../../utils/regularCoachmarks';
import { Title } from '../StyledComponents';
import { SnackbarMessages } from '../../../../SnackbarMessage/getMessage';
import { updateDealStatus } from '../../../../../actions/deals';

enum SaveOptions {
	CreateAndWinDeal = 'createAndWinDeal',
	Create = 'create',
}

export interface ProjectModalPrefill {
	deal_id: {
		id: number;
		title: string;
	};
	org_id?: {
		id: number;
		name: string;
	};
	person_id?: {
		id: number;
		name: string;
	};
}

const getAddProjectModalPrefill = (deal): ProjectModalPrefill => {
	return {
		deal_id: {
			id: deal.id,
			title: deal.title,
		},
		...(deal.org_id && {
			org_id: {
				id: deal.org_id,
				name: deal.org_name,
			},
		}),
		...(deal.person_id && {
			person_id: {
				id: deal.person_id,
				name: deal.person_name,
			},
		}),
	};
};

interface ProjectOptionsProps {
	deal: Pipedrive.Deal;
	setOnSaveHandler: (func: () => void) => void;
}

const ProjectOptions = ({ deal, setOnSaveHandler }: ProjectOptionsProps) => {
	const dispatch = useDispatch();
	const translator = useTranslator();
	const [saveOption, setSaveOption] = useState<SaveOptions>(SaveOptions.CreateAndWinDeal);

	useEffect(() => {
		const handleSave = () => {
			dispatch(closeActionPopovers());

			if (saveOption === SaveOptions.CreateAndWinDeal) {
				const snackbarProps = {
					actionText: translator.gettext('open'),
					onClick: () => window.open(`/deal/${deal.id}`, '_blank'),
				};

				dispatch(updateDealStatus(deal, 'won', { status: 'won' }, false));
				dispatch(
					addSnackbarMessage({
						key: SnackbarMessages.ACTION_DEAL_WON,
						translatorReplacements: [deal.title],
						snackbarProps,
					}),
				);
				setDealWonLostOrDeletedCoachmark(translator);
			}

			const addProjectModalPrefill = getAddProjectModalPrefill(deal);

			openAddProjectModal(addProjectModalPrefill, {
				...(saveOption === SaveOptions.CreateAndWinDeal && { deal_marked_as_won: true }),
			});
		};

		setOnSaveHandler(() => handleSave);
	}, [
		dispatch,
		closeActionPopovers,
		saveOption,
		updateDealStatus,
		addSnackbarMessage,
		deal,
		setDealWonLostOrDeletedCoachmark,
		translator,
		openAddProjectModal,
	]);

	return (
		<>
			<Title>{translator.gettext('Settings')}</Title>
			<Spacing vertical="m">
				<Checkbox
					type="round"
					checked={saveOption === SaveOptions.CreateAndWinDeal}
					onChange={() => setSaveOption(SaveOptions.CreateAndWinDeal)}
					disabled={false}
				>
					{translator.gettext('Create a project and mark the deal as won')}
				</Checkbox>
				<Checkbox
					type="round"
					checked={saveOption === SaveOptions.Create}
					onChange={() => setSaveOption(SaveOptions.Create)}
					disabled={false}
					data-test="project-option-do-not-mark-deal-as-won"
				>
					{translator.gettext('Create a project and keep the deal open')}
				</Checkbox>
			</Spacing>
		</>
	);
};

export default ProjectOptions;
