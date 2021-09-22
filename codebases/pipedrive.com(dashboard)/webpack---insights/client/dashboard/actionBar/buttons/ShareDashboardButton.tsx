import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { Button, Icon, Tooltip } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import { CoachmarkTags } from '../../../utils/constants';
import { trackDashboardInternalShareButtonClicked } from '../../../utils/metrics/share-dashboard-analytics';
import { Dashboard } from '../../../types/apollo-query-types';
import { isItemSharedWithOthers } from '../../../utils/sharingUtils';
import useOnboardingCoachmarks from '../../../utils/onboardingCoachmarkUtils';
import ConditionalWrapper from '../../../utils/ConditionalWrapper';
import Coachmark from '../../../atoms/Coachmark';
import { isViewInFocusVar } from '../../../api/vars/settingsApi';
import { getCurrentUserId } from '../../../api/webapp';

import styles from './ShareDashboardButton.pcss';

interface ShareDashboardButtonProps {
	dashboard: Dashboard;
	setShareModalVisible: (isVisible: boolean) => void;
}

const ShareDashboardButton: React.FC<ShareDashboardButtonProps> = ({
	dashboard,
	setShareModalVisible,
}) => {
	const translator = useTranslator();
	const { visible: coachMarkIsVisible, close: closeCoachmark } =
		useOnboardingCoachmarks()[
			CoachmarkTags.INSIGHTS_UPDATE_INTERNAL_SHARING_COACHMARK
		];

	const currentUserId = getCurrentUserId();
	const isDashboardSharedWithOthers = isItemSharedWithOthers(
		dashboard,
		currentUserId,
	);

	const isViewInFocus = useReactiveVar(isViewInFocusVar);

	const shareButton = (
		<Button
			className={styles.shareButton}
			color="green"
			onClick={() => {
				setShareModalVisible(true);
				trackDashboardInternalShareButtonClicked(dashboard.id);
				closeCoachmark();
			}}
			data-test="share-dashboard-button"
		>
			<Icon
				icon={isDashboardSharedWithOthers ? 'team' : 'share'}
				size="s"
			/>
			{isDashboardSharedWithOthers
				? translator.gettext('Shared')
				: translator.gettext('Share')}
		</Button>
	);

	if (coachMarkIsVisible) {
		return (
			<ConditionalWrapper
				condition={isViewInFocus}
				wrapper={(children) => (
					<Coachmark
						coachmark={
							CoachmarkTags.INSIGHTS_UPDATE_INTERNAL_SHARING_COACHMARK
						}
					>
						{children}
					</Coachmark>
				)}
			>
				{shareButton}
			</ConditionalWrapper>
		);
	}

	return (
		<Tooltip
			content={
				isDashboardSharedWithOthers
					? translator.gettext('Shared with other users')
					: translator.gettext('Not shared with other users yet')
			}
		>
			{shareButton}
		</Tooltip>
	);
};

export default ShareDashboardButton;
