import getStore from '../store/store';

export default function getApplicationSettingsSearchKey(): string | undefined {
    return getStore().searchKey;
}
