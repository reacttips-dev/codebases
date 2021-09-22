import type CharmInfo from '../schema/CharmInfo';
import getCharmForIdFromStore from '../actions/getCharmForIdFromStore';
import getNoCharmInfoObject from '../utils/getNoCharmInfoObject';

export function getCharmForId(charmId: number): CharmInfo {
    let charmToReturn = getCharmForIdFromStore(charmId);
    if (charmToReturn == null || charmToReturn.IconId == 0) {
        charmToReturn = getNoCharmInfoObject();
    }

    return charmToReturn;
}

export default getCharmForId;
