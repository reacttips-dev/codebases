import { action } from 'satcheljs';

const startProjection = action('StartProjection', (tabId: string, targetWindow: Window) => ({
    tabId,
    targetWindow,
}));

export default startProjection;
