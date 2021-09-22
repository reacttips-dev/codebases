import type CharmsInfoSchema from '../schema/CharmsInfoSchema';
import charmsInfoStore from '../store';
import type KeywordInfo from '../schema/KeywordInfo';
import { action } from 'satcheljs/lib/legacy';

let MIN_KEYWORDS_IN_STORE: number = 3;

export interface GetCalendarCharmsInfo {
    charmStore: CharmsInfoSchema;
}

export let setCharmKeywordsInMap = action('setCharmKeywordsInMap')(function setCharmKeywordsInMap(
    state: GetCalendarCharmsInfo = { charmStore: charmsInfoStore }
): Promise<void> {
    var store = state.charmStore;
    return new Promise<void>(resolve => {
        if (store == null || store.keywordsMap == null || store.charmInfoMapMaxId == null) {
            return resolve();
        }
        if (store.keywordsMap.size > MIN_KEYWORDS_IN_STORE) {
            return resolve();
        }
        for (var i = 0; i <= store.charmInfoMapMaxId; i++) {
            var charminfo = store.charmInfoMap.get(i.toString());
            if (charminfo == null) {
                continue;
            }
            // The KeywordsMap uses the lowercased keyword as key. The value in the map is KeywordInfo which contains
            // the charm Id and the properly cased keyword from the service (which in EN would be first letter only uppercase).
            // This is required so that obtaining the values from the map is simple (just lowercased always), while at same time
            // being able to get the properly cased version from the map value to use for the CharmSuggestions text.
            for (var keyword of charminfo.Keywords) {
                if (!store.keywordsMap.has(keyword)) {
                    let keywordInfo: KeywordInfo = {
                        Keyword: keyword,
                        IconId: charminfo.IconId,
                    };
                    store.keywordsMap.set(keyword.toLocaleLowerCase(), keywordInfo);
                }
            }
        }
        return resolve();
    });
});

export default setCharmKeywordsInMap;
