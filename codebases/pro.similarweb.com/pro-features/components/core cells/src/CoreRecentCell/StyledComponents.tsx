import { StyledPrimaryTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";
import { FlexRow } from "../../../../styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";
import { ItemIcon } from "@similarweb/ui-components/dist/item-icon";

export const GrayText = styled.span`
    color: #a4aeb8;
    font-family: Roboto;
    font-size: 16px;
`;

export const VsText = styled(GrayText)`
    padding: 0 10px;
`;

export const TextContainer = styled.div`
    padding-left: 15px;
    color: #2a3e52;
    font-family: Roboto;
    font-size: 16px;
    letter-spacing: 0.2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const SecTextContainer = styled(TextContainer)`
    padding-left: 5px;
`;

export const SubtitleContainer = styled.div`
    color: #a4aeb8;
    font-family: Roboto;
    margin-left: 39px;
    display: flex;
    min-width: 0;
`;

export const AppSubtitleContainer = styled(SubtitleContainer)`
    margin-left: 43px;
`;

export const LoaderSubtitleContainer = styled.div`
    margin-left: 38px;
    margin-top: 7px;
    height: 14px;
`;

export const Subtitle = styled.span`
    font-size: 14px;
    letter-spacing: 0.2px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

export const Flex = styled(FlexRow)`
    align-items: center;
    flex-wrap: wrap;
    flex-direction: row;
`;

export const PivotContainer = styled.div`
    min-width: 0;
    display: flex;
    align-items: center;
`;

export const CompetitorsContainer = styled(PivotContainer)`
    flex: 2;
`;

export const CompetitorContainer = styled(PivotContainer)`
    padding-right: 8px;
    flex-grow: 0;
    flex-shrink: 1;
`;

export const StyledItemIcon = styled(ItemIcon)`
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    border-color: #d6dbe1;
    display: flex;

    .ItemIcon-img {
        width: 18px;
        height: 18px;
    }
`;

export const StyledAppItemIcon = styled(StyledItemIcon)`
    width: 24px;
    height: 24px;
`;
export enum BreakpointsViews {
    Desktop = "(min-width: 769px)",
    Mobile = "(max-width: 768px)",
}
