import {
    followLink,
    ctrlClickMac,
    ctrlClickWindows,
} from '../components/ReactEditor.locstring.json';
import { isMac } from 'owa-user-agent/lib/userAgent';
import loc, { format } from 'owa-localize';

export function getClickableLinkTooltip(href: string) {
    const clickableLinkTooltip = format(
        loc(followLink),
        isMac() ? loc(ctrlClickMac) : loc(ctrlClickWindows)
    );
    return clickableLinkTooltip + '\r\n' + href;
}
