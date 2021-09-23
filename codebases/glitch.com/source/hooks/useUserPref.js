import {
    useState,
    useEffect
} from 'react';
import useApplication from './useApplication';

function getUserPref(application, key, fallback) {
    return application.getUserPref(key) !== undefined ? application.getUserPref(key) : fallback;
}

export default function useUserPref(key, fallback) {
    const application = useApplication();
    const [pref, setPref] = useState(() => getUserPref(application, key, fallback));

    useEffect(() => {
        setPref(getUserPref(application, key, fallback));
        // TODO: this currently makes the sidebar go wild when resized while multiple tabs are open, we should
        // find a better solution for user prefs sync that doesn't cause that to happen
        // application.onUserPrefChange(key, setPref);
        // return () => {
        //   application.removeUserPrefChangeListener(key, setPref);
        // };
    }, [application, key, fallback]);

    useEffect(() => {
        application.updateUserPrefs(key, pref);
    }, [application, key, pref]);

    return [pref, setPref];
}