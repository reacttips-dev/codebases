import { useTranslator } from '@pipedrive/react-utils';
import React, { useState } from 'react';
import { LabelColors } from 'Types/types';
import { graphql, useMutation } from '@pipedrive/relay';
import { LabelColorEnum } from 'Utils/graphql/LabelColorEnum';
import { getRandomLabelColor } from 'Utils/utils';

import { LabelsSelectForm } from './LabelsSelectForm';
import type { LabelColor, LabelsSelectCreateMutation } from './__generated__/LabelsSelectCreateMutation.graphql';

interface Props {
	readonly leadID?: string;
	readonly initName: null | string;
	readonly onSave: (labelID: string) => void;
	readonly onClose: () => void;
}

export const LabelsSelectCreate: React.FC<Props> = (props) => {
	const { leadID, initName, onSave, onClose } = props;

	const [inputErrorMessage, setInputErrorMessage] = useState<undefined | string>(undefined);
	const translator = useTranslator();
	const initColor = getRandomLabelColor();

	const [createLabel, isLabelsCreationPending] = useMutation<LabelsSelectCreateMutation>(
		graphql`
			mutation LabelsSelectCreateMutation($input: CreateLabelInput!) {
				createLabel(input: $input) {
					__typename
					... on Label {
						id
						# TODO: cleanup after "LabelBadgeList_lead" cleanup:
						legacyID: id(opaque: false)
						name
						colorName
					}
					... on Error {
						__typename
					}
				}
			}
		`,
	);

	const systemError = () => {
		setInputErrorMessage(translator.gettext('There was an error saving the label.'));
	};

	const onSaveHandler = async (label: { readonly name: string; readonly color: LabelColors }) => {
		createLabel({
			variables: {
				input: {
					name: label.name,
					colorName: LabelColorEnum.fromJSToEnum(label.color) as LabelColor,
				},
			},
			onCompleted: ({ createLabel }) => {
				if (createLabel == null) {
					return systemError();
				}
				if (createLabel.__typename === 'Label') {
					onSave(createLabel.id);
					onClose();
				} else {
					systemError();
				}
			},
			// Relay merges data from the mutation result based on each response object's `id` value.
			// In this case, however, we want to add the new label to the list of labels: Relay doesn't
			// magically know where createLabel response should be added into the data graph.
			// So we define an `updater` function to imperatively update the store.
			//
			// This could eventually be extracted into some more reusable updater.
			updater: (store) => {
				const root = store.getRoot();
				const rootLabels = root.getLinkedRecords('labels') ?? [];
				const newLabel = store.getRootField('createLabel');
				const newLabels = [...rootLabels, newLabel];

				root.setLinkedRecords(newLabels, 'labels');

				if (leadID) {
					const lead = store.get(leadID);
					lead?.setLinkedRecords(newLabels, 'allLabels');
				}
			},
		});
	};

	return (
		<LabelsSelectForm
			title={translator.gettext('Create label')}
			data-testid="LabelsSelectCreateForm"
			onClose={onClose}
			onSave={onSaveHandler}
			initName={initName}
			initColor={initColor}
			isLoading={isLabelsCreationPending}
			inputErrorMessage={inputErrorMessage}
		/>
	);
};
