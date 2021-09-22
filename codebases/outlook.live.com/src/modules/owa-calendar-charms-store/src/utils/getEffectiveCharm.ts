import type FolderId from 'owa-service/lib/contract/FolderId';
import { CharmInfo, getCharmForId, getNoCharmInfoObject } from '../index';
import { getCalendarCharmIdByFolderId } from 'owa-calendar-events-store';

export function getEffectiveCharm(itemParentFolderId: FolderId, itemCharmId?: number): CharmInfo {
    if (itemCharmId != null) {
        let charm = getCharmForId(itemCharmId) as CharmInfo;
        if (charm.IconId <= 0) {
            charm = getCharmForId(getCalendarCharmIdByFolderId(itemParentFolderId.Id)) as CharmInfo;
        }
        return charm;
    } else if (itemParentFolderId != null) {
        return getCharmForId(getCalendarCharmIdByFolderId(itemParentFolderId.Id)) as CharmInfo;
    } else {
        return getNoCharmInfoObject();
    }
}

export default getEffectiveCharm;
