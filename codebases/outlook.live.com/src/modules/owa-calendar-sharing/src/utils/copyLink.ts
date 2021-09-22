import {
    options_publishedCalendars_CopyLink_Mac,
    options_publishedCalendars_CopyLink_Windows,
} from './copyLink.locstring.json';
import loc from 'owa-localize';

import { isMac } from 'owa-user-agent/lib/userAgent';

export function copyLink(link: string) {
    // To copy the text to the clipboard, we will create a hidden input box,
    // add the text to be copied, select it, copy it and then remove the input box.
    // In case the browser doesn't support copy to clipboard, this process will fail and we will show
    // a user prompt with the text to be copied and the user will be able to copy it manually
    const copyInput = document.createElement('input') as HTMLInputElement;

    // Styling the input box so it is not visible in the browser
    copyInput.className = 'screenReaderOnly';

    document.body.appendChild(copyInput);

    try {
        copyInput.value = link;
        copyInput.select();

        if (!document.execCommand('copy')) {
            // The command failed. Fallback to the method below.
            throw new Error();
        }
    } catch (err) {
        // The above method didn't work. Fallback to a prompt.
        const promptText = isMac()
            ? loc(options_publishedCalendars_CopyLink_Mac)
            : loc(options_publishedCalendars_CopyLink_Windows);
        window.prompt(promptText, link);
    } finally {
        document.body.removeChild(copyInput);
    }
}
