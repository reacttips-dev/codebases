import type { Profile } from './schema/ProfileStore';
import createStore from 'satcheljs/lib/createStore';

export const defaultProfile: Profile = {
    profileId: '',
    profileName: '',
    selectedAccountSourceId: '',
    accountSources: [],
};

const getProfileStore = createStore<Profile>('Profile', defaultProfile);
export default getProfileStore;
