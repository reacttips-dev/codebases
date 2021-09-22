import { getSuiteThemeStore } from '../store/suiteThemeStore';
import type { UserTheme } from '@suiteux/suiteux-shell';

export function getCurrentTheme(): Readonly<UserTheme> {
    return getSuiteThemeStore().currentTheme;
}
