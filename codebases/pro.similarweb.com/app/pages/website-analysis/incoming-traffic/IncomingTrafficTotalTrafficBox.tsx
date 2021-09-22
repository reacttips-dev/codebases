import { colorsPalettes, mixins } from "@similarweb/styles";
import { Box } from "@similarweb/ui-components/dist/box";
import dayjs, { Dayjs } from "dayjs";
import { FunctionComponent } from "react";
import styled from "styled-components";
import BoxSubtitle from "../../../../.pro-features/components/BoxSubtitle/src/BoxSubtitle";
import { StyledHeaderTitle } from "../../../../.pro-features/pages/conversion/components/benchmarkOvertime/StyledComponents";
import { TitleContainer } from "../../../../.pro-features/pages/conversion/components/ConversionScatterChart/StyledComponents";
import { PrimaryBoxTitle } from "../../../../.pro-features/styled components/StyledBoxTitle/src/StyledBoxTitle";
import { FlexColumn, FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { CircularLoader } from "components/React/CircularLoader";
import { i18nFilter, minVisitsAbbrFilter, percentageFilter } from "../../../filters/ngFilters";
import { IIncomingTrafficPageData } from "./compare/IncomingTrafficCompare";
import { SubTitleReferrals } from "./StyledComponents";
import { MMXAlertWithPlainTooltip } from "components/MMXAlertWithPlainTooltip";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";
import { swSettings } from "common/services/swSettings";

const StyledBox = styled(Box).attrs<{ height: number; width: number | string }>({
    width: ({ width }) => width,
})<{ height: number; width: number | string }>`
    height: ${({ height }) => height}px;
    display: flex;
    flex-direction: column;
`;

const Wrapper = styled.div`
    height: 100%;
    ${mixins.setFont({ $color: colorsPalettes.carbon[500], $weight: 300 })};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;
const Total = styled.div`
    ${mixins.setFont({ $size: 48 })};
    margin-bottom: 28px;
`;

const Percentage = styled.div`
    ${mixins.setFont({ $size: 16 })};
    text-transform: capitalize;
`;

const MMXAlertWrapper = styled.div`
    align-self: center;
    margin-top: 3px;
    margin-left: 2px;
`;

interface IIncomingTrafficTotalTrafficBoxProps {
    webSource: string;
    from: Dayjs;
    to: Dayjs;
    totalTrafficData: { visits: number; percentage: number };
    isLoading?: boolean;
    is28d?: boolean;
}

export const IncomingTrafficTotalTrafficBox: FunctionComponent<IIncomingTrafficTotalTrafficBoxProps> = ({
    webSource,
    from,
    to,
    totalTrafficData,
    isLoading = false,
    is28d = false,
}) => {
    const subTitleFilters = [
        {
            filter: "date",
            value: {
                from,
                to,
                useRangeDisplay: !is28d && from.format("YYYY-MM") !== to.format("YYYY-MM"),
            },
        },
        {
            filter: "webSource",
            value: webSource,
        },
    ];
    const title = i18nFilter()("analysis.compare.trafficsource.overview.share");
    const tooltip = i18nFilter()("analysis.compare.trafficsource.overview.share.tooltip");
    let trafficText = "";
    switch (webSource) {
        case "Desktop":
            trafficText = "analysis.totalvisits.span";
            break;
        case "MobileWeb":
            trafficText = "analysis.totalvisits.mobile.span";
            break;
        case "Total":
            trafficText = "analysis.totalvisits.span.alltraffic";
            break;
    }
    const newMMXAlgoStartData = swSettings.current.resources.NewAlgoMMX;
    const isShowMMXAlertBell =
        webSource !== devicesTypes.DESKTOP &&
        from.isBefore(dayjs(newMMXAlgoStartData)) &&
        to.isAfter(dayjs(newMMXAlgoStartData));

    return (
        <div className="span4">
            <StyledBox width="100%" height={340}>
                <TitleContainer>
                    <FlexColumn>
                        <StyledHeaderTitle>
                            <FlexRow>
                                <PrimaryBoxTitle
                                    tooltip={tooltip}
                                    customElement={
                                        isShowMMXAlertBell && (
                                            <MMXAlertWrapper>
                                                <MMXAlertWithPlainTooltip />
                                            </MMXAlertWrapper>
                                        )
                                    }
                                >
                                    {title}
                                </PrimaryBoxTitle>
                            </FlexRow>
                            <SubTitleReferrals>
                                <BoxSubtitle filters={subTitleFilters} />
                            </SubTitleReferrals>
                        </StyledHeaderTitle>
                    </FlexColumn>
                </TitleContainer>
                <Wrapper>
                    {isLoading ? (
                        <CircularLoader
                            options={{ svg: { stroke: colorsPalettes.carbon["200"] } }}
                        />
                    ) : (
                        <>
                            <Total>{minVisitsAbbrFilter()(totalTrafficData.visits)}</Total>
                            <Percentage>
                                {percentageFilter()(totalTrafficData.percentage, 2)}%{" "}
                                {i18nFilter()(trafficText)}
                            </Percentage>
                        </>
                    )}
                </Wrapper>
            </StyledBox>
        </div>
    );
};

export const IncomingTrafficTotalTrafficBoxTransformer = (
    data: IIncomingTrafficPageData,
    chosenSites,
) => {
    const { name } = chosenSites.getPrimarySite();
    const { SearchTotal, VolumeTotal } = data.dictionary[name];
    return {
        totalTrafficData: {
            visits: SearchTotal,
            percentage: SearchTotal / VolumeTotal,
        },
    };
};
