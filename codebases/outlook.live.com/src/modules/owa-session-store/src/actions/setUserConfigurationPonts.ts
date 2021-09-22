import { action } from 'satcheljs';
import type PontType from 'owa-service/lib/contract/PontType';

export default action('setUserConfigurationPonts', (pontType: PontType) => {
    return {
        pontType,
    };
});
