import styled, { css } from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";

export const flexFixed = css`
    flex: none;
`;
export const flexAutoScrollContainer = css`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    & > * {
        ${flexFixed}
    }
`;
export const flexAutoScroll = css`
    flex: auto;
    overflow: auto;
`;

export const SegmentLabel = styled.div<{ hasCategory: boolean }>`
    display: flex;
    flex-direction: column;
    justify-content: ${({ hasCategory }) => (hasCategory ? "flex-start" : "center")};
    width: 100%;
    overflow-y: hidden;
    overflow-x: hidden;
`;
SegmentLabel.displayName = "SegmentLabel";

export const SegmentCategory = styled.span`
    width: calc(100% - 30px);
    
    color: ${colorsPalettes.carbon[300]};
    font-size: 14px;
    
    white-space: nowrap;
    
    text-overflow: ellipsis;
    text-indent: 8px;
    
    overflow-x: hidden;
}
`;
SegmentCategory.displayName = "SegmentCategory";

export const DomainWrapper = styled.span`
    text-indent: 8px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;
DomainWrapper.displayName = "DomainWrapper";

export const Domain = styled.span`
    flex-grow: 0;
`;

export const DropdownBannerContainer = styled.div`
    justify-content: center;
    align-items: center;
    padding: 8px 12px;
`;

export const DropdownBanner = styled(FlexRow)`
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    background-color: ${colorsPalettes.blue[100]};
    border-radius: 6px;
    ${mixins.setFont({
        $size: 14,
        $weight: 500,
        $color: colorsPalettes.midnight[500],
    })}
`;

export const DropdownBannerBlock = styled(FlexRow)`
    & > * {
        margin: 0 4px;
    }
`;
