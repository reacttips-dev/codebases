import type SurfaceActionsOptionState from './schema/SurfaceActionsOptionState';
import { createStore } from 'satcheljs';

let getStore = createStore<SurfaceActionsOptionState>('surfaceActionsOption', {
    readSurfaceActions: null,
    readSurfaceAddins: null,
    composeSurfaceActions: null,
    composeSurfaceAddins: null,
    hoverSurfaceActions: null,
});

export default getStore;
