import React, { FunctionComponent, useEffect, useState } from "react";
import { StyledBox } from "../StyledComponents";
import { i18nFilter } from "filters/ngFilters";
import DurationService from "services/DurationService";
import { Injector } from "common/ioc/Injector";
import { Loader } from "./Loader";
import { EmptyState } from "pages/digital-marketing/find-affiliate/by-industry/Components/EmptyState";
import swLog from "@similarweb/sw-log";
import { CategoryCell } from "components/React/Table/cells";
import { DefaultFetchService } from "services/fetchService";
import styled from "styled-components";
import { MiniFlexTable } from "@similarweb/ui-components/dist/mini-flex-table";
import { colorsPalettes, rgba } from "@similarweb/styles";
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

    .MiniFlexTable-column {
        width: 100%;
    }

    .swTable-categoryCell {
        margin: 10px auto;
    }

    .MiniFlexTable-headerCell {
        margin-bottom: 8px;
        font-weight: 500;
        font-size: 12px;
        color: ${rgba(colorsPalettes.carbon[500], 0.6)};
    }
`;

export const ReferralCategories: FunctionComponent<any> = () => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const fetchService = DefaultFetchService.getInstance();
    const { category: categoryQueryParam, country, duration, webSource } = swNavigator.getParams();
    const { forApi: category } = categoryService.categoryQueryParamToCategoryObject(
        categoryQueryParam,
    );
    const categoryHashData = {};
    if (UserCustomCategoryService.isCustomCategory(categoryQueryParam)) {
        categoryHashData["categoryHash"] = UserCustomCategoryService.getCategoryHash(
            category,
            "categoryId",
        );
    }
    const { from, to, isWindow } = DurationService.getDurationData(duration).forAPI;
    const title = i18nFilter()("affiliate.by.industry.referral.categories.title");
    const tooltip = i18nFilter()("affiliate.by.industry.referral.categories.tooltip");
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchData() {
            setData(null);
            try {
                const response = await fetchService.get<{ Data: object[]; TotalCount: number }>(
                    "/widgetApi/IndustryAnalysis/ReferreringCategoryLeaders/Table",
                    {
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
                );
                setData(transformData(response));
            } catch (e) {
                swLog.error("error fetching Referrals Categories data", e);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [from, to, isWindow, country, webSource]);

    const transformData = (data) => {
        return data.Data.map((record) => {
            const mainCategory = record.Category.substring(0, record.Category.indexOf("/"));
            const category = record.Category.substring(record.Category.indexOf("/") + 1);

            return {
                MainCategory: mainCategory,
                category: category === mainCategory ? category + `  - Other` : category,
                visits: record.Visits,
            };
        });
    };

    const getTableColumns = () => {
        return [
            {
                field: "category",
                cellComponent: (props) => (
                    <CategoryCell {...props} isIconHidden={true} ignoreCustomCat={true} />
                ),
                displayName: i18nFilter()("affiliate.by.industry.table.columns.category.title"),
                tooltip: i18nFilter()("affiliate.by.industry.table.columns.category.title.tooltip"),
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
