import React, { useState, useCallback } from 'react';
import { Button, Icon, Tooltip } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import { ConfirmDialog } from 'Components/ConfirmDialog/ConfirmDialog';
import { Api } from 'Utils/api';
import styled from 'styled-components';
import { graphql, createFragmentContainer } from '@pipedrive/relay';

import { LabelsSelectDeleteConfirm_label } from './__generated__/LabelsSelectDeleteConfirm_label.graphql';

interface Props {
	readonly onDelete: () => void;
	readonly label: LabelsSelectDeleteConfirm_label;
}

// CUI is internally cloning the icon element and effectively makes it a target for closing the
// surrounding popup. That's unwanted behavior so we have to workaround it by disabling the
// pointer events.
const FixedButton = styled(Button)`
	.cui4-icon {
		pointer-events: none;
	}
`;

export const LabelsSelectDeleteConfirmWithoutData: React.FC<Props> = ({ onDelete, label: { legacyLabelID } }) => {
	const translator = useTranslator();
	const [isOpen, setOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [numberOfLeads, setNumberOfLeads] = useState(0);

	const closeModal = () => {
		setOpen(false);
	};

	const onConfirmHandler = useCallback(() => {
		setIsDeleting(true);
		onDelete();
		closeModal();
		setIsDeleting(false);
	}, [onDelete]);

	const openModal = useCallback(() => {
		// Eventually, we are going to query our GraphQL server here and we can remove even the
		// loading local states (useMutation returns isPending state itself).
		setIsLoading(true);
		Api.loadCount({
			labelIds: [legacyLabelID],
		}).then((totalCount) => {
			setNumberOfLeads(totalCount ?? 0);
			setOpen(true);
			setIsLoading(false);
		});
	}, [legacyLabelID]);

	return (
		<>
			<Tooltip content={translator.gettext('Remove label')} placement="top-start">
				<FixedButton
					color="ghost"
					onClick={openModal}
					loading={isLoading}
					data-testid="LabelSelectDeleteButton"
				>
					<Icon icon="trash" size="s" />
				</FixedButton>
			</Tooltip>

			<ConfirmDialog
				visible={isOpen}
				onClose={closeModal}
				confirmButtonText={translator.gettext('Delete')}
				color="red"
				text={
					numberOfLeads > 0
						? translator.ngettext(
								'This label is used in %1$d lead. Are you sure you want to delete it?',
								'This label is used in %1$d leads. Are you sure you want to delete it?',
								numberOfLeads,
								[numberOfLeads],
						  )
						: translator.gettext('Are you sure you want to delete this label?')
				}
				onConfirm={onConfirmHandler}
				isLoading={isDeleting}
			/>
		</>
	);
};

export const LabelsSelectDeleteConfirm = createFragmentContainer(LabelsSelectDeleteConfirmWithoutData, {
	label: graphql`
		fragment LabelsSelectDeleteConfirm_label on Label {
			legacyLabelID: id(opaque: false)
		}
	`,
});
