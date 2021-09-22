import React, { FunctionComponent, useEffect, useState } from "react";
import { i18nFilter } from "filters/ngFilters";
import DurationService from "services/DurationService";
import { Injector } from "common/ioc/Injector";
import { StyledBox } from "../StyledComponents";
import styled from "styled-components";
import { DefaultFetchService } from "services/fetchService";
import { DefaultCellHeader, DefaultCellHeaderRightAlign } from "components/React/Table/headerCells";
import { VisitsThreshHoldCell } from "components/React/Table/cells";
import { MiniFlexTable } from "@similarweb/ui-components/dist/mini-flex-table";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { EmptyState } from "pages/digital-marketing/find-affiliate/by-industry/Components/EmptyState";
import { CoreWebsiteCell } from "components/core cells/src/CoreWebsiteCell/CoreWebsiteCell";
import ComponentsProvider from "components/WithComponent/src/ComponentsProvider";
import { WebsiteTooltip } from "components/React/Tooltip/WebsiteTooltip/WebsiteTooltip";
import { Loader } from "./Loader";
import { ReferralComponentTitle } from "./ReferralComponentTitle";
import { SwNavigator } from "common/services/swNavigator";
import categoryService from "common/services/categoryService";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";

const StyledTable: any = styled(MiniFlexTable)`
    margin: 0 22px 0 22px;

    .MiniFlexTable-cell {
        height: 40px;
        vertical-align: middle;
        font-size: 14px;
        &:not(:first-child) {
            border-top: 1px solid ${colorsPalettes.carbon[50]};
        }
    }

    .MiniFlexTable-column:nth-of-type(2) {
        .MiniFlexTable-cell {
            > div {
                height: 100%;
                align-items: center;
            }
        }
    }

    .MiniFlexTable-headerCell {
        margin-bottom: 8px;
        font-weight: 500;
        font-size: 12px;
        color: ${rgba(colorsPalettes.carbon[500], 0.6)};
    }
`;

export const ReferralLeaders: FunctionComponent<any> = () => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const fetchService = DefaultFetchService.getInstance();
    const { country, webSource, category: categoryQueryParam } = swNavigator.getParams();
    const { forApi: category } = categoryService.categoryQueryParamToCategoryObject(
        categoryQueryParam,
    );
    const { from, to, isWindow } = DurationService.getDurationData("1m").forAPI;
    const title = i18nFilter()("analysis.common.trafficsource.referrals.leaders.title");
    const tooltip = i18nFilter()("affiliate.by.industry.referral.leaders.tooltip");
    const [data, setData] = useState<object[]>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const categoryHashData = {};
    if (UserCustomCategoryService.isCustomCategory(categoryQueryParam)) {
        categoryHashData["categoryHash"] = UserCustomCategoryService.getCategoryHash(
            category,
            "categoryId",
        );
    }

    const transformData = (data) => {
        return data.Data.slice(0, 5).map((record) => {
            return {
                Favicon: record.Favicon,
                Domain: record.Domain,
                AvgMonthVisits: record.AvgMonthVisits,
                url: swNavigator.href("websites-worldwideOverview", {
                    ...swNavigator.getParams(),
                    key: record.Domain,
                    isWWW: "*",
                }),
            };
        });
    };

    useEffect(() => {
        async function fetchData() {
            setData(null);
            const response = await fetchService
                .get<{ Data: object[]; TotalCount: number }>(
                    "widgetApi/CategoryLeaders/CategoryLeadersReferrals/Table",
                    {
                        category,
                        country,
                        from,
                        includeSubDomains: true,
                        isWindow,
                        keys: category,
                        timeGranularity: "Monthly",
                        to,
                        webSource,
                        ...categoryHashData,
                    },
                )
                .finally(() => setIsLoading(false));
            setData(transformData(response));
        }
        fetchData();
    }, [from, to, isWindow, country, webSource]);

    const getTableColumns = () => {
        return [
            {
                field: "Domain",
                displayName: i18nFilter()(
                    "affiliate.by.industry.referrals.leaders.domain.column.header",
                ),
                headerComponent: DefaultCellHeader,
                cellComponent: ({ value, row }) => {
                    const props = {
                        displayName: "CoreWebsiteCell",
                        domain: value,
                        icon: row.Favicon,
                        internalLink: row.url,
                        hideTrackButton: true,
                    };
                    return (
                        <ComponentsProvider components={{ WebsiteTooltip }}>
                            <CoreWebsiteCell {...props} />
                        </ComponentsProvider>
                    );
                },
            },
            {
                field: "AvgMonthVisits",
                displayName: i18nFilter()(
                    "affiliate.by.industry.referrals.leaders.referrals.visits.column.header",
                ),
                headerComponent: DefaultCellHeaderRightAlign,
                cellComponent: VisitsThreshHoldCell,
            },
        ];
    };

    const getComponent = () =>
        !data || data.length === 0 ? (
            <EmptyState
                titleKey="find.affiliate.by.industry.empty.state.title"
                subTitleKey="find.affiliate.by.industry.empty.state.sub.title"
            />
        ) : (
            <StyledTable className="MiniFlexTable" data={data} columns={getTableColumns()} />
        );

    return (
        <StyledBox width="32%" height="298">
            <ReferralComponentTitle title={title} tooltip={tooltip} />
            {isLoading ? <Loader /> : getComponent()}
        </StyledBox>
    );
};
