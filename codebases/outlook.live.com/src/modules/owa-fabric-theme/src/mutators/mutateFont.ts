import { mutatorAction } from 'satcheljs';
import store from '../store/store';
import { createFontStyles } from '@fluentui/style-utilities';

export default mutatorAction('MUTATE_FABRIC_FONT', (locale: string) => {
    store().fonts = createFontStyles(locale);
});
