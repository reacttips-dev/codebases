import type CharmInfo from '../schema/CharmInfo';
import type CharmsInfoSchema from '../schema/CharmsInfoSchema';
import charmsInfoStore from '../store';

export interface GetCalendarCharmsInfo {
    charmStore: CharmsInfoSchema;
}

export let getCharmForIdFromStore = function getCharmForIdFromStore(
    charmId: number,
    state: GetCalendarCharmsInfo = { charmStore: charmsInfoStore }
): CharmInfo {
    var store = state.charmStore;
    if (charmId == null || store == null || store.charmInfoMap == null) {
        return null;
    }
    let charmInfoToReturn = store.charmInfoMap.get(charmId.toString());
    if (charmInfoToReturn != null && charmInfoToReturn.IconId == charmId) {
        return charmInfoToReturn;
    }
    return null;
};

export default getCharmForIdFromStore;
