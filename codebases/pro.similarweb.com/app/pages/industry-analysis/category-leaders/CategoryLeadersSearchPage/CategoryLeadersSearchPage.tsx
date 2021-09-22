import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import React, { FC, useMemo } from "react";
import { CategoryLeadersSearchPageContainer } from "./CategoryLeadersSearchPages.styles";
import { CategoryLeadersSearchTable } from "./table/CategoryLeadersSearchTable";
import { i18nFilter } from "filters/ngFilters";
import categoryService from "common/services/categoryService";
import {
    ICategoryLeadersNavParams,
    ICategoryLeadersServices,
} from "pages/industry-analysis/category-leaders/CategoryLeaders.types";
import { apiHelper } from "common/services/apiHelper";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";
import { DefaultFetchService } from "services/fetchService";
import { allTrackers } from "services/track/track";

export const CategoryLeadersSearchPage: FC = () => {
    const services = useMemo<ICategoryLeadersServices>(() => {
        return {
            navigator: Injector.get<SwNavigator>("swNavigator"),
            translate: i18nFilter(),
            categoryService: categoryService,
            customCategoryService: UserCustomCategoryService,
            apiHelper: apiHelper,
            fetchService: DefaultFetchService.getInstance(),
            tracker: allTrackers,
        };
    }, []);

    const params = services?.navigator.getParams() as any;

    return (
        <CategoryLeadersSearchPageContainer>
            <CategoryLeadersSearchTable navParams={params} services={services} />
        </CategoryLeadersSearchPageContainer>
    );
};

SWReactRootComponent(CategoryLeadersSearchPage, "CategoryLeadersSearchPage");
