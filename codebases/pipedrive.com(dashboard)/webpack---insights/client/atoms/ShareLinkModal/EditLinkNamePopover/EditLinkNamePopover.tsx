import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Popover } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import { NAME_MAX_LENGTH } from '../../../utils/constants';
import ModalMessage from '../../../atoms/ModalMessage';

import styles from './EditLinkNamePopover.pcss';

interface EditLinkNamePopoverProps {
	inputValue: string;
	onSave: (name: string) => void;
	onCancel: () => void;
	isLoading: boolean;
	isVisible: boolean;
	setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
	error: string;
	children: any;
}

const EditLinkNamePopover: React.FC<EditLinkNamePopoverProps> = ({
	inputValue,
	onSave,
	onCancel,
	isLoading,
	isVisible,
	setVisibility,
	error,
	children,
}) => {
	const t = useTranslator();
	const [value, setValue] = useState(inputValue);
	const [isValid, setValid] = useState(inputValue || false);
	const inputElement = useRef(null);

	useEffect(() => {
		if (inputElement.current) {
			inputElement.current.focus();
		}
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value: targetValue } = e.target;

		setValid(
			targetValue.length > 0 && targetValue.length <= NAME_MAX_LENGTH,
		);
		setValue(targetValue);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave(value);
	};

	return (
		<Popover
			className={styles.popover}
			placement="bottom-start"
			visible={isVisible}
			onPopupVisibleChange={setVisibility}
			content={
				<>
					<div className={styles.popoverContent}>
						<form onSubmit={handleSubmit}>
							{error && <ModalMessage content={error} />}
							<div className={styles.editNameContainer}>
								<p className={styles.popoverTitle}>
									{t.gettext('Link name')}
								</p>
								<Input
									value={value}
									placeholder={t.gettext(
										'e.g. Shared with marketing',
									)}
									maxLength={NAME_MAX_LENGTH}
									onChange={handleInputChange}
									inputRef={inputElement}
									data-test="edit-shared-link-name-input"
								/>
							</div>
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
										disabled={!isValid || isLoading}
										className={styles.submit}
										loading={isLoading}
										data-test="simple-modal-ok-button"
									>
										{t.gettext('Save')}
									</Button>
								</div>
							</footer>
						</form>
					</div>
				</>
			}
		>
			{children}
		</Popover>
	);
};

export default EditLinkNamePopover;
