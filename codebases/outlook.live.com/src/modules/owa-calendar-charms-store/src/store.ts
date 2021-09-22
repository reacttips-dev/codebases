import type CharmInfo from './schema/CharmInfo';
import type CharmsInfoSchema from './schema/CharmsInfoSchema';
import type KeywordInfo from './schema/KeywordInfo';
import { createStore } from 'satcheljs';
import { ObservableMap } from 'mobx';

let charmsInfoStoreData: CharmsInfoSchema = {
    charmInfoMap: new ObservableMap<string, CharmInfo>(),
    charmInfoMapMaxId: 0,
    keywordsMap: new ObservableMap<string, KeywordInfo>(),
};

let charmsInfoStore = createStore<CharmsInfoSchema>(
    'calendarCharmsInfoStore',
    charmsInfoStoreData
)();

export default charmsInfoStore;
