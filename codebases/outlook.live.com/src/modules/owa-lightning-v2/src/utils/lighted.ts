import type ActionType from 'owa-lightning-core-v2/lib/store/schema/ActionType';
import { endLightning } from 'owa-lightning-core-v2/lib/lazyFunctions';

export function lighted(lid: string, actionType?: ActionType): void {
    endLightning.importAndExecute(lid, actionType);
}
