import { PersonaSize } from '@fluentui/react/lib/Persona';

export const getPersonaSize = (
    hasDensityNext: boolean,
    isSingleLine: boolean,
    densityModeString: string
) => {
    if (!hasDensityNext || (!isSingleLine && densityModeString != 'full')) {
        return densityModeString === 'compact' ? PersonaSize.size24 : PersonaSize.size28;
    }
    switch (densityModeString) {
        case 'compact':
            return PersonaSize.size16;
        case 'medium':
            return PersonaSize.size24;
        default:
            return isSingleLine ? PersonaSize.size28 : PersonaSize.size32;
    }
};
