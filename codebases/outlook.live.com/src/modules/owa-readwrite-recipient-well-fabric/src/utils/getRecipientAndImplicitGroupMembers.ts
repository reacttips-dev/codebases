import containsImplicitGroupMembers from './containsImplicitGroupMembers';
import { getReadWriteRecipientViewStateFromFindRecipientPersonaType } from 'owa-recipient-create-viewstate/lib/util/getReadWriteRecipientViewStateFromFindRecipientPersonaType';
import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';

/**
 * Returns an array of ReadWriteRecipientViewState containing recipient and implicit group members.
 */
export default function (item: ReadWriteRecipientViewState): ReadWriteRecipientViewState[] {
    if (containsImplicitGroupMembers(item)) {
        return item.persona.Members.map(member =>
            getReadWriteRecipientViewStateFromFindRecipientPersonaType({
                EmailAddress: member,
            })
        );
    } else {
        return [getReadWriteRecipientViewStateFromFindRecipientPersonaType(item.persona)];
    }
}
