import React, { useEffect, useMemo, useState, createContext, } from 'react';
import { useTheme } from '@chakra-ui/system';
import { useDebouncedCallback } from '../hooks/useDebounce';
import { useToggle } from '../hooks/useToggle';
export const responsiveContext = createContext(undefined);
const calculate = (width, breakpoints = {}) => {
    const newInfo = {
        base: true,
        sm: true,
        md: true,
        lg: true,
        xl: true,
        '2xl': true,
    };
    for (let i = 0; i < Object.keys(breakpoints).length; i++) {
        const key = Object.keys(breakpoints)[i];
        if (Object.keys(newInfo).includes(key)) {
            newInfo[key] = width >= parseInt(breakpoints[key], 10);
        }
    }
    return newInfo;
};
export const ResponsiveProvider = ({ children, userAgent }) => {
    const theme = useTheme();
    // TODO detect width from User-Agent
    const [width, setWidth] = useState(typeof window === 'undefined' ? 1440 : window.innerWidth);
    const [isSidebarOpen, toggleSidebar] = useToggle(false);
    const [mobileHeader, setMobileHeader] = useState({});
    const info = useMemo(() => calculate(width, theme.breakpoints), [
        theme.breakpoints,
        width,
    ]);
    const handleWindowResize = () => {
        setWidth(window.innerWidth);
    };
    const debouncedResize = useDebouncedCallback(handleWindowResize, 100);
    useEffect(() => {
        window.addEventListener('resize', debouncedResize);
        return () => window.removeEventListener('resize', debouncedResize);
    }, [debouncedResize]);
    return (React.createElement(responsiveContext.Provider, { value: {
            userAgent,
            responsive: info,
            mobileHeader,
            setMobileHeader,
            toggleSidebar,
            isSidebarOpen,
        } }, children));
};
//# sourceMappingURL=index.js.map