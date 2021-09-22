import React from "react";
import { ScrollArea } from "@similarweb/ui-components/dist/react-scrollbar";
import {
    SCROLL_AREA_STYLE,
    VERTICAL_SCROLLBAR_STYLE,
    VERTICAL_SCROLLBAR_CONTAINER_STYLE,
} from "../constants";

type DropdownGroupedContentProps = {
    scrollAreaStyle?: React.CSSProperties;
    verticalScrollbarStyle?: React.CSSProperties;
    verticalContainerStyle?: React.CSSProperties;
    setScrollAreaRef?: React.LegacyRef<ScrollArea>;
};

const ScrollableDropdownContainer: React.FC<DropdownGroupedContentProps> = ({
    children,
    setScrollAreaRef,
    scrollAreaStyle = SCROLL_AREA_STYLE,
    verticalScrollbarStyle = VERTICAL_SCROLLBAR_STYLE,
    verticalContainerStyle = VERTICAL_SCROLLBAR_CONTAINER_STYLE,
}) => {
    return (
        <ScrollArea
            smoothScrolling
            style={scrollAreaStyle}
            verticalScrollbarStyle={verticalScrollbarStyle}
            verticalContainerStyle={verticalContainerStyle}
            ref={setScrollAreaRef ? setScrollAreaRef : undefined}
        >
            {children}
        </ScrollArea>
    );
};

export default ScrollableDropdownContainer;
