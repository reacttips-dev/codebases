import { PersonaSize } from '@fluentui/react/lib/Persona';
import { getDensityModeString } from 'owa-fabric-theme';
import { isFeatureEnabled } from 'owa-feature-flags';

export function calculatePersonaSize(): PersonaSize {
    if (isFeatureEnabled('mon-densities')) {
        switch (getDensityModeString()) {
            case 'medium':
                return PersonaSize.size32;
            case 'compact':
                return PersonaSize.size24;
            default:
                return PersonaSize.size40;
        }
    } else {
        return PersonaSize.size40;
    }
}
