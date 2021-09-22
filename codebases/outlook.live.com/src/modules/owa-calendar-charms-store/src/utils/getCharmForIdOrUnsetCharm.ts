import type CharmInfo from '../schema/CharmInfo';
import getCharmForIdFromStore from '../actions/getCharmForIdFromStore';
import getNoCharmInfoObject from '../utils/getNoCharmInfoObject';

export function getCharmForIdOrUnsetCharm(charmId: number): CharmInfo {
    if (charmId != null) {
        let charmToReturn = getCharmForIdFromStore(charmId);
        if (charmToReturn == null || charmToReturn.IconId == 0) {
            charmToReturn = getNoCharmInfoObject();
        }

        return charmToReturn;
    }
    return getNoCharmInfoObject();
}

export default getCharmForIdOrUnsetCharm;
