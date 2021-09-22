import { isBrowserIE } from 'owa-user-agent';

declare var ActiveXObject: any;

export default function isBrowserSupportActiveX(): boolean {
    if (isBrowserIE()) {
        try {
            new ActiveXObject('htmlfile');
            return true;
        } catch (e) {
            return false;
        }
    }
    return false;
}
