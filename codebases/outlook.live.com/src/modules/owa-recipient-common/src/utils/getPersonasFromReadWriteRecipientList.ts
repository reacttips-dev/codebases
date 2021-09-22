import type FindRecipientPersonaType from 'owa-recipient-types/lib/types/FindRecipientPersonaType';
import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';

export default function getPersonasFromReadWriteRecipientList(
    readWriteRecipientList: ReadWriteRecipientViewState[]
): FindRecipientPersonaType[] {
    let personaList = [];
    if (readWriteRecipientList) {
        personaList = readWriteRecipientList.map(obj => obj.persona);
    }
    return personaList;
}
