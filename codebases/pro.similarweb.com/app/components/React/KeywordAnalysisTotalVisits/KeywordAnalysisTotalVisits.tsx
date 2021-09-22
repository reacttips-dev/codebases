import { colorsPalettes, mixins, colorsSets } from "@similarweb/styles";
import { KeywordAnalysisTrendsBarContainer } from "pages/keyword-analysis/KeywordAnalysisTrendsBar";
import { OrganicDataRows } from "pages/keyword-analysis/OrganicSearchZeroClicks";
import React from "react";
import styled from "styled-components";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { FC } from "react";
import { minVisitsAbbrFilter } from "../../../filters/ngFilters";
import { Legend } from "../../../../.pro-features/components/Legends/src/LegendBase/Legend";
import { TrendsBar } from "../../../../.pro-features/components/TrendsBar/src/TrendsBar";
import dayjs from "dayjs";

export const KeywordAnalysisTotalVisitsConatainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
`;

export const KeywordAnalysisTotalVisitsNumber = styled.div`
    color: ${colorsPalettes.midnight[600]};
    @media (min-width: 1367px) {
        display: block;
        animation: fadeIn 0.8s ease-in;
        ${mixins.setFont({ $size: 38 })};
    }
    @media (max-width: 1366px) {
        display: block;
        animation: fadeIn 0.8s ease-in;
        ${mixins.setFont({ $size: 30 })};
    }
    font-weight: 300;
    height: 100%;
`;

export const KeywordAnalysisTotalVisitsNumberContainer = styled.div`
    min-width: 50%;
    flex-shrink: 0;
    margin-right: 14px;
    height: 100%;
`;

export const KeywordAnalysisTotalVisitsTrendContainer = styled.div`
    max-width: 50%;
    flex-shrink: 0;
    height: 100%;
`;
const KeywordAnalysisTotalVisitsTrendRightCornerContainer = styled(
    KeywordAnalysisTotalVisitsTrendContainer,
)`
    height: 48px;
    max-width: 100%;
`;

export const KeywordAnalysisTotalVisitsDashboardConatainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    ${KeywordAnalysisTotalVisitsNumberContainer} {
        margin-right: 0px;
        min-width: 0px;
    }
    ${KeywordAnalysisTotalVisitsNumber} {
        font-weight: 400;
        font-size: 46px;
    }
`;

export const KeywordAnalysisTotalVisitsCalculator = {
    calculateAverages: (trafficTrend, maxMonths) => {
        const trend = [];
        let calculatedAvgVisits = 0;
        let calculatedAvgOrganic = 0;
        let calculatedAvgPaid = 0;

        if (!trafficTrend) {
            return null;
        }

        Object.keys(trafficTrend).forEach((date) => {
            const dateFormat = dayjs(date).format("MMM, YYYY");
            const totalVisits = trafficTrend[date]["TotalVisits"];
            const value = [
                trafficTrend[date]["OrganicShare"] * totalVisits,
                trafficTrend[date]["PaidShare"] * totalVisits,
            ];

            calculatedAvgOrganic += value[0];
            calculatedAvgPaid += value[1];
            calculatedAvgVisits += totalVisits;

            trend.push({
                value,
                tooltip: (
                    <div style={{ display: "flex", flexDirection: "column", width: "190px" }}>
                        <div>{dateFormat}</div>
                        <Legend
                            color={colorsSets.b1.toArray()[0]}
                            size="s"
                            isMain={true}
                            name={`Organic ${(trafficTrend[date]["OrganicShare"] * 100).toFixed(
                                2,
                            )}%`}
                        />
                        <Legend
                            color={colorsSets.b1.toArray()[1]}
                            size="s"
                            isMain={true}
                            name={`Paid ${(trafficTrend[date]["PaidShare"] * 100).toFixed(2)}%`}
                        />
                    </div>
                ),
            });
        });

        calculatedAvgOrganic = (calculatedAvgOrganic / calculatedAvgVisits) * 100;
        calculatedAvgPaid = (calculatedAvgPaid / calculatedAvgVisits) * 100;
        calculatedAvgVisits = calculatedAvgVisits / maxMonths;

        return {
            trend,
            calculatedAvgVisits,
            calculatedAvgPaid,
            calculatedAvgOrganic,
        };
    },
};

export interface IKeywordAnalysisTotalVisitsProps {
    trafficTrend: any;
    dashboardView?: boolean;
    maxMonths: number;
    columnDisplay?: boolean;
}

