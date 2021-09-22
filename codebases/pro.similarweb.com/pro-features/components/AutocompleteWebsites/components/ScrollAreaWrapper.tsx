import React from "react";
import { ScrollArea } from "@similarweb/ui-components/dist/react-scrollbar";

export const ScrollAreaWrap = ({ children, ...rest }) => {
    return (
        <ScrollArea
            style={{ maxHeight: 208, minHeight: 0 }}
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
