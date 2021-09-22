import ___resources_fabricColorVariablesThemeBaseJson from '../resources/fabric.color.variables.theme.base.json';
import { createStore } from 'satcheljs';
import type ThemeStore from './schema/ThemeStore';
import { ObservableMap } from 'mobx';
import { ThemeResources, ThemeConstants } from 'owa-theme-shared';

var initialStore: ThemeStore = {
    theme: ThemeConstants.BASE_THEME_ID,
    themeData: new ObservableMap<string, ThemeResources>({
        [ThemeConstants.BASE_THEME_ID]: ___resources_fabricColorVariablesThemeBaseJson,
    }),
};
export var store = createStore<ThemeStore>('themeStore', initialStore)();
