import React from "react";
import { colorsPalettes } from "@similarweb/styles";
import { ScrollArea } from "@similarweb/ui-components/dist/react-scrollbar";
import { Collapsible } from "@similarweb/ui-components/dist/collapsible";
import styled, { css } from "styled-components";
import { SWReactIcons } from "@similarweb/icons";

export const ListItemSeparatorCollapsible = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 12px 12px 10px 20px;
    cursor: pointer;
    font-size: 12px;
    line-height: 16px;
    font-weight: 500;
    color: ${colorsPalettes.carbon["300"]};
    text-transform: uppercase;
    transition: color 250ms;
    &:not(:first-child):before {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        height: 1px;
        width: calc(100% - 20px);
        margin-left: 10px;
        margin-right: 10px;
        background: ${colorsPalettes.carbon["50"]};
    }
    &:hover {
        color: ${colorsPalettes.carbon["400"]};
    }
`;

export const ListItemCollapsibleSeparatorArrowIcon = styled(SWReactIcons).attrs(
    ({ isCollapsed }) => ({
        iconName: isCollapsed ? "chev-down" : "chev-up",
        size: "sm",
    }),
)`
    width: 20px;
    height: 20px;
`;

const ScrollAreaWrapperComponent: React.ForwardRefRenderFunction<any, any> = (
    { children },
    forwardedRef,
) => (
    <div className="ListItemsScrollContainer">
        <ScrollArea
            ref={forwardedRef}
            style={{ flex: "auto", height: "100%" }}
            verticalScrollbarStyle={{ borderRadius: 5 }}
            horizontal={false}
            smoothScrolling={true}
            minScrollSize={48}
        >
            {children}
        </ScrollArea>
    </div>
);
export const ScrollAreaWrapper = React.forwardRef(ScrollAreaWrapperComponent);

interface IListItemCollapsibleSeparator {
    children: React.ReactNode;
    title: React.ReactNode;
    initialCollapsed?: boolean;
}

export const ListItemCollapsibleSeparator: React.FC<IListItemCollapsibleSeparator> = ({
    children,
    title,
    initialCollapsed = false,
}) => {
    const [isCollapsed, setIsCollapsed] = React.useState(initialCollapsed);
    const toggleCollapsed = React.useCallback(() => {
        setIsCollapsed(!isCollapsed);
    }, [isCollapsed]);
    return (
        <>
            <ListItemSeparatorCollapsible onClick={toggleCollapsed}>
                {title}
                <ListItemCollapsibleSeparatorArrowIcon isCollapsed={isCollapsed} />
            </ListItemSeparatorCollapsible>
            <Collapsible isActive={!isCollapsed}>{children}</Collapsible>
        </>
    );
};
