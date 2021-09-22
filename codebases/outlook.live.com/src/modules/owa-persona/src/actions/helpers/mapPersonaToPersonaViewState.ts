import type PersonaControlViewState from '../../store/schema/PersonaControlViewState';

/**
 * Creates the persona view state and stores it in the store
 * @param name of the persona
 * @param hexCID hex id for a persona
 * @param emailAddress email address of the persona
 * @param size the size of the persona
 */
export default function mapPersonaToPersonaViewState(
    name: string,
    hexCID: string,
    emailAddress: string,
    personaId: string,
    size: number,
    mailboxType: string
): PersonaControlViewState {
    let personaBlob = {
        blobUrl: null,
        isPendingFetch: false,
        hasFetchFailed: false,
    };

    return <PersonaControlViewState>{
        emailAddress: emailAddress,
        hexConsumerIdForUser: hexCID,
        personaId: personaId,
        name: name,
        personaBlob: personaBlob,
        size: size,
        mailboxType: mailboxType,
    };
}
