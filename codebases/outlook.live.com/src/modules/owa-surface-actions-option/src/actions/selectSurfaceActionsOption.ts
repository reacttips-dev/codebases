import getStore from '../store/store';
import type SurfaceActionsOptionState from '../store/schema/SurfaceActionsOptionState';
import { action } from 'satcheljs/lib/legacy';
import { CUSTOM_HOVER_SIZE } from '../services/saveHoverSurfaceActionService';
import { confirm } from 'owa-confirm-dialog';

export interface SelectSurfaceActionsOptionState {
    optionState: SurfaceActionsOptionState;
}

type SingleElement<T> = T extends (infer I)[] ? I : T;

export default action('selectSurfaceActionsOption')(function selectSurfaceActionsOption<
    K extends keyof SurfaceActionsOptionState,
    TArray extends SurfaceActionsOptionState[K],
    TElement extends SingleElement<TArray>
>(
    option: K,
    actionCollection: TArray,
    actionKey: TElement,
    checked: boolean,
    state: SelectSurfaceActionsOptionState = { optionState: getStore() }
) {
    let { optionState } = state;
    if (checked) {
        // VSO 35554
        if (option == 'hoverSurfaceActions' && !canAddHoverSurfaceAction(actionCollection)) {
            showHoverSurfaceActionErrorMessage();
            return;
        }
        if (actionCollection.indexOf(actionKey as any) == -1) {
            actionCollection.push(actionKey as any);
        }
    } else {
        let index = actionCollection.indexOf(actionKey as any);
        if (index >= 0) {
            actionCollection.splice(index, 1);
        }
    }
    optionState[option] = actionCollection;
});

function canAddHoverSurfaceAction(actionCollection: string[]) {
    const validActions = actionCollection.filter(hoverActionKey => hoverActionKey != 'None');
    if (validActions.length >= CUSTOM_HOVER_SIZE) {
        return false;
    }
    return true;
}

async function showHoverSurfaceActionErrorMessage() {
    await confirm(
        'Too many actions selected',
        'A maximum of four quick actions are supported at this time.',
        false,
        {
            hideCancelButton: true,
        }
    );
}
