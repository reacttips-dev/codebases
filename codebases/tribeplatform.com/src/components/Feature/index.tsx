import React from 'react';
import { OptimizelyFeature } from '@optimizely/react-sdk';
const TribeFeature = ({ feature, children, ...props }) => {
    const componentsToRender = React.useCallback(variables => {
        return React.Children.map(children, child => {
            // checking isValidElement is the safe way and avoids a typescript error too
            if (React.isValidElement(child)) {
                return React.cloneElement(child, { ...variables });
            }
            return child;
        });
    }, []);
    return (React.createElement(OptimizelyFeature, Object.assign({ autoUpdate: true, feature: feature }, props), (isEnabled, variables) => isEnabled && componentsToRender(variables)));
};
export default TribeFeature;
//# sourceMappingURL=index.js.map