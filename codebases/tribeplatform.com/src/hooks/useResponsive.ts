import React, { useMemo, useCallback, } from 'react';
import UAParser from 'ua-parser-js';
import { responsiveContext } from '../ResponsiveProvider';
export const useResponsive = () => {
    var _a, _b;
    const { userAgent, responsive, mobileHeader: mobileHeaderState, setMobileHeader: setMobileHeaderAction, isSidebarOpen, toggleSidebar, } = React.useContext(responsiveContext) || {};
    let isMobile;
    let isPhone;
    let isTablet;
    let isPortable;
    if (typeof window === 'undefined') {
        const ua = UAParser(userAgent);
        isPhone = ((_a = ua === null || ua === void 0 ? void 0 : ua.device) === null || _a === void 0 ? void 0 : _a.type) === 'mobile';
        isTablet = ((_b = ua === null || ua === void 0 ? void 0 : ua.device) === null || _b === void 0 ? void 0 : _b.type) === 'tablet';
        isMobile = isPhone;
        isPortable = isMobile;
    }
    else {
        isMobile =
            // If < 1024px, then it's a mobile device
            ((responsive === null || responsive === void 0 ? void 0 : responsive.base) || (responsive === null || responsive === void 0 ? void 0 : responsive.sm) || (responsive === null || responsive === void 0 ? void 0 : responsive.md)) &&
                !(responsive === null || responsive === void 0 ? void 0 : responsive.lg) &&
                !(responsive === null || responsive === void 0 ? void 0 : responsive.xl) &&
                !responsive['2xl'];
        isPhone = (responsive === null || responsive === void 0 ? void 0 : responsive.base) && !(responsive === null || responsive === void 0 ? void 0 : responsive.sm) && !(responsive === null || responsive === void 0 ? void 0 : responsive.md) && isMobile;
        isTablet = (responsive === null || responsive === void 0 ? void 0 : responsive.base) && (responsive === null || responsive === void 0 ? void 0 : responsive.sm) && !(responsive === null || responsive === void 0 ? void 0 : responsive.md) && isMobile;
        isPortable = isPhone || isTablet;
    }
    // Update the header only if it's a mobile device
    const setMobileHeader = useCallback(header => {
        if (!isMobile)
            return;
        setMobileHeaderAction(header);
    }, [isMobile, setMobileHeaderAction]);
    const mobileHeader = useMemo(() => ({
        setLeft: (left) => setMobileHeader(state => ({ ...state, left })),
        setTitle: (title) => setMobileHeader(state => ({ ...state, title })),
        setRight: (right) => setMobileHeader(state => ({ ...state, right })),
        setProps: (props) => setMobileHeader(state => ({ ...state, props })),
        set: (header) => setMobileHeader(header),
    }), [setMobileHeader]);
    return {
        responsive,
        isMobile,
        isPhone,
        isTablet,
        isPortable,
        mobileHeader,
        toggleSidebar,
        isSidebarOpen,
        mobileHeaderParts: mobileHeaderState,
    };
};
//# sourceMappingURL=useResponsive.js.map