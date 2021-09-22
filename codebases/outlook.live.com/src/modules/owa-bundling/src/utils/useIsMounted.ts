import * as React from 'react';

const useIsMounted = (): React.MutableRefObject<boolean> => {
    const isMounted = React.useRef(true);
    // Do nothing when onEffect executes, but return a cleanup method that sets the
    // inner value of the isMounted ref to be false.
    React.useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    });
    return isMounted;
};

export default useIsMounted;
