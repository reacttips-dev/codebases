import React, { useState } from 'react';
import { Select, Spacing } from '@pipedrive/convention-ui-react';
import { useDispatch } from 'react-redux';

import DealTileWrapper from '../../../DealTileWrapper';
import MoveActionPopoverContentFooter from './MoveActionPopoverContentFooter';
import PipelineSelector from './PipelineSelector/index';
import ProjectOptions from './ProjectOptions';
import { closeActionPopovers } from '../../../../actions/actionPopovers';
import { Container, Title, SelectGroup, Label, SaveLocationOptionsWrapper, TitleBar } from './StyledComponents';
import { useTranslator } from '@pipedrive/react-utils';
import {
	getComponentLoader,
	isAdmin,
	canConvertDealsToLeads,
	isProjectsAlphaEnabled,
} from '../../../../shared/api/webapp';
export interface MoveActionPopoverContentProps {
	deal: Pipedrive.Deal;
}

enum SaveLocation {
	Deals = 'deal',
	Leads = 'lead',
	Projects = 'project',
}

export interface MoveActionPopoverContentState {
	selectedPipelineId: number;
	selectedStageId: number;
}

const MoveActionPopoverContent = ({ deal }: MoveActionPopoverContentProps) => {
	const dispatch = useDispatch();
	const translator = useTranslator();

	const [saveLocation, setSaveLocation] = useState<SaveLocation>(SaveLocation.Deals);
	const [onSaveHandler, setOnSaveHandler] = useState<() => void>();
	const canConvertToLeads = isAdmin() || canConvertDealsToLeads();

	const openConvertToLeadsModal = async () => {
		dispatch(closeActionPopovers());
		const componentLoader = getComponentLoader();
		const modals = await componentLoader.load('froot:modals');
		const params = {
			dealId: deal.id,
			view: 'Pipeline',
		};

		modals.open('leadbox-fe:convert-modal', params);
	};

	const handleSaveLocationChange = (value: SaveLocation) => {
		setSaveLocation(value);

		if (value === SaveLocation.Leads) {
			setOnSaveHandler(() => openConvertToLeadsModal);
		}
	};

	const getSaveLocationOptions = () => {
		switch (saveLocation) {
			case SaveLocation.Leads:
				return <></>;
			case SaveLocation.Projects:
				return <ProjectOptions deal={deal} setOnSaveHandler={setOnSaveHandler} />;
			default:
				return <PipelineSelector deal={deal} setOnSaveHandler={setOnSaveHandler} />;
		}
	};

	const saveLocationOptions = getSaveLocationOptions();

	return (
		<Container data-test="deal-actions-move-popover">
			<Spacing horizontal="m">
				<TitleBar>
					<Title>{translator.gettext('Move/convert')}</Title>
				</TitleBar>
				<Spacing top="m">
					<DealTileWrapper deal={deal} isClickable={false} />
				</Spacing>
				{(canConvertToLeads || isProjectsAlphaEnabled()) && (
					<Spacing top="m">
						<SelectGroup>
							<Label>{translator.gettext('Save to…')}</Label>
							<Select
								icon={saveLocation}
								value={saveLocation}
								onChange={handleSaveLocationChange}
								data-test="deal-actions-move-popover-select-target"
							>
								<Select.Option key="deal" value="deal">
									{translator.gettext('Deals')}
								</Select.Option>
								{canConvertToLeads && (
									<Select.Option key="lead" value="lead">
										{translator.gettext('Leads')}
									</Select.Option>
								)}
								{isProjectsAlphaEnabled() && (
									<Select.Option
										key="project"
										value="project"
										data-test="deal-actions-move-popover-select-target-project"
									>
										{translator.gettext('Projects')}
									</Select.Option>
								)}
							</Select>
						</SelectGroup>
					</Spacing>
				)}
				<Spacing top="m">
					<SaveLocationOptionsWrapper>{saveLocationOptions}</SaveLocationOptionsWrapper>
				</Spacing>
			</Spacing>
			<MoveActionPopoverContentFooter onSaveHandler={onSaveHandler} />
		</Container>
	);
};

export default MoveActionPopoverContent;
