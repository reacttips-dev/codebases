import { loadingPlaceholder } from './MailListItemMeetingPreview.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';

export default function renderMeetingPreviewPlaceHolder(): JSX.Element {
    return <span>{loc(loadingPlaceholder)}</span>;
}
