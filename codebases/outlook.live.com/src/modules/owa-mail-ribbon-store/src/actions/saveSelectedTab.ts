import { action } from 'satcheljs';

export default action('saveSelectedTab', (tabId: string) => ({ tabId }));
