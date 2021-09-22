import { action } from 'satcheljs';

export default action('onSpotlightFilterLoaded', (actionSource: string) => ({
    actionSource,
}));
