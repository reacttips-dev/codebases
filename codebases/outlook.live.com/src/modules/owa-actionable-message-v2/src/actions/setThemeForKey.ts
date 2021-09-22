import store from '../store/Store';
import { mutatorAction } from 'satcheljs';
import type Theme from '../store/schema/Theme';

export default mutatorAction('setThemeForKey', function setThemeForKey(key: string, theme: Theme) {
    store.themeStore.themeMapping[key] = theme;
});
