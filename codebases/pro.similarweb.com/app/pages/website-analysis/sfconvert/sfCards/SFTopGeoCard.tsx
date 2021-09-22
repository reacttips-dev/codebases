/* eslint-disable react/display-name */
import { MiniFlexTable } from "@similarweb/ui-components/dist/mini-flex-table";
import { StyledItemIcon } from "components/core cells/src/CoreRecentCell/StyledComponents";
import { commonWebSources } from "components/filters-bar/utils";
import { CountryCell } from "components/React/Table/cells";
import { i18nFilter, percentageFilter } from "filters/ngFilters";
import { SfCardWrapper } from "pages/website-analysis/sfconvert/sfCards/SfCardWrapper";
import { sfConvertPageContext } from "pages/website-analysis/sfconvert/SfConvertPage";
import { SfCardLoader } from "pages/website-analysis/sfconvert/components/SfCardLoader";
import React, { useContext, useEffect, useState } from "react";
import DurationService from "services/DurationService";
import { DefaultFetchService } from "services/fetchService";
import styled from "styled-components";

const Container = styled.div`
    width: 100%;
    .sfcard-content {
        padding: 0;
    }
    .MiniFlexTable {
        padding-bottom: 0;
        width: 100%;
    }
`;

const SFTopGeoCardTable: any = styled(MiniFlexTable)`
    .MiniFlexTable {
        padding-bottom: 0;
    }
    .MiniFlexTable-column:not(:first-child) {
        &:nth-child(n + 3) {
            background-color: #d8d8d833;
        }
        .MiniFlexTable-headerCell {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .MiniFlexTable-cell {
            padding: 10px 0 10px 0;
            display: flex;
            justify-content: center;
            text-align: center;
        }
    }
    .MiniFlexTable-cell {
        border-bottom: #e5e7ea solid 1px;
        padding-top: 10px;
        padding-bottom: 10px;
    }
    .MiniFlexTable-cell:last-child {
        border-bottom: 0;
    }
    .MiniFlexTable-headerCell {
        border-top: #e5e7ea solid 1px;
        border-bottom: #e5e7ea solid 1px;
        color: rgba(42, 62, 82, 0.6);
        height: 36px;
        align-items: center;
        display: flex;
    }
    .MiniFlexTable-column:first-child {
        .MiniFlexTable-headerCell {
            padding-left: 12px;
        }
        .MiniFlexTable-cell {
            padding-left: 21px;
        }
    }
`;
SFTopGeoCardTable.displayName = "SFTopGeoCardTable";

