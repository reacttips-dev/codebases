import { colorsPalettes, rgba } from "@similarweb/styles";
import styled, { css } from "styled-components";

export const TooltipContainer: any = styled.div`
    .trafficShareTooltip-element-content & {
        padding: 0;
        border-radius: 10px;
    }
    background-color: ${colorsPalettes.carbon[0]};
    padding: 14px;
    width: auto;
`;
TooltipContainer.displayName = "TooltipContainer";

export const Title: any = styled.div`
    font-weight: 500;
    font-size: 14px;
    margin-bottom: 12px;
    line-height: 20px;
    color: ${rgba(colorsPalettes.carbon[500], 0.8)};
`;
Title.displayName = "Title";

export const SiteContainer: any = styled.div`
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    &:last-child {
        margin-bottom: 0px;
    }
`;
SiteContainer.displayName = "SiteContainer";

export const SiteBullet: any = styled.div<{ color: string }>`
    flex-grow: 0;
    flex-shrink: 0;
    margin-top: 4px;
    width: 12px;
    height: 12px;
    margin-right: 8px;
    border-radius: 50%;
    background-color: ${({ color }) => color};
`;
SiteBullet.displayName = "SiteBullet";

export const SiteName: any = styled.div`
    font-size: 14px;
    line-height: 20px;
    flex-grow: 3;
    font-weight: 400;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;
SiteName.displayName = "SiteName";

export const SiteShare: any = styled.div`
    font-size: 14px;
    flex-grow: 0;
    flex-shrink: 0;
    color: ${rgba(colorsPalettes.carbon[500], 0.8)};
`;
SiteShare.displayName = "SiteShare";
