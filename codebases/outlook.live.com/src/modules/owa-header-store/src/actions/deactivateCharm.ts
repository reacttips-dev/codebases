import { action } from 'satcheljs';
import type HeaderCharmType from '../store/schema/HeaderCharmType';

export default action('DEACTIVATE_CHARM', function deactivateCharm(charm: HeaderCharmType) {
    return {
        charm,
    };
});
