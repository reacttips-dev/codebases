import { colorsPalettes } from "@similarweb/styles";
import { StyledPrimaryTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";
import styled from "styled-components";
import { FlexColumn, FlexRow } from "../../../../styled components/StyledFlex/src/StyledFlex";

export const LegendItems: any = styled(FlexRow)`
    > * {
        margin-right: 24px;
        &:last-child {
            margin-right: 0px;
        }
    }
`;
LegendItems.displayName = "LegendItems";

export const LegendItem: any = styled(FlexColumn)`
    min-height: 40px;
    justify-content: space-between;
`;
LegendItem.displayName = "LegendItem";

export const Duration: any = styled.div`
    color: ${({ color }) => color};
    font-size: 13px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;
Duration.displayName = "Duration";

export const Title: any = styled(FlexRow)`
    color: ${colorsPalettes.carbon[500]};
    font-size: 13px;
    align-items: baseline;
`;
Title.displayName = "Title";

export const Bullet: any = styled.div`
    background-color: ${({ color }) => color};
    width: 9px;
    height: 9px;
    border-radius: 50%;
    margin-right: 8px;
`;
Duration.displayName = "Duration";
