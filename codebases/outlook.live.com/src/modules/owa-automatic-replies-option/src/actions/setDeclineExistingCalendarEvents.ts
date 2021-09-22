import { action } from 'satcheljs';

export default action('ON_SET_DECLINE_EXISTING_CALENDAR_EVENTS', (option: boolean) => {
    return {
        option,
    };
});
