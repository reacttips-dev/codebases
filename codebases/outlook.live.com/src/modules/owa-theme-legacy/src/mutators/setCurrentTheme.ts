import { mutatorAction } from 'satcheljs';
import { store } from '../store/store';

export default mutatorAction('SET_CURRENT_THEME', (normalizedThemeId: string) => {
    store.theme = normalizedThemeId;
});
