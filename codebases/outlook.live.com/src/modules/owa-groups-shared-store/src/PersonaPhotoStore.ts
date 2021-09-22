import { createStore } from 'satcheljs';
import type PersonaPhotoState from './schema/PersonaPhotoState';
import { ObservableMap } from 'mobx';

export let personaPhotoStore = createStore<PersonaPhotoState>('personaPhotoStore', {
    personaPhotoUrls: new ObservableMap<string, string>(),
})();
