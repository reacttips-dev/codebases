import type AttachmentFullViewState from '../schema/AttachmentFullViewState';
import { action } from 'satcheljs/lib/legacy';

export default action('updateIsViewingInProviderSupported')(
    function updateIsViewingInProviderSupported(
        attachment: AttachmentFullViewState,
        newValue: boolean
    ) {
        attachment.strategy.isViewingInProviderSupported = newValue;
    }
);
