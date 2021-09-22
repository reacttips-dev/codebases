import { action } from 'satcheljs';
import type { OwaDate } from 'owa-datetime';

export default action('ON_SET_END_DATE', (date: OwaDate) => ({ date }));
