import { action } from 'satcheljs';
import type { OwaDate } from 'owa-datetime';

export default action('ON_SET_START_TIME', (dateTime: OwaDate) => ({ dateTime }));
