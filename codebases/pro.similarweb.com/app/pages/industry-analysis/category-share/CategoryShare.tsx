import { i18nFilter } from "filters/ngFilters";
import React, { FC, useMemo } from "react";
import { SwNavigator } from "common/services/swNavigator";
import { Injector } from "common/ioc/Injector";
import { ICategoryShareServices } from "./CategoryShareTypes";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import CategoryShareTable from "./CategoryShareTable/CategoryShareTable";
import CategoryShareGraph from "./CategoryShareGraph/CategoryShareGraph";
import { swSettings } from "common/services/swSettings";
import { allTrackers } from "services/track/track";
import { DefaultFetchService } from "services/fetchService";
import { apiHelper } from "common/services/apiHelper";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import categoryService from "common/services/categoryService";
import DurationService from "services/DurationService";
import CountryService from "services/CountryService";

export const CategoryShare: FC = () => {
    const services: ICategoryShareServices = useMemo(() => {
        return {
            translate: i18nFilter(),
            swNavigator: Injector.get<SwNavigator>("swNavigator"),
            categoryService,
            apiHelper: apiHelper,
            swSettings: swSettings,
            tracker: allTrackers,
            fetchService: DefaultFetchService.getInstance(),
            durationService: DurationService,
            countryService: CountryService,
        };
    }, []);

    const currentState = services.swNavigator.current().name;
    const tableSelectionKey = `${currentState}_category_share_table`;

    return (
        <FlexColumn>
            <CategoryShareGraph services={services} tableStateKey={tableSelectionKey} />
            <CategoryShareTable
                services={services}
                tableSelectionKey={tableSelectionKey}
                initialSelectedRowsCount={10}
                maxSelectedRowsCount={10}
            />
        </FlexColumn>
    );
};

SWReactRootComponent(CategoryShare, "CategoryShare");
