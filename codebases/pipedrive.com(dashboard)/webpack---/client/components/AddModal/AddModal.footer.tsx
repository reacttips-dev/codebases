import React, { useContext } from 'react';
import { Button } from '@pipedrive/convention-ui-react';
import { ModalType, UsageCaps } from 'Types/types';
import { isEmpty } from 'lodash';

import { ModalContext } from './AddModal.context';
import { CappingCounter } from '../Capping/CappingCounter';
import ConditionalTooltip from '../Shared/ConditionalTooltip';

import styles from './AddModal.pcss';

interface Props {
	modalType: ModalType;
	isSaving: boolean;
	isSavingDisabled: boolean;
	onClose: () => void;
	onSave: () => void;
	usageCaps: UsageCaps;
	usageCapsMapping: any;
	isAccountSettingsEnabled: boolean;
	cappingError: boolean;
	isReseller: boolean;
}

export const Footer: React.FC<Props> = ({
	isSavingDisabled,
	isSaving,
	onClose,
	onSave,
	usageCaps,
	usageCapsMapping,
	isAccountSettingsEnabled,
	cappingError,
	isReseller,
}) => {
	const { translator, features } = useContext(ModalContext);
	const { dealsUsageCapping } = features;
	const tooltipText = isAccountSettingsEnabled
		? translator.gettext('Open deals limit reached. Upgrade plan to keep adding deals.')
		: translator.gettext('Open deals limit reached. Contact an admin user to continue adding deals.');

	translator.gettext('Open deals limit reached. Upgrade plan to keep adding deals.');
	translator.gettext('Open deals limit reached. Contact an admin user to continue adding deals.');
	translator.gettext('Your company has exceeded the open deals limit. View usage details or upgrade now.');
	translator.gettext(
		'Your company has exceeded the open deals limit. View usage details or contact an admin user to upgrade now.',
	);

	return (
		<div className={styles.footer} data-test="add-modals-footer">
			{dealsUsageCapping && !isEmpty(usageCaps) && usageCaps.isCapped && (
				<CappingCounter
					usageCaps={usageCaps}
					usageCapsMapping={usageCapsMapping}
					isAccountSettingsEnabled={isAccountSettingsEnabled}
					isReseller={isReseller}
				/>
			)}
			<Button onClick={onClose} data-test="add-modals-cancel-button">
				{translator.gettext('Cancel')}
			</Button>
			<ConditionalTooltip condition={cappingError} placement="bottom" content={tooltipText}>
				<span className={styles.confirmButtonWrapper}>
					<Button
						data-test="add-modals-save"
						data-coachmark="add-modals-save"
						color="green"
						className={styles.confirmButton}
						disabled={isSavingDisabled}
						loading={isSaving}
						onClick={onSave}
						style={{
							pointerEvents: cappingError ? 'none' : 'inherit',
							width: '100%',
						}}
					>
						{translator.gettext('Save')}
					</Button>
				</span>
			</ConditionalTooltip>
		</div>
	);
};
