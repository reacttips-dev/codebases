import { action } from 'satcheljs';

const onProjectionBlur = action('Popout_OnProjectionBlur', (tabId: string) => ({ tabId }));

export default onProjectionBlur;
