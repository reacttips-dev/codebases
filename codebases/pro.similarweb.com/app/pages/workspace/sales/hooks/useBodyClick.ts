import React from "react";

const useBodyClick = (handler: (e: MouseEvent) => void) => {
    React.useEffect(() => {
        document.body.addEventListener("click", handler, { capture: true });

        return () => {
            document.body.removeEventListener("click", handler, { capture: true });
        };
    }, [handler]);
};

export default useBodyClick;
