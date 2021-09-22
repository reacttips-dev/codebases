import type CharmsInfoSchema from '../schema/CharmsInfoSchema';
import charmsInfoStore from '../store';

export interface GetCalendarCharmsInfo {
    charmStore: CharmsInfoSchema;
}

export let getAllCharmKeywords = function getAllCharmKeywords(
    state: GetCalendarCharmsInfo = { charmStore: charmsInfoStore }
): string[] {
    var store = state.charmStore;
    let keywordsToReturn: string[] = [];
    if (store == null || store.keywordsMap == null) {
        return keywordsToReturn;
    }
    let keywordKeys = store.keywordsMap.keys();
    for (var keyword of keywordKeys) {
        keywordsToReturn.push(keyword);
    }
    return keywordsToReturn;
};

export default getAllCharmKeywords;
