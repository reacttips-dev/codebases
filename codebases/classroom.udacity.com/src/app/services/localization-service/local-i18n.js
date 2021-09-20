import {
    I18n
} from '@udacity/ureact-i18n';
import moment from 'moment';

export default new I18n(require.context('../../../locales'), {
    moment,
    refresh: true,
});