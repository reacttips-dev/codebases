import { PersonaSize } from '@fluentui/react/lib/Persona';
import { ReadWriteRecipientWellSize } from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';

export const getPersonaSizeFromRecipientWellSize = (size: ReadWriteRecipientWellSize) => {
    switch (size) {
        case ReadWriteRecipientWellSize.Small:
            return PersonaSize.size24;
        case ReadWriteRecipientWellSize.Regular:
            return PersonaSize.size32;
    }
};
