import React from 'react';
import { useQuery, useReactiveVar } from '@apollo/client';
import { get } from 'lodash';
import { useTranslator } from '@pipedrive/react-utils';
import { Icon, Button, Tooltip } from '@pipedrive/convention-ui-react';

import { trackDashboardLinksListHovered } from '../../utils/metrics/share-dashboard-analytics';
import { PERMISSIONS, hasPermission } from '../../api/webapp';
import { CoachmarkTags } from '../../utils/constants';
import { GET_PUBLIC_LINKS } from '../../api/graphql';
import Coachmark from '../Coachmark';
import useOnboardingCoachmarks from '../../utils/onboardingCoachmarkUtils';
import ConditionalWrapper from '../../utils/ConditionalWrapper';
import { isViewInFocusVar } from '../../api/vars/settingsApi';
import { getSelectedItemId } from '../../utils/localState/settingsApiState';

import styles from './SharePublicLinksButton.pcss';

const SharePublicLinksButton = ({
	onButtonClick,
	disabled = false,
}: {
	onButtonClick: () => void;
	disabled?: boolean;
}) => {
	const translator = useTranslator();
	const selectedItemId = getSelectedItemId();

	const { INSIGHTS_ONBOARDING_SHARING_DASHBOARD_COACHMARK } = CoachmarkTags;

	const { visible: coachMarkIsVisible } =
		useOnboardingCoachmarks()[
			INSIGHTS_ONBOARDING_SHARING_DASHBOARD_COACHMARK
		];

	const isViewInFocus = useReactiveVar(isViewInFocusVar);

	const getButton = (publicLinksCount?: number) => (
		<div
			className={styles.shareLinksButtonWrapper}
			onMouseEnter={trackDashboardLinksListHovered}
		>
			<Button
				onClick={onButtonClick}
				disabled={!hasPermission(PERMISSIONS.shareInsights) || disabled}
				className={styles.shareLinksButton}
				data-test="share-button"
			>
				<Icon icon="link" size="s" />
				{publicLinksCount > 0
					? translator.gettext('Public links (%s)', [
							publicLinksCount,
					  ])
					: translator.gettext('Public link')}
			</Button>
		</div>
	);

	const shareDashboardButton = (publicLinksCount?: number) => {
		return (
			<ConditionalWrapper
				condition={coachMarkIsVisible && isViewInFocus}
				wrapper={(children) => (
					<Coachmark
						coachmark={
							INSIGHTS_ONBOARDING_SHARING_DASHBOARD_COACHMARK
						}
					>
						{children}
					</Coachmark>
				)}
			>
				{getButton(publicLinksCount)}
			</ConditionalWrapper>
		);
	};

	const { data } = useQuery(GET_PUBLIC_LINKS, {
		variables: { dashboardId: selectedItemId },
		skip: !hasPermission(PERMISSIONS.shareInsights),
	});

	if (data) {
		return shareDashboardButton(get(data, 'publicLinks.data', []).length);
	}

	return (
		<Tooltip
			placement="bottom"
			content={
				<span>
					{translator.gettext('Ask an admin user for permission')}
				</span>
			}
		>
			<div className={styles.shareDashboardButtonWrapper}>
				{shareDashboardButton()}
			</div>
		</Tooltip>
	);
};

export default SharePublicLinksButton;
