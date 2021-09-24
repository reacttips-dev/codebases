import React, { useCallback, useEffect, useState } from 'react';
import WifiLineIcon from 'remixicon-react/WifiLineIcon';
import WifiOffLineIcon from 'remixicon-react/WifiOffLineIcon';
import { useTranslation } from 'tribe-translation';
import { useToast } from '../Toast';
export const connectionStateContext = React.createContext(undefined);
export const ConnectionStateProvider = ({ children, }) => {
    const toast = useToast();
    const { t } = useTranslation();
    const [isOnline, setIsOnline] = useState(false);
    const updateStatus = useCallback(() => {
        const online = navigator.onLine;
        setIsOnline(online);
        toast({
            title: online
                ? t('common:connection.online.title', {
                    defaultValue: "You're back!",
                })
                : t('common:connection.offline.title', {
                    defaultValue: 'Looks like you have some connection issues',
                }),
            icon: online ? WifiLineIcon : WifiOffLineIcon,
        });
    }, [t, toast]);
    useEffect(() => {
        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);
        return () => {
            window.removeEventListener('online', updateStatus);
            window.removeEventListener('offline', updateStatus);
        };
    }, [updateStatus]);
    return (React.createElement(connectionStateContext.Provider, { value: { isOnline } }, children));
};
//# sourceMappingURL=index.js.map