export const KeywordAnalysisTotalVisits: FC<IKeywordAnalysisTotalVisitsProps> = ({
    trafficTrend,
    dashboardView,
    maxMonths,
    columnDisplay,
}) => {
    const {
        trend,
        calculatedAvgVisits,
        calculatedAvgOrganic,
        calculatedAvgPaid,
    } = KeywordAnalysisTotalVisitsCalculator.calculateAverages(trafficTrend, maxMonths);

    const organicDataRowsItems = [
        {
            text: `Organic`,
            value: `${
                calculatedAvgOrganic === 0 || calculatedAvgOrganic === 100
                    ? calculatedAvgOrganic
                    : calculatedAvgOrganic.toFixed(2)
            }%`,
            color: colorsSets.b1.toArray()[0],
        },
        {
            text: `Paid`,
            value: `${
                calculatedAvgPaid === 0 || calculatedAvgPaid === 100
                    ? calculatedAvgPaid
                    : calculatedAvgPaid.toFixed(2)
            }%`,
            color: colorsSets.b1.toArray()[1],
        },
    ];
    const trendsBar = (
        <KeywordAnalysisTotalVisitsTrendRightCornerContainer>
            <TrendsBar values={trend} />
        </KeywordAnalysisTotalVisitsTrendRightCornerContainer>
    );
    return !dashboardView ? (
        <>
            {columnDisplay ? (
                <>
                    <OrganicDataRows items={organicDataRowsItems} />
                    <KeywordAnalysisTrendsBarContainer
                        dataVolume={calculatedAvgVisits}
                        trendsBar={trendsBar}
                    />
                </>
            ) : (
                <KeywordAnalysisTotalVisitsConatainer>
                    <div
                        style={{
                            display: "flex",
                            width: "100%",
                            position: "relative",
                            top: "-9px",
                        }}
                    >
                        <Legend
                            color={organicDataRowsItems[0].color}
                            name={`${organicDataRowsItems[0].text} ${organicDataRowsItems[0].value}`}
                            isMain={true}
                        />
                        <Legend
                            color={organicDataRowsItems[1].color}
                            name={`${organicDataRowsItems[1].text} ${organicDataRowsItems[1].value}`}
                            isMain={true}
                        />
                    </div>
                    <div
                        style={{
                            display: "flex",
                            height: "48px",
                            alignItems: "baseline",
                            width: "100%",
                            justifyContent: "space-between",
                            position: "relative",
                            top: "15px",
                        }}
                    >
                        <KeywordAnalysisTotalVisitsNumberContainer>
                            <KeywordAnalysisTotalVisitsNumber>
                                {minVisitsAbbrFilter()(calculatedAvgVisits)}
                            </KeywordAnalysisTotalVisitsNumber>
                        </KeywordAnalysisTotalVisitsNumberContainer>
                        <KeywordAnalysisTotalVisitsTrendContainer>
                            <TrendsBar values={trend} />
                        </KeywordAnalysisTotalVisitsTrendContainer>
                    </div>
                </KeywordAnalysisTotalVisitsConatainer>
            )}
        </>
    ) : (
        <KeywordAnalysisTotalVisitsDashboardConatainer>
            <KeywordAnalysisTotalVisitsNumberContainer>
                <KeywordAnalysisTotalVisitsNumber>
                    {minVisitsAbbrFilter()(calculatedAvgVisits)}
                </KeywordAnalysisTotalVisitsNumber>
            </KeywordAnalysisTotalVisitsNumberContainer>
            <div
                style={{
                    display: "flex",
                    height: "48px",
                    alignItems: "center",
                    width: "100%",
                    justifyContent: "center",
                    position: "relative",
                    top: "15px",
                    marginTop: "35px",
                }}
            >
                <KeywordAnalysisTotalVisitsTrendContainer>
                    <TrendsBar values={trend} />
                </KeywordAnalysisTotalVisitsTrendContainer>
            </div>
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    position: "relative",
                    top: "-9px",
                    justifyContent: "center",
                    marginTop: "35px",
                    marginBottom: "15px",
                }}
            >
                <Legend
                    color={colorsSets.b1.toArray()[0]}
                    name={`Organic ${calculatedAvgOrganic.toFixed(2)}%`}
                    isMain={true}
                />
                <Legend
                    color={colorsSets.b1.toArray()[1]}
                    name={`Paid ${calculatedAvgPaid.toFixed(2)}%`}
                    isMain={true}
                />
            </div>
        </KeywordAnalysisTotalVisitsDashboardConatainer>
    );
};
export default SWReactRootComponent(KeywordAnalysisTotalVisits, "KeywordAnalysisTotalVisits");
