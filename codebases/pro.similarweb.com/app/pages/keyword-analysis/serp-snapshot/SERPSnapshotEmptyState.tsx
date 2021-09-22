import {
    NoDataSubTitle,
    NoDataTitle,
    SERPNoDataContainer,
} from "pages/keyword-analysis/serp-snapshot/StyledComponents";
import { SWReactIcons } from "@similarweb/icons";
import React from "react";
import { i18nFilter } from "filters/ngFilters";

export const SERPSnapshotEmptyState = () => {
    return (
        <SERPNoDataContainer justifyContent="center" alignItems="center">
            <SWReactIcons iconName={"no-data-page"} />
            <NoDataTitle>{i18nFilter()("serp.no.data.title")}</NoDataTitle>
            <NoDataSubTitle>{i18nFilter()("serp.no.data.subtitle")}</NoDataSubTitle>
        </SERPNoDataContainer>
    );
};
