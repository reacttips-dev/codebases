import { action } from 'satcheljs';

export default action('onEditDraftButtonClicked', (itemId: string, sxsId: string) => ({
    itemId,
    sxsId,
}));
