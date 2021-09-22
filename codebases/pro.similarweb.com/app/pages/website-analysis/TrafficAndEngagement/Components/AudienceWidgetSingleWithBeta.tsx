import React from "react";
import { useSelector } from "react-redux";
import { colorsPalettes } from "@similarweb/styles";
import I18n from "components/WithTranslation/src/I18n";
import { StyledPillGreen } from "components/React/Legends/styledComponents";
import styled from "styled-components";
import { SWReactCountryIcons, SWReactIcons } from "@similarweb/icons";
import { FlexRow } from "pages/website-analysis/website-content/leading-folders/components/Tab";
import { CircularLoader } from "components/React/CircularLoader";
import { Injector } from "common/ioc/Injector";
import { useLoading } from "custom-hooks/loadingHook";
import { DefaultFetchService } from "services/fetchService";
import { addBetaBranchParam } from "pages/website-analysis/TrafficAndEngagement/UtilityFunctionsAndConstants/UtilityFunctions";
import { MiniFlexTable } from "components/React/Table/FlexTable/Mini/MiniFlexTable";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { column, options } from "components/React/Table/SWReactTableDefaults";
import { WidgetBetaMessageWrapper } from "pages/website-analysis/TrafficAndEngagement/BetaBranch/CommonComponents";
import {
    areValuesEqualAvgWithTreshold,
    BetaMessage,
} from "pages/website-analysis/TrafficAndEngagement/BetaBranch/CommonComponents";

export const AudienceWidgetSingleWithBeta = (props) => {
    const {
        viewData,
        apiParams,
        apiController,
        apiWidgetType,
        tableDataColumns,
        tableOptions,
    } = props;

    const services = React.useMemo(
        () => ({
            swConnectedAccountsService: Injector.get("swConnectedAccountsService"),
        }),
        [],
    );

    const [visits, visitsOps] = useLoading();

    const showGAApprovedData = useSelector((state) => state.common?.showGAApprovedData ?? false);

    React.useEffect(() => {
        const { metric, ...params } = apiParams;
        const reqParams = { ...params, ShouldGetVerifiedData: showGAApprovedData };
        const endpoint = `/widgetApi/${apiController}/${metric}/${apiWidgetType}`;
        visitsOps.load(() =>
            Promise.all([
                DefaultFetchService.getInstance().get<any>(endpoint, reqParams),
                DefaultFetchService.getInstance().get<any>(endpoint, addBetaBranchParam(reqParams)),
            ]).then(([curResponse, betaResponse]) => ({
                ...curResponse,
                Data: [
                    ...betaResponse.Data.map((data) => ({ ...data, isBeta: true })),
                    ...curResponse.Data,
                ],
            })),
        );
    }, [apiController, apiWidgetType, apiParams, showGAApprovedData]);

    const tableData = React.useMemo(() => {
        const isGAVerified = visits.data?.KeysDataVerification[apiParams.keys] ?? false;
        const isGAPrivate = services.swConnectedAccountsService.isDomainInGoogleAnalyticsAccountPrivateSites(
            apiParams.keys,
        );
        return {
            Records: (visits.data?.Data ?? []).map((rec) => {
                return {
                    ...rec,
                    isGAVerified,
                    isGAPrivate,
                };
            }),
        };
    }, [visits.data]);

    const isSameData = React.useMemo(() => {
        if (visits.data) {
            return tableDataColumns.every((col) => {
                const normalizeValue = col.normalizeValueForComparison ?? ((v) => v);
                return areValuesEqualAvgWithTreshold(
                    (visits.data.Data ?? []).map((p) => normalizeValue(p?.[col.field])),
                );
            });
        }
    }, [visits.data, tableDataColumns]);

    const isLoading = [useLoading.STATES.INIT, useLoading.STATES.LOADING].includes(visits.state);

    const tableConfig = React.useMemo(
        () => ({
            columns: [
                column({
                    field: "Calculation",
                    displayName: "Calculation",
                    cellComponent: CalculationCell,
                }),
                ...(tableDataColumns ?? []).map(column),
            ],
            options: options({
                tableType: "swTable--simple",
                hideBorders: true,
                loadingSize: 5,
                ...tableOptions,
            }),
        }),
        [tableDataColumns, tableOptions],
    );

    return (
        <WidgetContainer>
            <WidgetWrapper>
                <WidgetFrame>
                    <WidgetTitleContainer>
                        <WidgetTitle>
                            <I18n>{viewData.title}</I18n>
                        </WidgetTitle>
                        {viewData.tooltip && (
                            <WidgetTitleTooltip data-scss-tooltip={viewData.tooltip}>
                                <WidgetTitleIconWrapper>
                                    <WidgetTitleInfoIcon />
                                </WidgetTitleIconWrapper>
                            </WidgetTitleTooltip>
                        )}
                    </WidgetTitleContainer>
                    <WidgetSubtitleContainer>
                        <WidgetSubtitleDurationCountryContainer>
                            <SWReactIcons
                                iconName="daily-ranking"
                                className="first-icon-inline"
                                size="xs"
                            />
                            <I18n>{viewData.customSubtitle || viewData.duration}</I18n>
                            <WidgetSubtitleCountryIcon countryCode={viewData.country.id} />
                            <span>{viewData.country.text}</span>
                        </WidgetSubtitleDurationCountryContainer>
                    </WidgetSubtitleContainer>
                    <WidgetContent height={isLoading ? viewData.loadingHeight : viewData.height}>
                        {isLoading ? (
                            <WidgetLoaderContainer>
                                <WidgetCircularLoader />
                            </WidgetLoaderContainer>
                        ) : (
                            <MiniFlexTable
                                tableData={tableData}
                                tableColumns={tableConfig.columns}
                                tableOptions={tableConfig.options}
                            />
                        )}
                        {isSameData && (
                            <WidgetBetaMessageWrapper>
                                <BetaMessage messageKey="wa.traffic.engagement.beta.graphs.coalesce" />
                            </WidgetBetaMessageWrapper>
                        )}
                    </WidgetContent>
                </WidgetFrame>
            </WidgetWrapper>
        </WidgetContainer>
    );
};

