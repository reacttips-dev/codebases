import { MiniFlexTable } from "@similarweb/ui-components/dist/mini-flex-table";
import { commonWebSources } from "components/filters-bar/utils";
import { LeaderDefaultCell, WebsiteTooltipTopCell } from "components/React/Table/cells";
import { WinnerIcon } from "components/React/Table/cells/LeaderDefaultCell";
import { DefaultCellHeader } from "components/React/Table/headerCells";
import { i18nFilter } from "filters/ngFilters";
import { SfCardWrapper } from "pages/website-analysis/sfconvert/sfCards/SfCardWrapper";
import { sfConvertPageContext } from "pages/website-analysis/sfconvert/SfConvertPage";
import { SfCardLoader } from "pages/website-analysis/sfconvert/components/SfCardLoader";
import React, { useContext, useEffect, useState } from "react";
import DurationService from "services/DurationService";
import { DefaultFetchService } from "services/fetchService";
import styled from "styled-components";

const Container = styled.div`
    width: 100%;
    .MiniFlexTable .MiniFlexTable-container .MiniFlexTable-column .MiniFlexTable-cell {
        padding-top: 0;
        display: flex;
        height: 38px;
        align-items: center;
    }
    .MiniFlexTable-cell:last-child {
        border-bottom: none;
    }
    .MiniFlexTable {
        padding-bottom: 0;
        display: flex;
        width: 100%;
    }
    .MiniFlexTable .MiniFlexTable-container .MiniFlexTable-column:first-child {
        .MiniFlexTable-cell {
            padding-left: 21px;
        }
    }
    ${WinnerIcon} {
        margin-top: 2px;
    }
    .sfcard-content {
        padding: 0;
    }
    .swTable-content-large.text {
        max-width: 70%;
    }
`;

function getProLink(site, competitors) {
    const keys = [site, ...competitors.map(({ Domain }) => Domain)].slice(0, 4);
    return `https://pro.similarweb.com/#/website/audience-overview/${keys.join(
        ",",
    )}/*/999/3m/?webSource=Total`;
}

function getTableColumns() {
    return [
        {
            field: "Domain",
            displayName: " ",
            headerComponent: DefaultCellHeader,
            cellComponent: WebsiteTooltipTopCell,
            headerCellClass: "no-header-border graystyle-header",
            visible: true,
            format: "None",
            minWidth: 120,
            maxWidth: 176,
        },
        {
            field: "AvgVisitDuration",
            displayName: i18nFilter()("salesforce.engagement_visits.table.avd"),
            headerComponent: DefaultCellHeader,
            cellComponent: LeaderDefaultCell,
            headerCellClass: "no-header-border graystyle-header",
            visible: true,
            format: "time",
            minWidth: 104,
        },
        {
            field: "PagesPerVisit",
            displayName: i18nFilter()("salesforce.engagement_visits.table.ppv"),
            headerComponent: DefaultCellHeader,
            cellComponent: LeaderDefaultCell,
            headerCellClass: "no-header-border graystyle-header",
            visible: true,
            format: "number:2",
            minWidth: 74,
        },
        {
            field: "BounceRate",
            displayName: i18nFilter()("salesforce.engagement_visits.table.br"),
            headerComponent: DefaultCellHeader,
            cellComponent: LeaderDefaultCell,
            headerCellClass: "no-header-border graystyle-header",
            visible: true,
            minWidth: 74,
            format: "percentagesign:2",
        },
    ];
}

const fetchService = DefaultFetchService.getInstance();

export const SFEngagementCard: React.FunctionComponent<any> = () => {
    const { webSource, site, competitors, country, duration, webAnalysisComponent } = useContext(
        sfConvertPageContext,
    );
    const {
        forAPI: { from, to },
    } = DurationService.getDurationData(duration, null, webAnalysisComponent.componentId);
    const [data, setData] = useState<any>();
    useEffect(
        /* fetch site data */ () => {
            async function fetchData() {
                const response = await fetchService.get<{
                    Data: any[];
                }>("/widgetApi/TrafficAndEngagement/EngagementOverview/Table", {
                    ShouldGetVerifiedData: false,
                    country,
                    from,
                    includeLeaders: true,
                    includeSubDomains: true,
                    isWindow: false,
                    keys: [site, ...competitors.map(({ Domain }) => Domain)].slice(0, 4),
                    timeGranularity: "Monthly",
                    to,
                    webSource,
                });
                setData(response.Data);
            }

            fetchData();
        },
        [from, to, country, site, competitors, webSource],
    );

    return (
        <Container>
            <SfCardWrapper
                webSource={webSource}
                country={country}
                duration={duration}
                title={i18nFilter()("salesforce.engagement_visits.table.title")}
                tooltip={i18nFilter()("salesforce.engagement_visits.table.tooltip")}
                footerLink={getProLink(site, competitors)}
                footerText={i18nFilter()("salesforce.engagement_visits.table.footer")}
                dataAutomation={"Engagement"}
            >
                {data ? (
                    <MiniFlexTable
                        className="MiniFlexTable MiniFlexTable--swProTheme graystyle-table"
                        data={data}
                        columns={getTableColumns()}
                        metadata={{}}
                    />
                ) : (
                    <SfCardLoader height="244px" />
                )}
            </SfCardWrapper>
        </Container>
    );
};
