const options: string =
    'left=0,top=0,height=600,width=800,location=0,menubar=0,resizable=1,scrollbars=0,status=0,toolbar=0';

/**
 * This method is going to be removed soon. Please use OwaPopout instead.
 * WI tracking the removal https://outlookweb.visualstudio.com/Outlook%20Web/_workitems/edit/29753
 */
export function DEPRECATED_openDeeplinkPopout(url: string, isExternalApp: boolean) {
    let processedUrl = url;
    if (isExternalApp) {
        // If it's an external app, remove gulp from the url because it's likely that we're not also gulp'ing it.
        // If this becomes a nuance, we can add a flight to change this behavior on runtime.
        processedUrl = processedUrl.replace('gulp&', '').replace('gulp', '');
    }

    const popoutWindow = window.open(processedUrl || 'about:blank', 'Deeplink', options);

    if (popoutWindow && isExternalApp) {
        (popoutWindow as any).opener = null;
    }
}
