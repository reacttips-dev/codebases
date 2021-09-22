import { useCoachmark } from '@pipedrive/use-coachmark';
import { useTranslator } from '@pipedrive/react-utils';
import { PopoverProps } from '@pipedrive/convention-ui-react';

import { CoachmarkTags } from './constants';
import { hasPermission, PERMISSIONS } from '../api/webapp';

function useOnboarding(): {
	[key: string]: {
		visible: any;
		close: () => any;
		content?: string;
		placement?: PopoverProps['placement'];
	};
} {
	const translator = useTranslator();
	const introDialog = useCoachmark(
		CoachmarkTags.INSIGHTS_ONBOARDING_INTRO_DIALOG,
	);
	const customizeReportCoachmark = useCoachmark(
		CoachmarkTags.INSIGHTS_ONBOARDING_CUSTOMIZE_REPORT_COACHMARK,
	);
	const changeReportViewByCoachmark = useCoachmark(
		CoachmarkTags.INSIGHTS_ONBOARDING_CUSTOMIZE_REPORT_VIEW_BY_COACHMARK,
	);
	const publicShareCoachmark = useCoachmark(
		CoachmarkTags.INSIGHTS_ONBOARDING_SHARING_DASHBOARD_COACHMARK,
	);
	const internalShareCoachmark = useCoachmark(
		CoachmarkTags.INSIGHTS_UPDATE_INTERNAL_SHARING_COACHMARK,
	);
	const cappingCoachmark = useCoachmark(
		CoachmarkTags.INSIGHTS_CAPPING_COACHMARK,
	);

	const canSeePublicShareCoachmark = hasPermission(PERMISSIONS.shareInsights);

	const hasSeenIntroDialog = !introDialog.visible;
	const hasSeenCustomizeReportCoachmark = !customizeReportCoachmark.visible;
	const hasSeenPublicShareCoachmark = !publicShareCoachmark.visible;
	const hasSeenInternalShareCoachmark = !internalShareCoachmark.visible;
	const hasSeenCappingCoachmark = !cappingCoachmark.visible;

	return {
		[CoachmarkTags.INSIGHTS_ONBOARDING_INTRO_DIALOG]: {
			visible: !hasSeenIntroDialog,
			close: introDialog.close,
		},
		[CoachmarkTags.INSIGHTS_ONBOARDING_CUSTOMIZE_REPORT_COACHMARK]: {
			visible: hasSeenIntroDialog && !hasSeenCustomizeReportCoachmark,
			close: customizeReportCoachmark.close,
			content: translator.gettext('Click to customize the report'),
			placement: 'top-end',
		},
		[CoachmarkTags.INSIGHTS_ONBOARDING_CUSTOMIZE_REPORT_VIEW_BY_COACHMARK]:
			{
				visible:
					hasSeenIntroDialog &&
					hasSeenCustomizeReportCoachmark &&
					changeReportViewByCoachmark.visible,
				close: changeReportViewByCoachmark.close,
				content: translator.gettext('Select how you view your results'),
				placement: 'top',
			},
		[CoachmarkTags.INSIGHTS_ONBOARDING_SHARING_DASHBOARD_COACHMARK]: {
			visible:
				canSeePublicShareCoachmark &&
				hasSeenIntroDialog &&
				hasSeenCustomizeReportCoachmark &&
				!hasSeenPublicShareCoachmark,

			close: publicShareCoachmark.close,
			content: translator.gettext('Share dashboard with anyone'),
			placement: 'bottom-end',
		},
		[CoachmarkTags.INSIGHTS_UPDATE_INTERNAL_SHARING_COACHMARK]: {
			visible:
				hasSeenIntroDialog &&
				hasSeenCustomizeReportCoachmark &&
				(canSeePublicShareCoachmark
					? hasSeenPublicShareCoachmark
					: true) &&
				!hasSeenInternalShareCoachmark,
			close: internalShareCoachmark.close,
			content: translator.gettext('Share dashboards with other users'),
			placement: 'bottom',
		},
		[CoachmarkTags.INSIGHTS_CAPPING_COACHMARK]: {
			visible: !hasSeenCappingCoachmark,
			close: cappingCoachmark.close,
			content: translator.gettext(
				'Add new reports, dashboards and goals is now moved here',
			),
			placement: 'right',
		},
	};
}

export default useOnboarding;
