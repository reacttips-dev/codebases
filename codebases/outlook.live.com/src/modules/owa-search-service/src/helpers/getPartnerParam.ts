import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';

export function getPartnerParam(): { [paramName: string]: string } {
    if (isHostAppFeatureEnabled('includePartnerIn3SRequest')) {
        return { ['partner']: 'exchangeshared' };
    }

    return {};
}
