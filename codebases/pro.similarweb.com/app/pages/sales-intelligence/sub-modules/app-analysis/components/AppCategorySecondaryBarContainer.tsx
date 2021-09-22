import SWReactRootComponent from "decorators/SWReactRootComponent";
import withSecondaryBarSet from "pages/sales-intelligence/hoc/withSecondaryBarSet";
import { AppCategoryTrendsTableContainer } from "pages/app-category/trendingApps/AppCategoryTrendsTableContainer";

SWReactRootComponent(
    withSecondaryBarSet("SalesIntelligenceAppReview")(() => null),
    "AppCategorySecondaryBarContainer",
);

SWReactRootComponent(
    withSecondaryBarSet("SalesIntelligenceAppReview")(AppCategoryTrendsTableContainer),
    "AppCategoryTrendsTableContainerSI",
);
