import React from 'react';
import { Message } from '@pipedrive/convention-ui-react';

import styles from './ModalMessage.pcss';

interface ModalMessageProps {
	content: string | React.ReactNode;
	isWarning?: boolean;
	onClose?: () => void;
}

const ModalMessage: React.FC<ModalMessageProps> = ({
	content,
	isWarning = false,
	onClose,
}) => {
	return (
		<Message
			color={isWarning ? 'yellow' : 'red'}
			icon="warning"
			visible
			alternative
			alignCenter
			className={styles.message}
			{...(onClose ? { onClose } : {})}
		>
			{content}
		</Message>
	);
};

export default ModalMessage;
