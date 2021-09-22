import React, { FC, ReactNode } from "react";
import styled from "styled-components";

interface IQueryBarItemProps {
    id: string;
    renderComponent: ReactNode;
    activeItem?: any;
    searchComponent?: ReactNode;
    loadingComponent?: ReactNode;
    customClassName?: string;
    isLoading?: boolean;
}

const ItemContainer = styled.div`
    position: relative;
    min-width: 0;
`;

export const QueryBarItem: FC<IQueryBarItemProps> = ({
    id,
    customClassName,
    activeItem,
    isLoading,
    searchComponent,
    renderComponent,
    loadingComponent,
}) => {
    const className = `querybar-item${customClassName ? ` ${customClassName}` : ""}`;
    return (
        <ItemContainer className={className}>
            {renderComponent}
            {activeItem !== id
                ? null
                : !isLoading
                ? searchComponent && searchComponent
                : loadingComponent && loadingComponent}
        </ItemContainer>
    );
};

QueryBarItem.displayName = "QueryBarItem";
