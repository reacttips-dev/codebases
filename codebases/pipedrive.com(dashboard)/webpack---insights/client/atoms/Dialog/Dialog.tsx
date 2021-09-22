import React, { useState } from 'react';
import {
	Dialog as CUIDialog,
	Button,
	Message,
	Spacing,
} from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import { getErrorMessage } from '../../utils/messagesUtils';

interface DialogProps {
	isVisible: boolean;
	labels: {
		title: string;
		message: string;
		cancelButtonText: string;
		agreeButtonText: string;
	};
	onCancel: () => void;
	onDiscard: () => Promise<void>;
}

const Dialog: React.FC<DialogProps> = ({
	isVisible,
	labels: { title, message, cancelButtonText, agreeButtonText },
	onCancel,
	onDiscard,
}) => {
	const t = useTranslator();
	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState<string | boolean>(false);

	const handleSave = async () => {
		setLoading(true);

		try {
			await onDiscard();
		} catch (err) {
			const errorMessage = getErrorMessage(t);

			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<CUIDialog
			title={title}
			actions={
				<>
					<Button onClick={onCancel} data-test="dialog-cancel-button">
						{cancelButtonText}
					</Button>
					<Button
						onClick={handleSave}
						color="red"
						disabled={isLoading}
						loading={isLoading}
						data-test="dialog-ok-button"
					>
						{agreeButtonText}
					</Button>
				</>
			}
			visible={isVisible}
			closeOnEsc
			onClose={onCancel}
		>
			{error && (
				<Message color="red" visible>
					{error}
				</Message>
			)}

			<Spacing top="m">
				{/* eslint-disable-next-line */}
				<p dangerouslySetInnerHTML={{ __html: message }} />
			</Spacing>
		</CUIDialog>
	);
};

export default Dialog;
