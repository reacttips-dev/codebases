import * as React from "react";
import styled, { css } from "styled-components";

export const WorkspaceGrid = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
`;
WorkspaceGrid.displayName = "WorkspaceGrid";

export interface IWorkspaceGridColumnProps {
    size: number;
}

export const WorkspaceGridSimpleColumn = styled.div<IWorkspaceGridColumnProps>`
    display: inline-block;
    width: ${({ size }) => `calc(${(100 / 3) * size}% - 24px)`};
    margin-right: 24px;
    box-sizing: content-box;
    &:last-of-type {
        margin-right: 0;
        width: ${({ size }) => `calc(${(100 / 3) * size}% - 0px)`};
    }
    @media (max-width: 1024px) {
        width: 100%;
    }
`;

export const WorkspaceGridColumnNoMedia = styled.div<IWorkspaceGridColumnProps>`
    display: inline-block;
    width: ${({ size }) => `calc(${(100 / 3) * size}% - 24px)`};
    margin-right: 24px;
    box-sizing: content-box;
    &:last-of-type {
        margin-right: 0;
        width: ${({ size }) => `calc(${(100 / 3) * size}% - 0px)`};
    }
`;

export const WorkspaceGridColumn = styled.div<IWorkspaceGridColumnProps>`
    display: flex;
    flex-direction: column;
    flex-grow: ${({ size }) => `${size}`};
    margin-right: 24px;
    max-width: ${({ size }) => `${size * 33.333}%`};
    &:last-of-type {
        margin-right: 0;
    }
`;
WorkspaceGridColumn.displayName = "WorkspaceGridColumn";

export const WorkspaceGridItem = styled.div`
    width: 100%;
    margin-bottom: 16px;
`;
WorkspaceGridItem.displayName = "WorkspaceGridItem";
