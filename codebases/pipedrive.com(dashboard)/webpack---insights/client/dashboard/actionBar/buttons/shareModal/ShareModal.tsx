import React, { useState } from 'react';
import {
	Avatar,
	Button,
	Icon,
	Modal,
	Spacing,
	Text,
	Tooltip,
} from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import { isEqual } from 'lodash';
import classNames from 'classnames';

import {
	Dashboard,
	SharingOption,
	SharingOptionType,
} from '../../../../types/apollo-query-types';
import { removeTypenames } from '../../../../utils/responseUtils';
import UserSelector from './UserSelector';
import { updateDashboardSharing } from '../../../../api/commands/dashboards';
import { trackDashboardInternallyShared } from '../../../../utils/metrics/share-dashboard-analytics';
import { snackbarMessageVar } from '../../../../api/vars/settingsApi';
import { getTeams, getUsers } from '../../../../api/webapp';

import styles from './ShareModal.pcss';

interface ShareModalProps {
	dashboard: Dashboard;
	isVisible: boolean;
	onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({
	isVisible,
	onClose,
	dashboard,
}) => {
	const translator = useTranslator();
	const [sharingOptions, setSharingOptions] = useState<SharingOption[]>(
		dashboard.shared_with || [],
	);
	const companyUsers = getUsers();
	const teams = getTeams();

	const removeUserById = (entityId: number) => {
		setSharingOptions(
			sharingOptions.filter(
				(option) => option !== null && option?.id !== entityId,
			),
		);
	};

	const updateSharingOptions = (type: SharingOptionType, id?: number) => {
		if (typeof id === 'undefined' || id === null) {
			return;
		}

		const existingOption = sharingOptions.find(
			(option) => option?.id === id && option?.type === type,
		);

		if (!existingOption) {
			setSharingOptions([
				...sharingOptions,
				{ id, type, can_edit: false },
			]);
		}
	};

	const onSave = () => {
		if (!isEqual(sharingOptions, dashboard.shared_with)) {
			updateDashboardSharing(
				dashboard.id,
				removeTypenames(sharingOptions),
			);

			snackbarMessageVar(translator.gettext('Dashboard sharing updated'));

			const addedOptions = sharingOptions.filter(
				(option) => !dashboard.shared_with?.includes(option),
			);

			if (addedOptions.length > 0) {
				trackDashboardInternallyShared(dashboard.id, addedOptions);
			}
		}

		onClose();
	};

	const dashboardOwner = companyUsers.find(
		(user: Pipedrive.User) => user.id === dashboard.user_id,
	);

	const renderMeta = (option: SharingOption, entityId: number) => (
		<div className={styles.meta}>
			<div className={styles.rights}>
				{option.can_edit
					? translator.gettext('Editor')
					: translator.gettext('Viewer')}
			</div>
			<Tooltip
				placement="top"
				content={translator.gettext('Remove access')}
			>
				<Button
					onClick={() => removeUserById(entityId)}
					size="s"
					data-test={`unshare-button-${entityId}`}
				>
					<Icon icon="trash" size="s" />
				</Button>
			</Tooltip>
		</div>
	);

	return (
		<Modal
			visible={isVisible}
			onClose={onClose}
			onBackdropClick={onClose}
			header={translator.pgettext(
				'Share dashboard [Dashboard name]',
				'Share dashboard %s',
				dashboard.name,
			)}
			footer={
				<div>
					<Button
						onClick={() => {
							setSharingOptions(dashboard.shared_with);
							onClose();
						}}
						data-test="share-link-modal-cancel-button"
					>
						{translator.gettext('Cancel')}
					</Button>
					<Button
						type="submit"
						className={styles.submitButton}
						color="green"
						onClick={onSave}
						data-test="share-link-modal-done-button"
						disabled={isEqual(
							sharingOptions,
							dashboard.shared_with,
						)}
					>
						{translator.gettext('Save')}
					</Button>
				</div>
			}
		>
			<div className={styles.container}>
				<Text>
					<p>
						{translator.gettext(
							'Share this dashboard with other users in your company',
						)}
					</p>
				</Text>

				<UserSelector
					selectedOptions={sharingOptions}
					onAdd={updateSharingOptions}
				/>

				<Spacing vertical="s">
					{dashboardOwner && (
						<div
							className={styles.userRow}
							data-test="share-modal-owner-row"
						>
							<div className={styles.name}>
								<Avatar
									size="s"
									img={dashboardOwner.icon_url}
									type={SharingOptionType.USER}
								/>
								{dashboardOwner.name}
							</div>
							<div className={styles.meta}>
								<div className={styles.rights}>
									{translator.gettext('Owner')}
								</div>
							</div>
						</div>
					)}
					{sharingOptions &&
						sharingOptions.map((option) => {
							if (option.type === SharingOptionType.EVERYONE) {
								return (
									<div
										key={option.type}
										className={styles.userRow}
									>
										<div
											className={classNames(
												styles.name,
												styles.everyoneName,
											)}
										>
											{translator.gettext('Everyone')}
										</div>
										{renderMeta(option, 0)}
									</div>
								);
							}

							const user = [...companyUsers, ...teams].find(
								(companyUser) => companyUser.id === option?.id,
							);

							if (!user) {
								return null;
							}

							return (
								<div
									key={user.id}
									className={styles.userRow}
									data-test="share-modal-other-user-row"
								>
									<div className={styles.name}>
										<Avatar
											size="s"
											type={option.type}
											img={
												(user as Pipedrive.User)
													.icon_url
											}
										/>
										{user.name}
									</div>
									{renderMeta(option, user.id)}
								</div>
							);
						})}
				</Spacing>
			</div>
		</Modal>
	);
};

export default ShareModal;
