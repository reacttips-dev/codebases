import getStore from '../store/store';

export default function getApplicationSettingOverride(setting: string) {
    const store = getStore();

    return store.overrides[setting];
}
