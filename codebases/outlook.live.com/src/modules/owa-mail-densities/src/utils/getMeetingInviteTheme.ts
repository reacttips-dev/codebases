import type { PartialTheme } from '@fluentui/theme';
import isFeatureEnabled from 'owa-feature-flags/lib/utils/isFeatureEnabled';

export function getMeetingInviteTheme(
    densityModeString: string,
    isSingleLineView: boolean
): PartialTheme {
    switch (densityModeString) {
        case 'compact':
            return isSingleLineView
                ? meetingInviteTheme('20px', '12px', '1px 6px', isSingleLineView)
                : meetingInviteTheme('24px', '12px', '4px 6px');
        case 'medium':
            return isSingleLineView
                ? meetingInviteTheme('24px', '12px', '2px 8px', isSingleLineView)
                : meetingInviteTheme('28px', '12px', '4px 8px');
        case 'full':
            return isSingleLineView
                ? meetingInviteTheme('28px', '14px', '7px 12px', isSingleLineView)
                : meetingInviteTheme(
                      isFeatureEnabled('mon-tri-mailListMeetingInvite') ? '32px' : '28',
                      '14px',
                      '6px 10px'
                  );
        default:
            return {};
    }
}

const meetingInviteTheme = (
    height: string,
    fontSize: string,
    padding: string,
    isSingleLineView?: boolean
) => {
    return {
        components: {
            DefaultButton: {
                styles: {
                    root: {
                        height: height,
                        fontSize: fontSize,
                        marginRight: !isSingleLineView && '5px',
                        minWidth: 'auto',
                        padding: padding,
                    },
                    flexContainer: {
                        height: 'auto',
                    },
                },
            },
        },
    };
};
