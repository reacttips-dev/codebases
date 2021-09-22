import user from 'js/lib/user';

// eslint-disable-next-line
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import store from 'store';

class UserPreferences {
  defaults = {
    playbackRate: 1,
    volume: 1,
    subtitleLanguage: 'none',
    autoplay: false, // this must be off by default for a11y reasons
    key: 'userPreferences',
  };

  constructor() {
    const oldPreferences = store.get(user.get().id + '.userPreferences');
    if (!oldPreferences) {
      store.set(`${user.get().id}.userPreferences`, this.defaults);
    }
  }

  get(key: string) {
    const preferences = store.get(user.get().id + '.userPreferences');
    return preferences[key];
  }

  set(key: string, value: any) {
    const oldPreferences = store.get(user.get().id + '.userPreferences');
    const newPreferences = { ...oldPreferences, [key]: value };
    store.set(`${user.get().id}.userPreferences`, newPreferences);
  }
}

export default new UserPreferences();
