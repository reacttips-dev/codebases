import { Injector } from "common/ioc/Injector";
import { ECategoryType } from "common/services/categoryService.types";
import { SwNavigator } from "common/services/swNavigator";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import { IndustryAnalysisQueryBar } from "pages/industry-analysis/IndustryAnalysisQueryBar";
import React from "react";

const MonitorPartnersQueryBar = () => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const categoryModalProps = {
        isCategoryTypeDisabled: true,
        categoryType: ECategoryType.PARTNERS_LIST,
    };
    const onItemClick = (item) => {
        swNavigator.updateParams({ partnerListId: item.categoryId });
    };
    const getCategoryDetails = (category) => {
        if (!category) {
            return {
                text: "Invalid Industry",
                secondaryText: "N/A",
                icon: "no-data",
            };
        }

        return {
            text: category.text,
            secondaryText:
                category.categoryType === ECategoryType.PARTNERS_LIST
                    ? "Partners List"
                    : ECategoryType.GENERAL_LIST,
            icon: category.isCustomCategory ? "category" : "market",
        };
    };
    return (
        <IndustryAnalysisQueryBar
            showOnlyCustom={true}
            onItemClick={onItemClick}
            placeholder={i18nFilter()(
                "digital.marketing.affiliate.partner.page.query.bar.placeholder",
            )}
            showEditButton={false}
            categoryModalProps={categoryModalProps}
            getCategoryDetails={getCategoryDetails}
            isPartnerPage={true}
        />
    );
};

export default SWReactRootComponent(MonitorPartnersQueryBar, "MonitorPartnersQueryBar");
