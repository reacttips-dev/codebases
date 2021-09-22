import store from '../store/store';
import { computed } from 'mobx';
import { ITheme, createTheme } from '@fluentui/style-utilities';

let extendedTheme = computed<ITheme>(() => {
    return createTheme(store());
});

export default () => extendedTheme.get();
export type { IComputedValue } from 'mobx';
