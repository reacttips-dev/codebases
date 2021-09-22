import * as React from "react";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { colorsPalettes, mixins, rgba } from "@similarweb/styles";
import styled from "styled-components";
import { SearchContainer } from "pages/workspace/StyledComponent";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";

export const CloseIconButton = styled(IconButton)`
    margin-left: 10px;
`;

export const RowDetailHeader = styled(FlexRow)`
    padding: 19px 20px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid ${colorsPalettes.carbon[50]};
`;

export const RowDetailHeaderLeft = styled(FlexRow)`
    align-items: center;
    flex-grow: 1;
    justify-content: flex-start;
`;

export const RowDetailHeaderIndex = styled.div`
    padding-left: 14px;
    width: 40px;
`;

export const BaseWrap = styled.div`
    position: relative;
`;

export const AdNetworksWrap = styled(BaseWrap)`
    padding-left: 13px;
    width: 220px;
    font-size: 14px;
    font-family: Roboto;
`;

export const TrafficShareWrap = styled(BaseWrap)`
    padding-left: 13px;
    padding-right: 11px;
    width: 275px;
`;

export const ChangeWrap = styled(BaseWrap)`
    padding-left: 13px;
    width: 115px;
    .changePercentage {
        text-align: left;
    }
`;

export const LeaderWrap = styled(BaseWrap)`
    margin-left: 13px;
    flex-grow: 1;
`;

export const FieldTitle = styled.div`
    position: absolute;
    top: -20px;
    ${mixins.setFont({ $size: 12, $weight: 500, $color: rgba(colorsPalettes.carbon[500], 0.6) })};
`;

export const RowDetailBody = styled.div`
    padding: 24px;
    height: 330px;
`;

export const ChartTitle = styled.div`
    ${mixins.setFont({ $size: 16, $weight: 500, $color: colorsPalettes.carbon[500] })};
    margin-bottom: 20px;
`;

export const Right = styled(FlexRow)`
    flex-grow: 0;
    align-items: center;
    margin-left: 10px;
`;

export const SectionContainer = styled.div`
    padding: 0 24px;
`;

export const Container = styled(FlexRow)`
    align-items: center;
    ${SearchContainer} {
        flex-grow: 1;
    }
`;

export const SearchContainerWrapper = styled(SearchContainer)`
    border-top: none;
    padding-right: 16px;
    height: 48px;
    font-size: 14px;
`;

export const NewChangeWrapper = styled(FlexRow)`
    justify-content: flex-end;
`;
