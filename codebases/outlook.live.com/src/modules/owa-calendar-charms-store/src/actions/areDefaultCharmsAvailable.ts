import type CharmsInfoSchema from '../schema/CharmsInfoSchema';
import charmsInfoStore from '../store';

export interface GetCalendarCharmsInfo {
    charmStore: CharmsInfoSchema;
}

export let areDefaultCharmsAvailable = function areDefaultCharmsAvailable(
    state: GetCalendarCharmsInfo = { charmStore: charmsInfoStore }
): boolean {
    let defaultSetAvailable = false;
    if (state != null && state.charmStore != null && state.charmStore.charmInfoMap != null) {
        state.charmStore.charmInfoMap.forEach(charminfo => {
            if (charminfo.IsInDefaultSet == true) {
                defaultSetAvailable = true;
            }
        });
    }
    return defaultSetAvailable;
};

export default areDefaultCharmsAvailable;
