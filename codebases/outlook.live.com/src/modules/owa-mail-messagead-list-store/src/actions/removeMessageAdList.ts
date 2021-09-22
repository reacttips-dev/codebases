import { action } from 'satcheljs';

export default action('REMOVE_MESSAGE_AD_LIST', (remainingShowAdCount: number) => {
    return {
        remainingShowAdCount,
    };
});
