import { useTranslator } from '@pipedrive/react-utils';
import React, { useState } from 'react';
import { LabelColors } from 'Types/types';
import { createFragmentContainer, graphql, useMutation } from '@pipedrive/relay';
import { LabelColorEnum } from 'Utils/graphql/LabelColorEnum';

import { LabelsSelectForm } from './LabelsSelectForm';
import { LabelsSelectDeleteConfirm } from './LabelsSelectDeleteConfirm';
import type { LabelColor, LabelsSelectEditMutation } from './__generated__/LabelsSelectEditMutation.graphql';
import type { LabelsSelectEditDeleteMutation } from './__generated__/LabelsSelectEditDeleteMutation.graphql';
import type { LabelsSelectEdit_label } from './__generated__/LabelsSelectEdit_label.graphql';

interface Props {
	readonly label: null | LabelsSelectEdit_label;
	readonly onSave: () => void;
	readonly onClose: () => void;
	readonly onDelete: () => void;
}

const LabelsSelectEditWithoutData: React.FC<Props> = ({ label, onSave, onClose, onDelete }) => {
	const [errorMessage, setErrorMessage] = useState<undefined | string>(undefined);
	const translator = useTranslator();

	const [editLabel, isLabelsEditPending] = useMutation<LabelsSelectEditMutation>(graphql`
		mutation LabelsSelectEditMutation($input: UpdateLabelInput!) {
			updateLabel(input: $input) {
				__typename
				... on Label {
					...LabelsSelectEdit_label
				}
				... on Error {
					__typename
				}
			}
		}
	`);

	const [deleteLabel, isLabelDeletionPending] = useMutation<LabelsSelectEditDeleteMutation>(graphql`
		mutation LabelsSelectEditDeleteMutation($labelID: ID!) {
			deleteLabel(id: $labelID) {
				__typename
				... on Label {
					id
				}
				... on Error {
					__typename
				}
			}
		}
	`);

	const isPending = isLabelsEditPending || isLabelDeletionPending;

	if (!label) {
		// This happens when labels was just deleted (it's removed from the labels map in Redux).
		return null;
	}

	const systemError = () => {
		setErrorMessage(translator.gettext('There was an error saving the label.'));
	};

	const onSaveHandler = (changedLabel: { readonly name: string; readonly color: LabelColors }) => {
		editLabel({
			variables: {
				input: {
					id: label.id,
					name: changedLabel.name,
					colorName: LabelColorEnum.fromJSToEnum(changedLabel.color) as LabelColor,
				},
			},
			onCompleted: ({ updateLabel }) => {
				if (updateLabel?.__typename === 'Label') {
					onSave();
					onClose();
				} else {
					systemError();
				}
			},
		});
	};

	const onDeleteHandler = () => {
		deleteLabel({
			variables: {
				labelID: label.id,
			},
			updater: (store, { deleteLabel }) => {
				if (deleteLabel?.__typename === 'Label') {
					store.delete(deleteLabel.id);
				} else {
					throw new Error('unable to delete the label');
				}
			},
			onCompleted: () => {
				onDelete();
			},
			onError: () => {
				systemError();
			},
		});
	};

	return (
		<LabelsSelectForm
			data-testid="LabelsSelectForm"
			title={translator.gettext('Edit label')}
			onClose={onClose}
			onSave={onSaveHandler}
			initName={label.name}
			initColor={LabelColorEnum.fromEnumToJS(label.colorName)}
			isLoading={isPending}
			inputErrorMessage={errorMessage}
			footerButtons={<LabelsSelectDeleteConfirm onDelete={onDeleteHandler} label={label} />}
		/>
	);
};

export const LabelsSelectEdit = createFragmentContainer(LabelsSelectEditWithoutData, {
	label: graphql`
		fragment LabelsSelectEdit_label on Label {
			id
			name
			colorName
			...LabelsSelectDeleteConfirm_label
		}
	`,
});
