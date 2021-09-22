import { NoDataIcon, NoDataText, NoDataWrapper } from "./AppsQueryBarAutocompleteStyles";
import React from "react";
import { ScrollArea } from "@similarweb/ui-components/dist/react-scrollbar/src/ScrollArea";

export const NoData = ({ text }) => (
    <NoDataWrapper>
        <NoDataIcon iconName="globe" />
        <NoDataText>{text}</NoDataText>
    </NoDataWrapper>
);

export const ScrollAreaWrap = ({ children, ...rest }) => {
    return (
        <ScrollArea
            style={{ maxHeight: 208, minHeight: 0 }}
            contentStyle={{ marginTop: 0 }}
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
