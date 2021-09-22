import { isAndroidOs, isIOs } from 'owa-user-agent';

/*
 * This value is based on the browser user agent of the device. We check for where getOsInfo() as defined in owa-user-agent is 'iOS' or 'Android'.
 * This is effectively checking if 'iPad', 'iPhone', 'iPod', or 'Android' appears in the browser user agent string. This is NOT
 * 100% accurate at detecting touch only devices. For example, if an iPad were to have a detachable keyboard with a trackpad,
 * it would likely not have a different user agent string, and therefore would be set isTouchOnlyDevice to true. Likewise,
 * a surface laptop that has touch functionality on the screen, but is largely used as a laptop would set isTouchOnlyDevice
 * to false. This value is intended to be generally accurate to toggle on/off low-impact surface functionality in touch only usage scenarios.
 */
export function getIsTouchOnlyDevice(): boolean {
    return isTabletOs();
}

/**
 * This is to tentatively determine if user is on a tablet.
 */
export function isTabletOs(): boolean {
    return isIOs() || isAndroidOs();
}
