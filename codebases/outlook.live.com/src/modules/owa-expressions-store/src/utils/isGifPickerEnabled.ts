import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

export default function isGifPickerEnabled(): boolean {
    const { OutlookGifPickerDisabled } = getUserConfiguration().UserOptions;
    return !OutlookGifPickerDisabled;
}
