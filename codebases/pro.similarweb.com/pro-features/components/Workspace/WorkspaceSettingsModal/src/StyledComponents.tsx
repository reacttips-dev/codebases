import { colorsPalettes, mixins, rgba } from "@similarweb/styles";
import { TabList } from "@similarweb/ui-components/dist/tabs";
import * as React from "react";
import styled from "styled-components";

export const WorkspaceName = styled.span``;
export const Title = styled.div`
    margin: 24px;
    ${mixins.setFont({ $size: 16, $color: colorsPalettes.carbon[500] })};
    ${WorkspaceName} {
        ${mixins.setFont({ $weight: 500 })};
    }
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 20px;
`;
export const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    ${TabList} {
        height: auto;
        background-color: ${colorsPalettes.carbon["0"]};
        box-shadow: 0px 3px 6px 0px rgba(14, 30, 62, 0.08);
        border-radius: 6px;
        flex-grow: 1;
    }
`;

export const TabContent = styled.div`
    padding: 28px;
    box-sizing: border-box;
`;

export const ButtonContainer = styled.div`
    padding: 16px;
    border-top: 1px solid ${colorsPalettes.carbon[50]};
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

export const LeftButtons = styled.div``;
export const RightButtons = styled.div`
    display: flex;
    align-items: center;
`;

// export const Title = styled.div`
//   ${mixins.setFont({$size: 16, $color: colorsPalettes.carbon[500], $weight: 500})};
//   margin-bottom: 16px;
// `;

export const Text = styled.span`
    ${mixins.setFont({ $size: 14, $color: colorsPalettes.carbon[300] })};
    line-height: 1.2;
`;

export const ArenasPreview = styled.div`
    background-color: ${rgba(colorsPalettes.carbon[25], 0.7)};
    border-radius: 6px;
    height: 46px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    margin: 8px 0 8px;
`;

export const ArenasPrefix = styled(Text)`
    ${mixins.setFont({ $color: colorsPalettes.carbon[500] })};
`;

export const GroupSelectorContainer = styled.div`
    border: 1px solid ${colorsPalettes.carbon[50]};
    border-radius: 8px;
    overflow: hidden;
`;

export const AssetsManagementText = styled.span`
    ${mixins.setFont({ $size: 14, $color: colorsPalettes.carbon[500] })};
    margin-bottom: 8px;
    padding: 0 2px;
`;
