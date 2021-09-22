import { TaskQueue } from 'owa-task-queue';
import { lazyDownloadPersonaPhoto } from '../lazyFunctions';
import personaControlStore from '../store/Store';
import getPersonaControlKey from '../utils/getPersonaControlKey';
import type { PersonaSize } from '@fluentui/react/lib/Persona';

export interface PersonaProps {
    name: string;
    emailAddress: string;
    personaId: string;
    mailboxType: string;
    size: PersonaSize;
    skipLoadingPhoto?: () => boolean;
}

const MAX_NUM_OF_GET_PERSONA_REQUESTS: number = 1;

/**
 * Initialize the get persona photo task queue.
 * The queue will control how many getPersonaPhoto requests to make at any given point
 */
let getPersonaPhotoQueue = new TaskQueue<PersonaProps>(
    MAX_NUM_OF_GET_PERSONA_REQUESTS,
    downloadPersonaPhotoTask,
    500 /* taskDelay */
);

/**
 * The task that is scheduled to run
 * @param persona the prop bag containing properties required to download persona photo
 */
function downloadPersonaPhotoTask(persona: PersonaProps): Promise<any> {
    let personaControlKey = getPersonaControlKey(
        persona.emailAddress,
        persona.personaId,
        persona.size,
        persona.mailboxType,
        persona.name
    );
    let viewState = personaControlStore.viewStates.get(personaControlKey);
    return lazyDownloadPersonaPhoto.importAndExecute(
        viewState,
        false /* forceFetch */,
        persona.skipLoadingPhoto
    );
}

export default getPersonaPhotoQueue;
