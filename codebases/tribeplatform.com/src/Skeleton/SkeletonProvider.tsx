import React, { useContext } from 'react';
const SkeletonContext = React.createContext({
    loading: false,
});
export const SkeletonProvider = ({ loading, speed, children, }) => (React.createElement(SkeletonContext.Provider, { value: { loading, speed } }, children));
export const useIsLoading = () => useContext(SkeletonContext);
//# sourceMappingURL=SkeletonProvider.js.map