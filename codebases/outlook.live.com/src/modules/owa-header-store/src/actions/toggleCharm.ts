import { action } from 'satcheljs';
import type HeaderCharmType from '../store/schema/HeaderCharmType';

export default action('TOGGLE_CHARM', function toggleCharm(charm: HeaderCharmType) {
    return {
        charm,
    };
});
