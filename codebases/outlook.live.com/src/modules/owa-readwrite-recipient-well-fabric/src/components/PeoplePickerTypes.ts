import type AttendeePersonaProps from '../store/schema/AttendeePersonaProps';
import ReadWriteFabricRecipientWell, {
    ReadWriteFabricRecipientWellProps,
} from './ReadWriteFabricRecipientWell';
import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';

// Based on ComponentClass from @types/react
interface RecipientWellClass<T> {
    new (
        props: ReadWriteFabricRecipientWellProps<T>,
        context?: any
    ): ReadWriteFabricRecipientWell<T>;
}

export const AttendeeWell: RecipientWellClass<AttendeePersonaProps> = ReadWriteFabricRecipientWell;
export const RecipientWell: RecipientWellClass<ReadWriteRecipientViewState> = ReadWriteFabricRecipientWell;
export type RecipientWell = ReadWriteFabricRecipientWell<ReadWriteRecipientViewState>;
