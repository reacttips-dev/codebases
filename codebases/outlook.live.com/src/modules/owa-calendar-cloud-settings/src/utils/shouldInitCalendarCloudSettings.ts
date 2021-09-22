import { getStore } from '../store/store';

export default function shouldInitCalendarCloudSettings(): boolean {
    const store = getStore();

    return !store || store.settings.size === 0;
}
