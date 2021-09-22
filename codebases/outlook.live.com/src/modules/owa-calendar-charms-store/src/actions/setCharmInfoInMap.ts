import type CharmInfo from '../schema/CharmInfo';
import type CharmsInfoSchema from '../schema/CharmsInfoSchema';
import charmsInfoStore from '../store';
import { action } from 'satcheljs/lib/legacy';

export interface GetCalendarCharmsInfo {
    charmStore: CharmsInfoSchema;
}

export let setCharmInfoInMap = action('setCharmInfoInMap')(function setCharmInfoInMap(
    response: any,
    state: GetCalendarCharmsInfo = { charmStore: charmsInfoStore }
): Promise<void> {
    var store = state.charmStore;
    return new Promise<void>(resolve => {
        if (
            store == null ||
            store.charmInfoMap == null ||
            response == null ||
            response.icons == null
        ) {
            return resolve();
        }
        for (var responseIcon of response.icons) {
            let charmInfoFromIcon = createCharmInfo(responseIcon);
            store.charmInfoMap.set(responseIcon.iconId.toString(), charmInfoFromIcon);
        }
        return resolve();
    });
});

function createCharmInfo(servIcon: any): CharmInfo {
    let charmInfo: CharmInfo = {
        IconId: servIcon.iconId,
        Name: servIcon.name,
        LocalizedName: servIcon.locName,
        SvgFile: servIcon.svgFile,
        Keywords: [],
        IsInDefaultSet: servIcon.isInDefaultSet,
        SvgHtmlText: '',
    };

    if (servIcon.keywords != null) {
        for (var iconKeyword of servIcon.keywords) {
            charmInfo.Keywords.push(iconKeyword);
        }
    }

    return charmInfo;
}

export default setCharmInfoInMap;
