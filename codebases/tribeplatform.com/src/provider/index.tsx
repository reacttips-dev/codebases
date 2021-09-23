import React, { useEffect, useMemo, useState } from 'react';
import { OptimizelyProvider } from '@optimizely/react-sdk';
import getOptimizely from '../config';
const TribeOptimizelyProvider = ({ user: _user, datafile, children, }) => {
    const optimizely = getOptimizely(datafile);
    const [ready, setReady] = useState(false);
    const user = useMemo(() => ({
        ..._user,
        attributes: {
            ..._user === null || _user === void 0 ? void 0 : _user.attributes,
            ready,
        },
    }), [_user, ready]);
    useEffect(() => {
        let ignore = false;
        optimizely.onReady().then(() => {
            if (!ignore) {
                setReady(true);
            }
        });
        return () => {
            ignore = true;
        };
    }, [optimizely]);
    return (React.createElement(OptimizelyProvider, { isServerSide: !ready, optimizely: optimizely, timeout: 500, user: user }, children));
};
export default TribeOptimizelyProvider;
//# sourceMappingURL=index.js.map