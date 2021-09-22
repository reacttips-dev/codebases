import React from 'react';
import { Dialog, Button, Spacing } from '@pipedrive/convention-ui-react';

import LockedDashboard from '../../utils/svg/LockedDashboard2.svg';
import { ModalType } from '../../utils/constants';

import styles from './LockedDialog.pcss';

interface LockedDialogProps {
	labels: {
		title: string;
		message: string;
		cancelButtonText: string;
		agreeButtonText: string;
		link: string;
	};
	setVisibleModal: React.Dispatch<React.SetStateAction<ModalType | boolean>>;
}

const LockedDialog: React.FC<LockedDialogProps> = ({
	labels: { title, message, cancelButtonText, agreeButtonText, link },
	setVisibleModal,
}) => {
	const handleClose = () => {
		setVisibleModal(false);
	};

	return (
		<Dialog
			actions={
				<>
					<Button onClick={handleClose}>{cancelButtonText}</Button>
					{agreeButtonText && (
						<Button
							color="green"
							href="/settings/subscription"
							onClick={handleClose}
						>
							{agreeButtonText}
						</Button>
					)}
				</>
			}
			visible
			closeOnEsc
			onClose={handleClose}
			className={styles.lockedDialog}
			data-test="locked-dialog"
		>
			<div className={styles.wrapper}>
				<LockedDashboard className={styles.icon} />
				<Spacing top="xl" bottom={link ? 's' : null}>
					{title && <h1 className={styles.title}>{title}</h1>}
					{/* eslint-disable-next-line react/no-danger */}
					<h2 dangerouslySetInnerHTML={{ __html: message }} />
				</Spacing>
				{link && (
					<a
						href="https://support.pipedrive.com/hc/en-us/articles/360001930658-Insights-feature-#C2"
						target="_blank"
						rel="noopener noreferrer"
						className={styles.link}
					>
						{link}
					</a>
				)}
			</div>
		</Dialog>
	);
};

export default LockedDialog;
