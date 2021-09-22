import { colorsPalettes } from "@similarweb/styles";
import { ShareBarChartValue, ShareBarContainer } from "@similarweb/ui-components/dist/share-bar";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";
import StyledBoxSubtitle from "../../../../.pro-features/styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";

export interface ISourceSubtitleItem {
    color: string;
}

export const CombinedSourceSubtitleItemContainer = styled.div`
    display: flex;
    align-items: center;
`;
CombinedSourceSubtitleItemContainer.displayName = "CombinedSourceSubtitleItemContainer";

export const SourceSubtitleItem = styled.div<ISourceSubtitleItem>`
    display: flex;
    align-items: center;
    margin-right: 6px;

    &::before {
        display: block;

        content: " ";

        width: 8px;
        height: 8px;

        margin: 0 3px;

        box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1);

        border: 1px solid ${colorsPalettes.carbon[0]};
        border-radius: 50%;

        background: ${({ color }) => color};
    }
`;
SourceSubtitleItem.displayName = "SourceSubtitleItem";

export const EngagementBoxSubtitle = styled(StyledBoxSubtitle)`
    margin-top: 6px;
`;
EngagementBoxSubtitle.displayName = "EngagementBoxSubtitle";

export const DeviceSplitColumn = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    ${ShareBarContainer} {
        width: 100%;
        margin: 0 8px;
    }
`;
DeviceSplitColumn.displayName = "DeviceSplitColumn";

export const BigShareBarColumn = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    ${ShareBarContainer} {
        width: 100%;
        margin-left: 8px;
    }

    ${ShareBarChartValue} {
        border-radius: 3px;
    }
`;
BigShareBarColumn.displayName = "BigShareBarColumn";
