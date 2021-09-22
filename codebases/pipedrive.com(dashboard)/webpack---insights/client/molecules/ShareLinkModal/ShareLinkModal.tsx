import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import classNames from 'classnames';
import { Modal, Spinner } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import ErrorMessage from '../../molecules/ErrorMessage';
import {
	trackDashboardLinkCreated,
	trackDashboardLinkDeleted,
} from '../../utils/metrics/share-dashboard-analytics';
import useSettingsApi from '../../hooks/useSettingsApi';
import NoSharedLinks from '../../atoms/ShareLinkModal/NoSharedLinks';
import SharedLinksList from '../../atoms/ShareLinkModal/SharedLinksList';
import DeleteLinkDialog from '../../atoms/ShareLinkModal/DeleteLinkDialog';
import ShareLinkModalFooter from '../../atoms/ShareLinkModal/ShareLinkModalFooter';
import { GET_PUBLIC_LINKS } from '../../api/graphql';
import { SharedLinkItem } from '../../atoms/ShareLinkModal/SharedLink/SharedLink';
import { getSelectedItemId } from '../../utils/localState/settingsApiState';

import styles from './ShareLinkModal.pcss';

interface ShareLinkModalProps {
	isVisible: boolean;
	onCancel: () => void;
	dashboardName: string;
}

const ShareLinkModal: React.FC<ShareLinkModalProps> = ({
	isVisible,
	onCancel,
	dashboardName,
}) => {
	const translator = useTranslator();
	const { createPublicLink, deletePublicLink } = useSettingsApi();
	const [hasError, setError] = useState(false);
	const [isLinkCreationLoading, setLinkCreationLoading] = useState(false);
	const [selectedLink, setSelectedLink] = useState({ id: null, name: null });
	const [
		isDeleteConfirmationDialogVisible,
		setDeleteConfirmationDialogVisibility,
	] = useState(false);
	const [hasRoundedCorners, setRoundedCorners] = useState(false);
	const selectedItemId = getSelectedItemId();

	const isPublicLinksDataValid = (data: any) => {
		return data && data.publicLinks && data.publicLinks.data;
	};

	const getModal = () => document.querySelector('div.cui4-modal__wrap');

	const updateModalStyles = () => {
		setRoundedCorners(
			(getModal() as any).offsetHeight === window.innerHeight,
		);
	};

	useEffect(() => {
		updateModalStyles();

		window.addEventListener('resize', updateModalStyles, false);

		return () => {
			window.removeEventListener('resize', updateModalStyles, false);
		};
	}, []);

	const linkActions = {
		ADD: {
			onButtonClick: async () => {
				try {
					setLinkCreationLoading(true);

					const result = await createPublicLink();

					trackDashboardLinkCreated(selectedItemId, result.id);
					updateModalStyles();
				} catch (err) {
					setError(true);
				} finally {
					setLinkCreationLoading(false);
				}
			},
		},
		DELETE: {
			onButtonClick: (link: SharedLinkItem) => {
				setSelectedLink(link);
				setDeleteConfirmationDialogVisibility(true);
			},
			onConfirmationDialogClose: () =>
				setDeleteConfirmationDialogVisibility(false),
			onConfirm: async () => {
				try {
					await deletePublicLink(selectedLink.id);
					updateModalStyles();
					setDeleteConfirmationDialogVisibility(false);
					trackDashboardLinkDeleted(selectedItemId, selectedLink.id);
				} catch (error) {
					setError(true);
				}
			},
		},
	};

	const modalHeaderText = (publicLinks: SharedLinkItem[]) => {
		return publicLinks.length === 0
			? translator.gettext('Share dashboard %s as public link', [
					dashboardName,
			  ])
			: translator.gettext('%s - public links (%s)', [
					dashboardName,
					publicLinks.length,
			  ]);
	};

	const { loading, error, data } = useQuery(GET_PUBLIC_LINKS, {
		variables: { dashboardId: selectedItemId },
	});

	if (error) {
		setError(true);
	}

	let publicLinks = [];

	if (isPublicLinksDataValid(data)) {
		publicLinks = data.publicLinks.data;
	}

	return (
		<Modal
			className={classNames(styles.modalWrapper, {
				[styles.modalWrapperNotRoundedBorders]: hasRoundedCorners,
			})}
			visible={isVisible}
			onClose={onCancel}
			closeOnEsc={!isDeleteConfirmationDialogVisible}
			spacing="none"
			header={modalHeaderText(publicLinks)}
			onBackdropClick={onCancel}
		>
			<div className={styles.shareLinkModalContainer}>
				{loading && (
					<div className={styles.loadingSpinnerContainer}>
						{/* @ts-ignore */}
						<Spinner size="m" />
					</div>
				)}
				{hasError && <ErrorMessage allowed />}
				{publicLinks.length === 0 ? (
					<NoSharedLinks
						isLoading={isLinkCreationLoading}
						onAddLinkClicked={linkActions.ADD.onButtonClick}
					/>
				) : (
					<>
						<SharedLinksList
							isLoading={isLinkCreationLoading}
							publicLinks={publicLinks}
							onAddLinkClicked={linkActions.ADD.onButtonClick}
							onDeleteButtonClicked={
								linkActions.DELETE.onButtonClick
							}
							data-test="shared-links-container"
						/>
						{isDeleteConfirmationDialogVisible && (
							<DeleteLinkDialog
								onClose={
									linkActions.DELETE.onConfirmationDialogClose
								}
								onConfirm={linkActions.DELETE.onConfirm}
								linkName={selectedLink.name}
							/>
						)}
					</>
				)}
			</div>
			<ShareLinkModalFooter onDone={onCancel} />
		</Modal>
	);
};

export default ShareLinkModal;
