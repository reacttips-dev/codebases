import React from "react";
import { findParentByClass } from "@similarweb/ui-components/dist/utils";
import useBodyClick from "pages/workspace/sales/hooks/useBodyClick";

/**
 * @param className - element's className to check
 * @param callback - a function to be called when click outside of the element with the className occurs
 */
export const useOnOutsideClick = (className: string, callback: () => void) => {
    const handleBodyClick = React.useCallback(
        (e) => {
            const parent = findParentByClass(e.target, className.split(" ")[0]);

            if (!parent) {
                callback();
            }
        },
        [callback],
    );

    useBodyClick(handleBodyClick);
};
