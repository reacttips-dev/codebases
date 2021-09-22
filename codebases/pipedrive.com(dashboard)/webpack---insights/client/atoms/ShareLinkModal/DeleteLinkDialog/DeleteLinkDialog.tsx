import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';
import { Dialog, Button } from '@pipedrive/convention-ui-react';

interface DeleteLinkDialogProps {
	onClose: () => void;
	onConfirm: () => void;
	linkName: string;
}

const DeleteLinkDialog: React.FC<DeleteLinkDialogProps> = ({
	onClose,
	onConfirm,
	linkName,
}) => {
	const t = useTranslator();
	const titleText = linkName
		? t.gettext('Are you sure you want to delete "%s" link?', linkName)
		: t.gettext('Are you sure you want to delete "Shared with..." link?');

	return (
		<Dialog
			title={titleText}
			onClose={onClose}
			actions={
				<>
					<Button onClick={onClose}>{t.gettext('Cancel')}</Button>
					<Button onClick={onConfirm} color="red">
						{t.gettext('Delete')}
					</Button>
				</>
			}
			visible
		>
			{t.gettext(
				'Everyone who has the link will lose access to this dashboard.',
			)}
		</Dialog>
	);
};

export default DeleteLinkDialog;
