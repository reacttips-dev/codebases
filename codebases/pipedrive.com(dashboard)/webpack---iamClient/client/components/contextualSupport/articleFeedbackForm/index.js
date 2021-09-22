import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import translate from 'containers/translation';
import VotingControl from './votingControl';
import { Button, Textarea, Checkbox } from '@pipedrive/convention-ui-react';

import style from './style.css';

const MESSAGE_LENGTH_MIN_CHARS = 2;

function articleFeedbackForm({
	gettext,
	onVote,
	onSubmit,
	isSubmitting,
	submitted,
	failed,
}) {
	const textInput = useRef(null);

	const [activeVote, setActiveVote] = useState(null);
	const [message, setMessage] = useState('');
	const [canContactUser, setCanContactUser] = useState(false);

	const isPositiveVote = (vote) => vote > 0;

	const handleVoteClick = (vote) => {
		if (vote === activeVote) {
			/* reset the form if vote retracted */
			setActiveVote(null);
			setMessage('');
			setCanContactUser(false);

			return;
		}

		setActiveVote(vote);
		onVote(isPositiveVote(vote));
	};

	const handleTextareaChange = (event) => {
		setMessage(event.target.value);
	};

	const handleCheckboxChange = () => {
		setCanContactUser(!canContactUser);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		onSubmit(message, isPositiveVote(activeVote), canContactUser);
	};

	const showMessageInput = activeVote && !submitted;
	const messageLabel = isPositiveVote(activeVote) ? gettext('What did you find helpful?') : gettext('How can we improve this article?');
	const canSubmit = activeVote && message.length >= MESSAGE_LENGTH_MIN_CHARS;

	useEffect(() => {
		if (activeVote && !isSubmitting && !submitted) {
			textInput.current?.focus();
		}
	}, [activeVote, isSubmitting, submitted]);

	return (
		<div className={style.ArticleFeedbackForm}>
			<div className={style.ArticleFeedbackForm__header}>
				{gettext('Was this article helpful?')}
			</div>
			<VotingControl
				activeVote={activeVote}
				onVoteButtonClick={handleVoteClick}
			/>
			{showMessageInput &&
				<>
					<Textarea
						inputRef={textInput}
						className={style.ArticleFeedbackForm__textarea}
						label={messageLabel}
						placeholder={gettext('Leave your feedback here')}
						value={message}
						message={failed ? gettext('Message could not be sent, try again later') : null}
						color={failed ? 'red' : null}
						onChange={handleTextareaChange}
					/>
					<Checkbox
						className={style.ArticleFeedbackForm__checkbox}
						checked={canContactUser}
						onChange={handleCheckboxChange}
					>
						{gettext('Pipedrive can contact me about this feedback')}
					</Checkbox>
					<div className={style.ArticleFeedbackForm__submitButtonWrapper}>
						<Button
							color="green"
							loading={isSubmitting}
							onClick={handleSubmit}
							disabled={!canSubmit}
						>
							{gettext('Submit')}
						</Button>
					</div>
				</>}
			{submitted &&
				<div className={style.ArticleFeedbackForm__successMessage}>
					{gettext('Thank you for your feedback!')}
				</div>}
		</div>
	);
}

articleFeedbackForm.propTypes = {
	gettext: PropTypes.func.isRequired,
	onVote: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	isSubmitting: PropTypes.bool.isRequired,
	submitted: PropTypes.bool.isRequired,
	failed: PropTypes.bool.isRequired,
};

export const ArticleFeedbackForm = articleFeedbackForm;
export default translate()(articleFeedbackForm);