export const SFTopGeoCard: React.FunctionComponent<any> = () => {
    const [data, setData] = useState([]);
    const fetchService = DefaultFetchService.getInstance();
    const sfConvertPageState = useContext(sfConvertPageContext);
    const { site, duration, webAnalysisComponent, competitors, siteInfo } = sfConvertPageState;
    const country = 999;
    const endpointUrl = "/widgetApi/WebsiteGeographyExtended/GeographyExtended/Table";
    const webSource = commonWebSources.desktop().id; // only desktop source is relevant
    const {
        forAPI: { from, to },
    } = DurationService.getDurationData(duration, null, webAnalysisComponent.componentId);

    useEffect(() => {
        const getData = async () => {
            let comp1Data;
            let comp2Data;
            const siteData = await fetchService.get<any>(endpointUrl, {
                country,
                from,
                to,
                includeSubDomains: true,
                ShouldGetVerifiedData: false,
                isWindow: false,
                timeGranularity: "Monthly",
                keys: site,
            });
            if (competitors[0]) {
                comp1Data = await fetchService.get<any>(endpointUrl, {
                    country,
                    from,
                    to,
                    includeSubDomains: true,
                    ShouldGetVerifiedData: false,
                    isWindow: false,
                    timeGranularity: "Monthly",
                    keys: competitors[0].Domain,
                });
            }
            if (competitors[1]) {
                comp2Data = await fetchService.get<any>(endpointUrl, {
                    country,
                    from,
                    to,
                    includeSubDomains: true,
                    ShouldGetVerifiedData: false,
                    isWindow: false,
                    timeGranularity: "Monthly",
                    keys: competitors[1].Domain,
                });
            }
            const data = siteData.Data.slice(0, 10);
            const transformData = () => {
                const tData = data.map((item) => {
                    return {
                        Country: item.Country,
                        [site]: `${percentageFilter()("" + item.Share, 2)}%`,
                    };
                });
                if (comp1Data) {
                    comp1Data.Data.forEach((item) => {
                        tData.forEach((country) => {
                            if (country.Country === item.Country) {
                                country[competitors[0].Domain] = `${percentageFilter()(
                                    "" + item.Share,
                                    2,
                                )}%`;
                            }
                        });
                    });
                }
                if (comp2Data) {
                    comp2Data.Data.forEach((item) => {
                        tData.forEach((country) => {
                            if (country.Country === item.Country) {
                                country[competitors[1].Domain] = `${percentageFilter()(
                                    "" + item.Share,
                                    2,
                                )}%`;
                            }
                        });
                    });
                }
                return tData.slice(0, 10);
            };
            const response = transformData();
            setData(response);
        };
        getData();
    }, [competitors]);

    const getTableData = () =>
        data.map((item) => {
            return {
                Country: item.Country,
                [site]: item[site],
                ...Object.fromEntries(
                    competitors
                        .slice(0, 2)
                        .map((competitor) => [
                            competitor.Domain,
                            item[competitor.Domain] ? item[competitor.Domain] : "N/A",
                        ]),
                ),
            };
        });
    const topGeoColumns = () => {
        const topGeoColumnsArray = [
            {
                field: "Country",
                displayName: i18nFilter()("salesforce.geo.table.country"),
                type: "string",
                format: "None",
                sortable: false,
                isSorted: false,
                sortDirection: "desc",
                groupable: false,
                cellComponent: CountryCell,
                headTemp: "",
                totalCount: true,
                tooltip: false,
                minWidth: 120,
                maxWidth: 176,
            },
            {
                field: site,
                displayName: site,
                type: "string",
                format: "percentagesign",
                sortable: false,
                isSorted: false,
                isLink: true,
                sortDirection: "desc",
                groupable: false,
                headTemp: "",
                totalCount: false,
                tooltip: false,
                minWidth: 74,
                headerComponent: () => <StyledItemIcon iconName={site} iconSrc={siteInfo.icon} />,
            },
        ];
        if (competitors.length > 0) {
            competitors.slice(0, 2).map((competitor) =>
                topGeoColumnsArray.push({
                    field: competitor.Domain,
                    displayName: competitor.Domain,
                    type: "string",
                    format: "percentagesign",
                    sortable: false,
                    isSorted: false,
                    isLink: true,
                    sortDirection: "desc",
                    groupable: false,
                    headTemp: "",
                    totalCount: false,
                    tooltip: false,
                    minWidth: 74,
                    headerComponent: () => (
                        <StyledItemIcon iconName={competitor.Domain} iconSrc={competitor.Favicon} />
                    ),
                }),
            );
        }
        return topGeoColumnsArray;
    };

    function getProLink() {
        const keys = [site, ...competitors.map(({ Domain }) => Domain)].slice(0, 4);
        return `https://pro.similarweb.com/#/website/audience-geography/${keys.join(
            ",",
        )}/*/999/${duration}`;
    }

    return (
        <Container>
            <SfCardWrapper
                webSource={webSource}
                country={country}
                duration={duration}
                title={i18nFilter()("salesforce.geo.title")}
                tooltip={i18nFilter()("salesforce.geo.tooltip")}
                footerLink={getProLink()}
                footerText={i18nFilter()("salesforce.geo.footer")}
                dataAutomation={"top-geo-card"}
            >
                {data.length > 0 ? (
                    <SFTopGeoCardTable
                        className="MiniFlexTable MiniFlexTable--swProTheme SFTopGeoCardTable"
                        data={getTableData()}
                        columns={topGeoColumns()}
                        metadata={{}}
                    />
                ) : (
                    <SfCardLoader height="415px" />
                )}
            </SfCardWrapper>
        </Container>
    );
};

SFTopGeoCard.displayName = "SFTopGeoCard";
