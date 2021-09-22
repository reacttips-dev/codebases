import React, { useState } from 'react';

import styles from './style.scss';
import translator from 'utils/translator';
import FeedbackModal from './FeedbackModal';

function FeedbackLink() {
	const [modalVisible, setModalVisible] = useState(false);

	const closeModal = () => {
		setModalVisible(false);
	};

	const catchLink = (e) => {
		if (e.target.dataset.type === 'link') {
			setModalVisible(true);
		}
	};

	return (
		<>
			<div
				// eslint-disable-next-line react/no-danger
				dangerouslySetInnerHTML={{
					__html: translator.pgettext(
						'Help us improve search and [htmlTag]give feedback[htmlTag]',
						'Help us improve search and %sgive feedback%s',
						[`<span data-type="link">`, `</span>`],
					),
				}}
				onClick={catchLink}
				className={styles.feedbackLink}
			/>
			<FeedbackModal modalVisible={modalVisible} closeModal={closeModal}></FeedbackModal>
		</>
	);
}

export default FeedbackLink;
