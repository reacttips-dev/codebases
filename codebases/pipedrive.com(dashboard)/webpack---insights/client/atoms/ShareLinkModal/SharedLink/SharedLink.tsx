import React, { useState, useMemo } from 'react';
// @ts-ignore
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
	Button,
	Input,
	Icon,
	Tooltip,
	Panel,
} from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import {
	trackDashboardLinkCopied,
	trackDashboardLinkRenamed,
} from '../../../utils/metrics/share-dashboard-analytics';
import useSettingsApi from '../../../hooks/useSettingsApi';
import { getErrorMessage } from '../../../utils/messagesUtils';
import EditLinkNamePopover from '../EditLinkNamePopover';
import { snackbarMessageVar } from '../../../api/vars/settingsApi';

import styles from './SharedLink.pcss';

export interface SharedLinkItem {
	id: string;
	name: string;
}

interface SharedLinkProps {
	link: SharedLinkItem;
	onDeleteButtonClicked: (link: SharedLinkItem) => void;
}

const SharedLink: React.FC<SharedLinkProps> = ({
	link,
	onDeleteButtonClicked,
}) => {
	const translator = useTranslator();
	const { updatePublicLink } = useSettingsApi();
	const [error, setError] = useState<string>(null);
	const [isLoading, setIsLoading] = useState(false);
	const url = `https://${window.location.hostname}/share/${link.id}`;
	const [isEditNamePopoverVisible, setEditNamePopoverVisibility] =
		useState(false);

	/**
	 * We need to remember if the popover is visible or not in order to disable the tooltip with the same trigger.
	 * Otherwise when you hover over popover contents the tooltip becomes visible as well.
	 */
	const editNameTooltipProps = useMemo(
		() => (isEditNamePopoverVisible ? { visible: false } : {}),
		[isEditNamePopoverVisible],
	);

	const onLinkCopied = () => {
		snackbarMessageVar(translator.gettext('Link copied to clipboard'));
		trackDashboardLinkCopied(link.id);
	};

	const copyToClipboardButton = (
		<Tooltip
			placement="top"
			content={<div>{translator.gettext('Copy to clipboard')}</div>}
		>
			<CopyToClipboard text={url} onCopy={onLinkCopied}>
				<Button className={styles.copyToClipboardButton}>
					<Icon icon="copy" size="s" />
				</Button>
			</CopyToClipboard>
		</Tooltip>
	);

	const onNameEdited = async (value: string) => {
		try {
			setIsLoading(true);
			setError(null);
			await updatePublicLink(link.id, {
				name: value,
			});
			setEditNamePopoverVisibility(false);
			trackDashboardLinkRenamed(link.id);
		} catch (err) {
			const errorMessage = getErrorMessage(translator);

			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const editNameButton = (
		<Tooltip
			placement="top"
			content={<div>{translator.gettext('Edit link name')}</div>}
			{...editNameTooltipProps}
		>
			<div>
				<EditLinkNamePopover
					inputValue={
						link.name || translator.gettext('Shared with...')
					}
					onSave={onNameEdited}
					isVisible={isEditNamePopoverVisible}
					onCancel={() => setEditNamePopoverVisibility(false)}
					isLoading={isLoading}
					setVisibility={setEditNamePopoverVisibility}
					error={error}
				>
					<Button
						className={styles.editNameButton}
						type="button"
						color="ghost"
						onClick={() => {
							setEditNamePopoverVisibility(true);
						}}
					>
						<Icon icon="pencil" size="s" />
					</Button>
				</EditLinkNamePopover>
			</div>
		</Tooltip>
	);

	const deleteButton = (
		<Tooltip
			placement="top"
			content={
				<div>{translator.gettext('Delete link and revoke access')}</div>
			}
		>
			<Button
				className={styles.deleteButton}
				onClick={() => {
					onDeleteButtonClicked(link);
				}}
			>
				<Icon icon="trash" size="s" />
			</Button>
		</Tooltip>
	);

	return (
		<Panel
			className={styles.linkCard}
			spacing="none"
			elevation="01"
			radius="s"
			noBorder
		>
			<div className={styles.linkNameContainer}>
				<p className={styles.linkTitle}>
					{link.name || translator.gettext('Shared with...')}
				</p>
				{editNameButton}
			</div>
			<li className={styles.inputContainer}>
				<Input
					className={styles.input}
					readOnly
					value={url}
					onFocus={(e) => e.target.select()}
					data-test="share-link-modal-link"
				/>
				{copyToClipboardButton}
				{deleteButton}
			</li>
		</Panel>
	);
};

export default SharedLink;
