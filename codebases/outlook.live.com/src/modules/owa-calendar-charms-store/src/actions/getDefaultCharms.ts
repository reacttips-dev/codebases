import type CharmInfo from '../schema/CharmInfo';
import type CharmsInfoSchema from '../schema/CharmsInfoSchema';
import charmsInfoStore from '../store';
import getNoCharmInfoObject from '../utils/getNoCharmInfoObject';

export interface GetCalendarCharmsInfo {
    charmStore: CharmsInfoSchema;
}

export let getDefaultCharms = function getDefaultCharms(
    includeUnSetCharm: boolean,
    state: GetCalendarCharmsInfo = { charmStore: charmsInfoStore }
): CharmInfo[] {
    var store = state.charmStore;
    let charmsToReturn: CharmInfo[] = [];
    if (store == null || store.charmInfoMap == null) {
        return charmsToReturn;
    }
    if (includeUnSetCharm) {
        charmsToReturn.push(store.charmInfoMap.get(getNoCharmInfoObject().IconId.toString()));
    }
    for (var i = 0; i <= store.charmInfoMapMaxId; i++) {
        var charminfo = store.charmInfoMap.get(i.toString());
        if (charminfo == null || !charminfo.IsInDefaultSet) {
            continue;
        }
        charmsToReturn.push(charminfo);
    }
    return charmsToReturn;
};

export default getDefaultCharms;
