import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

export const SelectedAssetContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-right: 16px;
    margin-bottom: 16px;
`;

export const AssetIconWrapper = styled.div`
    margin-right: 4px;
`;

export const AssetTextWrapper = styled.span`
    max-width: 152px;
    font-size: 13px;
    color: ${colorsPalettes.carbon[400]};
    font-weight: 400;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const IndustryTextWrapper = styled(AssetTextWrapper)`
    max-width: 250px;
`;
