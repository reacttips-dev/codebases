import { mutatorAction } from 'satcheljs';
import type WellDropViewState from '../store/schema/WellDropViewState';

export const setDidDragStart = mutatorAction(
    'setDidDragStart',
    (dropViewState: WellDropViewState, value: boolean) => {
        dropViewState.didDragStart = value;
    }
);
