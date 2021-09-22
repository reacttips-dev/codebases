import { Popover } from '@pipedrive/convention-ui-react';
import React, { useEffect, useState } from 'react';
import { createFragmentContainer, graphql } from '@pipedrive/relay';
import { useKeyPress } from 'Hooks/useKeyPress';

import { LabelsSelectCreate } from './LabelsSelectCreate';
import { LabelsSelectEdit } from './LabelsSelectEdit';
import { LabelsSelectList } from './LabelsSelectList';
import { TransitionFromLeft, TransitionFromRight, TransitionHolder } from './Transitions';
import { LabelsSelectPopover_allLabels } from './__generated__/LabelsSelectPopover_allLabels.graphql';

enum LabelsSelectMode {
	List = 'list',
	Edit = 'edit',
	Create = 'create',
}

interface Props {
	allLabels: LabelsSelectPopover_allLabels;
	selectedLabelIds: Array<string>;
	leadID?: string;
	isOpen: boolean;
	onClose: () => void;
	onEdit: () => void;
	onDelete: (labelKey: string) => void;
	onCreate: (labelID: string) => void;
	onOptionChange: (labelKey: string | null) => void;
}

export const LabelsSelectPopoverWithoutData: React.FC<Props> = ({
	allLabels,
	selectedLabelIds,
	leadID,
	isOpen,
	onClose,
	onEdit,
	onDelete,
	onCreate,
	onOptionChange,
}) => {
	const [currentMode, setCurrentMode] = useState<LabelsSelectMode>(LabelsSelectMode.List);
	const [searchValue, setSearchValue] = useState<string>('');
	const [prefilledValue, setPrefilledValue] = useState('');
	const [selectedKeyToEdit, setSelectedKeyToEdit] = useState('');

	const selectedLabel =
		(allLabels ?? []).find((label) => {
			return label?.id === selectedKeyToEdit;
		}) ?? null;

	useEffect(() => {
		if (isOpen) {
			setCurrentMode(LabelsSelectMode.List);
		}
	}, [isOpen]);

	const setListMode = () => {
		setCurrentMode(LabelsSelectMode.List);
		setSelectedKeyToEdit('');
	};

	const setCreateMode = (initValue: string) => {
		setPrefilledValue(initValue);
		setCurrentMode(LabelsSelectMode.Create);
	};

	const setEditMode = async (labelKey: string) => {
		setSelectedKeyToEdit(labelKey);
		setCurrentMode(LabelsSelectMode.Edit);
	};

	const deleteLabelHandler = async () => {
		await onDelete(selectedKeyToEdit);
		onClose();
	};

	useKeyPress('Escape', onClose);

	return (
		<Popover
			visible={isOpen}
			data-testid="Labels_Popover"
			content={
				<TransitionHolder changeOn={[currentMode, isOpen, searchValue]}>
					<TransitionFromLeft display={currentMode === LabelsSelectMode.Create}>
						<LabelsSelectCreate
							leadID={leadID}
							initName={prefilledValue}
							onSave={onCreate}
							onClose={setListMode}
						/>
					</TransitionFromLeft>
					<TransitionFromLeft display={currentMode === LabelsSelectMode.Edit}>
						<LabelsSelectEdit
							label={selectedLabel}
							onSave={onEdit}
							onClose={setListMode}
							onDelete={deleteLabelHandler}
						/>
					</TransitionFromLeft>
					<TransitionFromRight display={currentMode === LabelsSelectMode.List}>
						<LabelsSelectList
							allLabels={allLabels ?? []}
							selectedLabelIds={selectedLabelIds}
							showAllLabelsOption={!!leadID}
							onOptionChange={onOptionChange}
							onClickNew={setCreateMode}
							onClickEdit={setEditMode}
							searchValue={searchValue}
							setSearchValue={setSearchValue}
						/>
					</TransitionFromRight>
				</TransitionHolder>
			}
			onPopupVisibleChange={onClose}
			spacing="none"
			popperProps={{ eventsEnabled: false }}
			placement={leadID ? 'bottom' : 'bottom-end'}
		>
			{/* The following div has to be here, because Popover requires a children and it sets the position of the content */}
			<div />
		</Popover>
	);
};

export const LabelsSelectPopover = createFragmentContainer(LabelsSelectPopoverWithoutData, {
	allLabels: graphql`
		fragment LabelsSelectPopover_allLabels on Label @relay(plural: true) {
			id
			...LabelsSelectList_allLabels
			...LabelsSelectEdit_label
		}
	`,
});
