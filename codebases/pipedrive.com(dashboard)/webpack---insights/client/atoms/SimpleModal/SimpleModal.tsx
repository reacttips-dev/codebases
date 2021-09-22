import React, { useState, useRef } from 'react';
import { Modal, Input, Button, Spacing } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import { NAME_MAX_LENGTH } from '../../utils/constants';
import ModalMessage from '../../atoms/ModalMessage';
import { getErrorMessage } from '../../utils/messagesUtils';

import styles from './SimpleModal.pcss';

interface SimpleModalProps {
	isVisible: boolean;
	onCancel: () => void;
	onSave: (value: string) => Promise<void>;
	inputValue: string;
	placeholder: string;
	header: string;
}

const SimpleModal: React.FC<SimpleModalProps> = ({
	isVisible = false,
	onCancel = () => {},
	onSave = () => {},
	inputValue = '',
	placeholder = '',
	header = '',
}) => {
	const t = useTranslator();
	const [value, setValue] = useState(inputValue);
	const [isValid, setValid] = useState(inputValue || false);
	const [error, setError] = useState<string | boolean>(false);
	const [isLoading, setLoading] = useState(false);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value: targetValue } = e.target;

		setValid(
			targetValue.length > 0 && targetValue.length <= NAME_MAX_LENGTH,
		);
		setValue(targetValue);
	};

	const resetModal = () => {
		setValid(false);
		setError(false);
	};

	const inputElement = useRef(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (isValid) {
			try {
				setLoading(true);
				setError(false);
				await onSave(value);
				resetModal();
			} catch (err) {
				const errorMessage = getErrorMessage(t);

				setError(errorMessage);
			} finally {
				setLoading(false);
				setValue('');
			}
		}
	};

	return (
		<Modal
			visible={isVisible}
			onClose={onCancel}
			closeOnEsc
			spacing="none"
			header={header}
			onBackdropClick={onCancel}
			onTransitionEnd={() => inputElement.current.focus()}
		>
			<form onSubmit={handleSubmit} autoComplete="off">
				{error && <ModalMessage content={error as string} />}
				<Spacing all="m">
					<Input
						value={value}
						placeholder={placeholder}
						onChange={handleInputChange}
						maxLength={NAME_MAX_LENGTH}
						inputRef={inputElement}
						data-test="simple-modal-input"
					/>
				</Spacing>
				<footer className="cui4-modal__footer">
					<div>
						<Button
							type="button"
							onClick={onCancel}
							data-test="simple-modal-cancel-button"
						>
							{t.gettext('Cancel')}
						</Button>
						<Button
							type="submit"
							color="green"
							className={styles.submit}
							disabled={!isValid || isLoading}
							loading={isLoading}
							data-test="simple-modal-ok-button"
						>
							{t.gettext('Save')}
						</Button>
					</div>
				</footer>
			</form>
		</Modal>
	);
};

export default SimpleModal;
