import React, { useState } from 'react';
import { Modal, Button, Select, Textarea, Checkbox, Spacing, Snackbar } from '@pipedrive/convention-ui-react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './style.scss';
import translator from 'utils/translator';
import track from 'utils/tracking';
import { SEARCH_MODAL_ELEMENT } from 'hooks/browser';

const DEFAULT_CAN_CONTACT_ME = true;

const selectOptions = [
	{ key: 'Leave a comment', text: translator.gettext('Leave a comment') },
	{ key: 'Report a bug', text: translator.gettext('Report a bug') },
	{ key: 'Suggest an improvement', text: translator.gettext('Suggest an improvement') },
];

function FeedbackModal({ modalVisible, closeModal }) {
	const [selectValue, setSelectValue] = useState('');
	const [message, setMessage] = useState('');
	const [canContactMeChecked, setCanContactMeChecked] = useState(DEFAULT_CAN_CONTACT_ME);
	const [snackbarVisible, setSnackbarVisibility] = useState(false);
	const [inputError, setInputError] = useState(false);

	const onModalSubmit = () => {
		if (!message) {
			setInputError(true);
			return;
		}

		const data = {
			feedbackCategory: selectValue,
			comment: message,
			canContactMeChecked,
		};

		track.searchFeedbackSubmitted(data);
		setSnackbarVisibility(true);
		setSelectValue('');
		setMessage('');
		setCanContactMeChecked(DEFAULT_CAN_CONTACT_ME);
		closeModal();
	};

	const onSelectChange = (key) => {
		setInputError(false);
		setSelectValue(key);
	};

	const onTextAreaChange = (e) => {
		setInputError(false);
		setMessage(e.target.value);
	};

	const handleCanContactMeChange = () => {
		setCanContactMeChecked(!canContactMeChecked);
	};

	return (
		<div onClick={preventSearchClickOutside}>
			<Modal
				visible={modalVisible}
				onClose={closeModal}
				header={translator.gettext('Feedback about search')}
				closeOnEsc
				footer={
					<>
						<div className={styles.modalButtons}>
							<Button onClick={closeModal}>{translator.gettext('Cancel')}</Button>
							<Button
								className={classNames(styles.submitButton, !message && styles.disabledButton)}
								color="green"
								onClick={onModalSubmit}
							>
								{translator.gettext('Send feedback')}
							</Button>
						</div>
					</>
				}
			>
				<div className={styles.modalContents}>
					<Spacing bottom="xs">{translator.gettext('I want to...')}</Spacing>
					<Select
						className={styles.categorySelect}
						required
						placeholder={translator.gettext('Select an option')}
						value={selectValue}
						onChange={onSelectChange}
					>
						{selectOptions.map(({ key, text }) => (
							<Select.Option key={key} value={key} className={SEARCH_MODAL_ELEMENT}>
								<div onClick={preventSearchClickOutside}>{text}</div>
							</Select.Option>
						))}
					</Select>
					{selectValue && (
						<>
							<Spacing bottom="xs" top="m">
								{translator.gettext('Let us know what’s on your mind')}
							</Spacing>
							<Textarea
								onChange={onTextAreaChange}
								value={message}
								color={inputError && 'red'}
								message={inputError && translator.gettext('This field is required.')}
							></Textarea>
							<Spacing top="m">
								<Checkbox checked={canContactMeChecked} onChange={handleCanContactMeChange}>
									{translator.gettext('Pipedrive can contact me about this feedback')}
								</Checkbox>
							</Spacing>
						</>
					)}
				</div>
			</Modal>
			{snackbarVisible && (
				<Snackbar
					message={translator.gettext('Feedback sent. Thank you! ')}
					onDismiss={() => setSnackbarVisibility(false)}
				/>
			)}
		</div>
	);
}

FeedbackModal.propTypes = {
	closeModal: PropTypes.func.isRequired,
	modalVisible: PropTypes.bool.isRequired,
};

export default FeedbackModal;

function preventSearchClickOutside(e) {
	e.nativeEvent.stopImmediatePropagation();
}
