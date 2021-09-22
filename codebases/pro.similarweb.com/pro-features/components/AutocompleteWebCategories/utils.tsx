import { findParentByClass } from "@similarweb/ui-components/dist/utils/index";
import React from "react";
import { ScrollArea } from "@similarweb/ui-components/dist/react-scrollbar";

export const renderItemCreator = (renderItemsClick) => (item) => {
    return { ...item, props: { onClick: renderItemsClick(item) } };
};

export const renderItemsClick = (autocompleteRef, onClick) => (item) => () => {
    autocompleteRef.current.truncateResults(true);
    onClick(item);
};

export const useAutoCompleteClick = (autocompleteRef) => {
    const handleBodyClick = (e) => {
        if (!findParentByClass(e.target, "AutocompleteWithTabs")) {
            autocompleteRef.current.truncateResults(true);
        }
    };

    return React.useEffect(() => {
        document.body.addEventListener("click", handleBodyClick, {
            capture: true,
        });
        return () => {
            document.body.removeEventListener("click", handleBodyClick, {
                capture: true,
            });
        };
    }, []);
};

export const ScrollAreaWrap = ({ children, ...rest }) => {
    return (
        <ScrollArea
            style={{ maxHeight: 200, minHeight: 0 }}
            verticalScrollbarStyle={{ borderRadius: 5 }}
            horizontal={false}
            smoothScrolling={true}
            minScrollSize={48}
            {...rest}
        >
            {children}
        </ScrollArea>
    );
};
