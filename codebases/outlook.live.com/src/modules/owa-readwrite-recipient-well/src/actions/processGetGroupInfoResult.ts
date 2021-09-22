import type FindRecipientPersonaType from 'owa-recipient-types/lib/types/FindRecipientPersonaType';
import type GetGroupResponse from 'owa-service/lib/contract/GetGroupResponse';
import { action } from 'satcheljs/lib/legacy';

export default action('processGetGroupInfoResult')(function processGetGroupInfoResult(
    personaTypeSet: FindRecipientPersonaType[],
    responseMessage: GetGroupResponse
) {
    if (responseMessage.Members) {
        responseMessage.Members.forEach(result => {
            personaTypeSet.push({
                EmailAddress: result.EmailAddress,
                PersonaId: result.PersonaId,
                ADObjectId: result.ADObjectId,
            });
        });
    }
});
