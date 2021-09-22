const emailRegex = /\/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\//;
export function isExplicitLogonSession(windowObj: Window): boolean {
    return !!windowObj?.location?.href && emailRegex.test(windowObj.location.href.toLowerCase());
}
