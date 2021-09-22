import { action } from 'satcheljs';

export default action('RESET_OPTIONS_SEARCH', (successfulSearch: boolean) => ({
    successfulSearch,
}));
