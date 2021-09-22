import { favoritesRemoveErrorTitleText } from 'owa-locstrings/lib/strings/favoritesremoveerrortitletext.locstring.json';
import { favoritesErrorTitleText } from 'owa-locstrings/lib/strings/favoriteserrortitletext.locstring.json';
import loc from 'owa-localize';

import { trace } from 'owa-trace';

export default function handleToggleFavoritePdlError(isRemoveFailure: boolean) {
    const notificationText = isRemoveFailure
        ? loc(favoritesRemoveErrorTitleText)
        : loc(favoritesErrorTitleText);

    trace.warn(notificationText);
}
