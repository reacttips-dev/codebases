import React from 'react';
import classNames from 'classnames';
import { Spacing, Button, Icon } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import styles from './GoalDetailsModalFooter.pcss';

interface GoalDetailsModalFooterProps {
	onSave: () => void;
	onCancel: () => void;
	onBack?: () => void;
	isBackButtonVisible: boolean;
	isContinueButtonDisabled: boolean;
	loading: boolean;
}

const GoalDetailsModalFooter: React.FC<GoalDetailsModalFooterProps> = ({
	onSave,
	onCancel,
	onBack,
	isBackButtonVisible,
	isContinueButtonDisabled,
	loading,
}) => {
	const translator = useTranslator();

	return (
		<div
			className={classNames(styles.footer, {
				[styles.footerNoBackButton]: !isBackButtonVisible,
			})}
		>
			{isBackButtonVisible && (
				<Button onClick={onBack}>
					<Icon icon="arrow-back" size="s" />
					{translator.gettext('Previous step')}
				</Button>
			)}
			<div>
				<Spacing right="s" display="inline">
					<Button onClick={onCancel}>
						{translator.gettext('Cancel')}
					</Button>
				</Spacing>
				<Button
					color="green"
					disabled={isContinueButtonDisabled}
					onClick={onSave}
					loading={loading}
					data-test="goal-details-modal-save-button"
				>
					{translator.gettext('Save')}
				</Button>
			</div>
		</div>
	);
};

export default GoalDetailsModalFooter;
