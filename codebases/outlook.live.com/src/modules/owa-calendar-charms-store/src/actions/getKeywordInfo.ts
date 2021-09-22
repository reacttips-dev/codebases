import type CharmsInfoSchema from '../schema/CharmsInfoSchema';
import charmsInfoStore from '../store';
import type KeywordInfo from '../schema/KeywordInfo';

export interface GetCalendarCharmsInfo {
    charmStore: CharmsInfoSchema;
}

export let getKeywordInfo = function getKeywordInfo(
    keywordKey: string,
    state: GetCalendarCharmsInfo = { charmStore: charmsInfoStore }
): KeywordInfo {
    var store = state.charmStore;
    if (keywordKey != null && keywordKey.length > 0 && store != null && store.keywordsMap != null) {
        return store.keywordsMap.get(keywordKey.toLocaleLowerCase());
    }
    return null;
};

export default getKeywordInfo;
