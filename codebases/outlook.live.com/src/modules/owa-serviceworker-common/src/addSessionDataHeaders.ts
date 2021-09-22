const WindowHeightBuffer = 250;
const ReadingPaneOnHeighToMessageRatio = 65;
const ReadingPaneOffHeighToMessageRatio = 29;

export function addSessionDataHeaders(
    headers: Headers,
    pathname: string,
    isNative: boolean,
    windowHeight: number | undefined,
    readingPanePosition: number | undefined
) {
    // The JS Experiment is a bit map
    // 1 - Turn on feature flags. Every app will want this. So on by default
    // 2 - unused
    // 4 - Deprecate Jsmvvm features - Only on when enabled
    headers.append('X-Js-Experiment', '5');

    if (isNative) {
        headers.append('X-Folder-Count', '0');
    } else if (!pathname || pathname.toLowerCase().indexOf('/mail') == 0) {
        if (windowHeight) {
            // if the reading pane position is undefined or 0, then we will assume it is off
            // so we will fetch more messages
            const ratio = readingPanePosition
                ? ReadingPaneOnHeighToMessageRatio
                : ReadingPaneOffHeighToMessageRatio;
            headers.append(
                'X-Message-Count',
                `${Math.floor((windowHeight - WindowHeightBuffer) / ratio)}`
            );
        }
    } else {
        headers.append('X-Folder-Count', '0');
        headers.append('X-Message-Count', '0');

        const pathnameLower = pathname.toLowerCase();
        if (pathnameLower.indexOf('/calendar') == 0 || pathnameLower.indexOf('/opx') == 0) {
            // for calendar, the calendar folders are the only relevant data

            headers.append('X-Calendar-Folders', '1');
        }
    }
}
