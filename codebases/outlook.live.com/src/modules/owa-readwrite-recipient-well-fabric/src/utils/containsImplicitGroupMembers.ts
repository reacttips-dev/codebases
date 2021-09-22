import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import { isFeatureEnabled } from 'owa-feature-flags';

/**
 * Returns an array of ReadWriteRecipientViewState containing recipient and implicit group members.
 */
export default function (item: ReadWriteRecipientViewState): boolean {
    return (
        isFeatureEnabled('cmp-implicitgroups') &&
        item &&
        item.persona &&
        item.persona.PersonaTypeString == 'ImplicitGroup' &&
        item.persona.Members &&
        item.persona.Members.length > 0
    );
}
