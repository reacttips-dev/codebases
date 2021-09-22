import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

export default function isInboxRuleEnabledByAdmin(): boolean {
    return !!getUserConfiguration().SegmentationSettings.Rules;
}
