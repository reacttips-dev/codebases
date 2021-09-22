import * as React from "react";
import { colorsPalettes, mixins } from "@similarweb/styles";
import styled, { css } from "styled-components";

import MetricsCompareBars from "../../../../components/React/MetricsCompareBars/MetricsCompareBars";
import { changeFilter, i18nFilter, minVisitsAbbrFilter } from "../../../../filters/ngFilters";
import { PercentsNumberSwitcher } from "../../../../components/React/switcher/commonSwitchers";
import { ChangeCell } from "../../../../../.pro-features/components/Workspace/TableCells/ChangeCell";
import { StyledTitleIcon } from "../../../../../.pro-features/styled components/Workspace/src/StyledWorkspaceBox";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { FunctionComponent } from "react";

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

const TrafficShareContainer = styled.div`
    display: flex;
    align-items: center;
`;

const MetricsCompareBarsStyled = styled(MetricsCompareBars)<{ isFetching: boolean; items: any }>`
    ${css`
        margin-right: 22px;
        flex-grow: 1;
    `}
`;

const Title = styled.div`
    display: flex;
    align-items: center;
    ${mixins.setFont({ $size: 16, $color: colorsPalettes.carbon[500] })};
`;

const Change = styled.div`
    margin: 0 5px 0 10px;
    > div {
        height: auto;
        border: 0;
        line-height: inherit;
    }
`;

export interface IMarketingWorkspaceTotalTrafficShareProps {
    data: {
        bars: Array<{
            color: string;
            name: string;
            value: number;
            percentage: number;
            width: number;
        }>;
        total: number;
        change: number;
    };
    loading: boolean;
    title: string;
    tooltipTitle: string;
    displayType: string;
    setDisplayType: (displayType) => void;
}

export const MarketingWorkspaceTotalTrafficShare: FunctionComponent<IMarketingWorkspaceTotalTrafficShareProps> = ({
    title,
    tooltipTitle,
    data,
    loading,
    displayType,
    setDisplayType,
}) => {
    const titleTranslated = i18nFilter()(title, {
        value: minVisitsAbbrFilter()(data.total).toString(),
    });
    const tooltipTitleTranslated = i18nFilter()(tooltipTitle);
    const dataWithValueTexts = {
        ...data,
        bars: data.bars.map((item) => {
            return {
                ...item,
                valueText:
                    displayType === "percent"
                        ? changeFilter()(item.percentage)
                        : minVisitsAbbrFilter()(item.value),
            };
        }),
    };
    return (
        <Container>
            {!loading && (
                <Title>
                    {titleTranslated}
                    <Change>
                        <ChangeCell value={data.change} />
                    </Change>
                    <PlainTooltip tooltipContent={tooltipTitleTranslated}>
                        <div>
                            <StyledTitleIcon iconName="info" size="xs" />
                        </div>
                    </PlainTooltip>
                </Title>
            )}
            <TrafficShareContainer>
                <MetricsCompareBarsStyled
                    isFetching={loading}
                    items={[dataWithValueTexts]}
                    title={i18nFilter()(
                        "analysis.source.search.keywords.header.split.tooltip.title",
                    )}
                />
                {
                    <PercentsNumberSwitcher
                        style={{ marginLeft: "auto", alignSelf: "flex-start" }}
                        itemList={[
                            { title: "%", value: "percent" },
                            {
                                title: "#",
                                value: "number",
                                // disabled: !total || total < 5000,
                                disabled: false,
                                // tooltipText: total < 5000 ? i18nFilter("search.keywords.numbertoggle.disabled.tooltip") : null
                            },
                        ]}
                        selectedIndex={displayType}
                        customClass="CircleSwitcher"
                        onItemClick={setDisplayType}
                    />
                }
            </TrafficShareContainer>
        </Container>
    );
};

MarketingWorkspaceTotalTrafficShare.defaultProps = {
    data: {
        bars: [],
        total: 0,
        change: 0,
    },
    loading: false,
    displayType: "percent",
};
