import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

export default function isJunkEmailEnabledByAdmin(): boolean {
    return !!getUserConfiguration().SegmentationSettings.JunkEMail;
}