SWReactRootComponent(AudienceWidgetSingleWithBeta, "AudienceWidgetSingleWithBeta");

const CalculationCell = ({ row, GAVerifiedIcon }) => {
    return (
        <CalculationCellWrapper>
            {row.isBeta ? (
                <>
                    <I18n>wa.traffic.engagement.calculation.new</I18n>
                    <StyledPillGreen>BETA</StyledPillGreen>
                </>
            ) : (
                <>
                    <I18n>
                        {row.isGAVerified
                            ? "wa.traffic.engagement.calculation.ga"
                            : "wa.traffic.engagement.calculation.current"}
                    </I18n>
                    {GAVerifiedIcon}
                </>
            )}
        </CalculationCellWrapper>
    );
};
CalculationCell.displayName = "CalculationCell";

const WidgetContainer = styled.div.attrs({
    className: "widgetContainerTemplate",
})``;

const WidgetWrapper = styled.div.attrs({
    className: "swWidget fadeIn swWidget--top swWidget--boxShadow Website widget-state-2",
})``;

const WidgetFrame = styled.div.attrs({
    className: "swWidget-frame",
})``;

const WidgetTitleContainer = styled.div.attrs({
    className: "swWidgetTitle",
})`
    display: inline-flex;
    padding-bottom: 15px;
`;

const WidgetTitle = styled.div.attrs({
    className: "swHeader-title",
})``;

const WidgetTitleTooltip = styled.div.attrs({
    className: "swHeader-tooltip scss-tooltip scss-tooltip--s",
})``;

const WidgetTitleIconWrapper = styled.div.attrs({
    className: "centered-flex",
})``;

const WidgetTitleInfoIcon = styled(SWReactIcons).attrs({
    iconName: "info",
    className: "info-icon-widget-header",
})``;

const WidgetSubtitleContainer = styled.div.attrs({
    className: "swWidget-subTitle",
})`
    position: relative;
    top: -7px;
    display: block;
    margin-top: -20px;
    min-height: 15px;
    margin-bottom: 0;
`;

const WidgetSubtitleDurationCountryContainer = styled.div`
    display: flex;
    margin-bottom: 5px;
`;

const WidgetSubtitleCountryIcon = styled(SWReactCountryIcons).attrs({
    className: "inline-flag",
})`
    width: 1em;
    height: 1em;
    margin-right: 5px;
    position: relative;
    top: 1px;
    display: inline-block;
`;

const WidgetContent = styled.div<any>`
    height: ${({ height }) => height ?? "auto"};

    .swReactTable-container {
        .swReactTableCell {
            &.no-ga-verified-icon {
                .GAVerified-container {
                    display: none;
                }
            }
        }
    }
`;

const WidgetLoaderContainer = styled(FlexRow)`
    justify-content: center;
`;

const WidgetCircularLoader = styled(CircularLoader).attrs({
    options: {
        svg: {
            stroke: `${colorsPalettes.midnight[50]}`,
            strokeWidth: "4",
            r: 22,
            cx: 32,
            cy: 32,
        },
        style: {
            width: 65,
            height: 65,
        },
    },
})``;

const CalculationCellWrapper = styled.div`
    ${StyledPillGreen} {
        margin-left: 0.5em;
    }

    .GAVerified-container {
        margin-left: 0.5em;
        vertical-align: bottom;

        .GAVerified-icon-container {
            width: 1.25em;
            height: 1.25em;
            background-size: 0.7em 0.7em;
            background-position: 50% 50%;
        }
    }
`;
