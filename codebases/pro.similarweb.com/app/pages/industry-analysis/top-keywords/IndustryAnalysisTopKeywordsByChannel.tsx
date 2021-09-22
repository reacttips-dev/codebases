import { Injector } from "common/ioc/Injector";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import { SwNavigator } from "common/services/swNavigator";
import DurationService from "services/DurationService";
import { SearchOverviewHeaderContainer } from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewTraffic/StyledComponent";
import IndustryAnalysisMiniTable from "./IndustryAnalysisMiniTable";
import {
    EGraphGranularities,
    graphGranularityToString,
} from "pages/keyword-analysis/OrganicPage/Graph/GraphData";
import { Text } from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import { TableRowContainer, CoreWebsiteCellContainer, TableHeaderText } from "./StyledComponents";
import TrafficShare from "components/React/Table/FlexTable/cells/TrafficShare";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";
import categoryService from "common/services/categoryService";

const ColumnHeaderSize = 12;
const endPoint = "widgetApi/IndustryAnalysisTopKeywords/TopSearchChannelsAbb/Table";

const IndustryAnalysisTopKeywordsByChannel = () => {
    const { duration, category, country } = Injector.get<SwNavigator>("swNavigator").getParams();

    const categoryHashData = {};
    if (UserCustomCategoryService.isCustomCategory(category)) {
        categoryHashData["categoryHash"] = UserCustomCategoryService.getCategoryHash(
            UserCustomCategoryService.removeCategoryIdPrefix(category),
            "categoryId",
        );
    }

    const { from, to, isWindow } = DurationService.getDurationData(duration).forAPI;
    const timeGranularity = isWindow ? EGraphGranularities.DAILY : EGraphGranularities.MONTHLY;

    const HeadLineKey = "ia.topkeywords.searchchannel";
    const metricData = {
        type: "Table",
        metric: "TopSearchChannelsAbb",
        webSource: "Desktop",
    };
    const categoryObject = categoryService.categoryQueryParamToCategoryObject(category);

    const queryParams = {
        webSource: "Desktop",
        includeSubDomains: true,
        timeGranularity: graphGranularityToString[timeGranularity],
        keys: categoryObject.forApi,
        categoryId: categoryObject.id,
        category: categoryObject.forDisplayApi,
        isWindow,
        country,
        from,
        to,
        ...categoryHashData,
    };
    const addToDashboardParams = { duration };

    const renderTable = (props) => (
        <IndustryAnalysisTopKeywordsByChannelTableComponent {...props} />
    );

    return (
        <IndustryAnalysisMiniTable
            metricData={metricData}
            endPoint={endPoint}
            HeadLineKey={HeadLineKey}
            queryParams={queryParams}
            addToDashboardParams={addToDashboardParams}
            renderTable={renderTable}
        />
    );
};

const IndustryAnalysisTopKeywordsByChannelTableComponent = ({ data }) => {
    const i18n = i18nFilter();
    const SEARCH_TRAFFIC_CHANNEL_HEADER_KEY = "industry.analysis.top.keywords.by.industry.channel";
    const SEARCH_TRAFFIC_SHARE_HEADER_KEY = "industry.analysis.top.keywords.by.industry.share";

    return (
        <div>
            <SearchOverviewHeaderContainer>
                <TableHeaderText fontSize={ColumnHeaderSize}>
                    {i18n(SEARCH_TRAFFIC_CHANNEL_HEADER_KEY)}
                </TableHeaderText>
                <TableHeaderText fontSize={ColumnHeaderSize}>
                    {i18n(SEARCH_TRAFFIC_SHARE_HEADER_KEY)}
                </TableHeaderText>
            </SearchOverviewHeaderContainer>
            {data.map(({ Name: name, Value: value }, index) => {
                const nameWithFirstChartUpperCase =
                    name && name[0].toUpperCase() + name.substring(1);

                return (
                    <TableRowContainer key={index}>
                        <CoreWebsiteCellContainer>
                            <Text>{nameWithFirstChartUpperCase}</Text>
                        </CoreWebsiteCellContainer>
                        <TrafficShare totalShare={value} hideZeroValue={false} />
                    </TableRowContainer>
                );
            })}
        </div>
    );
};

SWReactRootComponent(IndustryAnalysisTopKeywordsByChannel, "IndustryAnalysisTopKeywordsByChannel");
export default IndustryAnalysisTopKeywordsByChannel;
