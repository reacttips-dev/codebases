import { mutatorAction } from 'satcheljs';

import type { FavoritePersonaNode } from 'owa-favorites-types';

export default mutatorAction(
    'updatePersonaIsSyncUpdateDone',
    (persona: FavoritePersonaNode, value: boolean) => {
        persona.isSyncUpdateDone = value;
    }
);
