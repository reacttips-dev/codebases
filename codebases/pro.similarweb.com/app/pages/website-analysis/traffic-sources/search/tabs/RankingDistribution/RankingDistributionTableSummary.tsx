import React, { useMemo } from "react";
import styled, { css } from "styled-components";
import { setFont } from "@similarweb/styles/src/mixins";
import { FlexColumn, FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { colorsPalettes, rgba } from "@similarweb/styles";
import {
    changeFilter,
    numberFilter,
    i18nFilter,
    pctSignFilter,
    percentageFilter,
} from "filters/ngFilters";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import { ChangeValue } from "@similarweb/ui-components/dist/change-value";
import { StyledColorBadge } from "pages/workspace/sales/components/WebsiteDomain/styles";
import {
    ETiers,
    tiersMeta,
} from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/Constants";

const Separator = styled.div`
    border-right: 1px solid ${colorsPalettes.carbon[100]};
`;
const ItemVertical = styled.div<{ isMainItem?: boolean }>`
    display: flex;
    flex-direction: column;
    ${({ isMainItem }) =>
        isMainItem &&
        css`
            //padding-right: 24px;
        `}
`;
const Title = styled.span<{ bold?: boolean }>`
    ${setFont({ $size: 14, $color: rgba(colorsPalettes.carbon[500], 0.8) })};
    font-weight: ${({ bold }) => (bold ? 700 : 400)};
    margin-bottom: 4px;
`;
Title.defaultProps = {
    bold: false,
};
const Number = styled.div`
    ${setFont({ $size: 24, $color: colorsPalettes.carbon[500], $weight: 400 })};
    margin-right: 2px;
`;

const ColorBadge = styled(StyledColorBadge)`
    position: static;
    transform: translateY(3px);
    margin-right: 9px;
`;

const SecondaryItem = styled(FlexRow)`
    margin-right: 29px;
`;
const Container = styled(FlexRow)`
    border-top: 1px solid ${colorsPalettes.carbon[100]};
    padding: 16px 24px 16px 24px;
`;

interface IRankingDistributionTableSummaryData {
    CurrentTotal?: number;
    CurrentRange01To03?: number;
    CurrentRange04To10?: number;
    CurrentRange11To20?: number;
    CurrentRange21To50?: number;
    CurrentRange51To100?: number;
}

const calcChange = (current, previous) => {
    if (!previous || previous === 0) {
        return null;
    }
    return (current - previous) / previous;
};

const NoValue = styled.span`
    ${setFont({ $size: 12, $color: colorsPalettes.carbon[300] })};
    line-height: 12px;
`;

const transformData = (data, duration) => {
    const getCurrentMonthPoint = (data = []) => {
        const item = data.find(
            (datapoint) => datapoint[0] === duration.split("-")[0].replace(".", "-"),
        );
        if (item) {
            return item[1];
        }
    };
    const result = {
        CurrentRange01To03: pctSignFilter()(
            percentageFilter()(getCurrentMonthPoint(data["01-03"]), 2),
        ),
        CurrentRange04To10: pctSignFilter()(
            percentageFilter()(getCurrentMonthPoint(data["04-10"]), 2),
        ),
        CurrentRange11To20: pctSignFilter()(
            percentageFilter()(getCurrentMonthPoint(data["11-20"]), 2),
        ),
        CurrentRange21To50: pctSignFilter()(
            percentageFilter()(getCurrentMonthPoint(data["21-50"]), 2),
        ),
        CurrentRange51To100: pctSignFilter()(
            percentageFilter()(getCurrentMonthPoint(data["51-100"]), 2),
        ),
    };
    return result;
};
const LoadingComponent = () => {
    return (
        <FlexColumn>
            <PixelPlaceholderLoader width={72} height={16} />
            <div style={{ height: 6 }} />
            <PixelPlaceholderLoader width={95} height={24} />
        </FlexColumn>
    );
};
export const RankingDistributionTableSummary: React.FC<{
    data: IRankingDistributionTableSummaryData;
    duration: string;
    isLoading?: boolean;
}> = ({ data = {}, duration, isLoading }) => {
    const transformedData = useMemo(() => transformData(data, duration), [data, duration]);
    const allItems = [
        {
            text: tiersMeta[ETiers.TIER1].text,
            color: tiersMeta[ETiers.TIER1].color,
            count: transformedData.CurrentRange01To03,
        },
        {
            text: tiersMeta[ETiers.TIER2].text,
            color: tiersMeta[ETiers.TIER2].color,
            count: transformedData.CurrentRange04To10,
        },
        {
            text: tiersMeta[ETiers.TIER3].text,
            color: tiersMeta[ETiers.TIER3].color,
            count: transformedData.CurrentRange11To20,
        },
        {
            text: tiersMeta[ETiers.TIER4].text,
            color: tiersMeta[ETiers.TIER4].color,
            count: transformedData.CurrentRange21To50,
        },
        {
            text: tiersMeta[ETiers.TIER5].text,
            color: tiersMeta[ETiers.TIER5].color,
            count: transformedData.CurrentRange51To100,
        },
    ];
    return (
        <Container>
            {allItems.map((item) => {
                return (
                    <SecondaryItem key={item.text}>
                        {isLoading && <LoadingComponent />}
                        {!isLoading && (
                            <>
                                <ColorBadge color={item.color} />
                                <ItemVertical>
                                    <Title>{item.text}</Title>
                                    <FlexRow alignItems="flex-end">
                                        <Number>{item.count}</Number>
                                    </FlexRow>
                                </ItemVertical>
                            </>
                        )}
                    </SecondaryItem>
                );
            })}
        </Container>
    );
};
