import type CharmInfo from '../schema/CharmInfo';
import getCharmForIdFromStore from '../actions/getCharmForIdFromStore';
import getKeywordInfo from '../actions/getKeywordInfo';
import type KeywordInfo from '../schema/KeywordInfo';

export function getCharmForKeyword(keyword: string): CharmInfo {
    if (keyword != null && keyword.length > 0) {
        let keywordInfo: KeywordInfo = getKeywordInfo(keyword);
        if (keywordInfo != null) {
            return getCharmForIdFromStore(keywordInfo.IconId);
        }
    }

    return null;
}

export default getCharmForKeyword;
