import type CharmInfo from '../schema/CharmInfo';
import charmsInfoStore from '../store';
import getSvgFromCDNResponse from 'owa-svg-services/lib/services/getSvgFromCDNResponse';
import { mutatorAction } from 'satcheljs';
import { trace } from 'owa-trace';

export async function loadCharmSvgTextInMap(iconId: number): Promise<void> {
    if (iconId == null || charmsInfoStore == null || charmsInfoStore.charmInfoMapMaxId == null) {
        return;
    }
    let charmInfo = charmsInfoStore.charmInfoMap.get(iconId.toString());
    if (charmInfo != null && (charmInfo.SvgHtmlText == null || charmInfo.SvgHtmlText == '')) {
        await getSvgFromCDNResponse(charmInfo.SvgFile).then(function (value: string) {
            setSvgHtmlText(charmInfo, value);
        });

        trace.info('[setCharmInfoWithUpdatedSvgText] complete, iconId: ' + charmInfo.IconId);
        addCharmInfo(charmInfo);
    }
}

const setSvgHtmlText = mutatorAction('setSvgHtmlText', (charmInfo: CharmInfo, value: string) => {
    charmInfo.SvgHtmlText = value;
});

const addCharmInfo = mutatorAction('addCharmInfo', (charmInfo: CharmInfo) => {
    charmsInfoStore.charmInfoMap.set(charmInfo.IconId.toString(), charmInfo);
});

export default loadCharmSvgTextInMap;
