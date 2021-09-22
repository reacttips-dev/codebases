import { createStore } from 'satcheljs';
import { ObservableMap } from 'mobx';

export const getLocalizedStringStore = createStore('localizedStrings', {
    currentLocale: '',
    currentCulture: '',
    localizedStrings: new ObservableMap<string, string>({}),
});
