import { action } from 'satcheljs';

export default action('onMailTipRetrieved', (composeId: string, fromAddress: string) => ({
    composeId,
    fromAddress,
}));
