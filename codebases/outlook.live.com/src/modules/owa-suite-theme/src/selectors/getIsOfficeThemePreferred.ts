import { getSuiteThemeStore } from '../store/suiteThemeStore';

export function getIsOfficeThemePreferred(): boolean {
    return getSuiteThemeStore().isOfficeThemePreferred;
}
