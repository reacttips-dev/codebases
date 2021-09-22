import getTheme from '../selectors/getTheme';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { getApp } from 'owa-config';
import { getIsDarkTheme } from 'owa-fabric-theme';
import { isFeatureEnabled } from 'owa-feature-flags';

export function getThemeIdFromParameter(themeId?: string) {
    return themeId === undefined ? getTheme() : themeId;
}

export function getIsDarkThemeFromParameter(isDarkTheme?: boolean) {
    return isDarkTheme === undefined ? getIsDarkTheme() : isDarkTheme;
}

export const isBookingsV2 = (): boolean => {
    return (
        getApp()?.toLowerCase() === 'bookings' &&
        isFeatureEnabled('fwk-bookingsv2App') &&
        !!getUserConfiguration()?.ViewStateConfiguration?.Bookingsv2IsOptedIn
    );
};
