import { action } from 'satcheljs';
import type ItemId from 'owa-service/lib/contract/ItemId';

export default action('DISMISS_REMINDERS', (itemId: ItemId | ItemId[]) => ({ itemId }));
