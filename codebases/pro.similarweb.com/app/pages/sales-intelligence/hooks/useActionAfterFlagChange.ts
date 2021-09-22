import React from "react";
import { usePrevious } from "components/hooks/usePrevious";
import { flagHasChanged } from "pages/workspace/sales/helpers";

const useActionAfterFlagChange = (flag: boolean, action: () => void, condition = true) => {
    const prevFlag = usePrevious(flag);
    const done = flagHasChanged(prevFlag, flag);

    React.useEffect(() => {
        if (done && condition) {
            action();
        }
    }, [done]);
};

export default useActionAfterFlagChange;
