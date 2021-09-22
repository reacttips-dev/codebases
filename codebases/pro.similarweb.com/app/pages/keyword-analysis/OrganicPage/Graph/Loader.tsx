import { LoaderListBullets } from "components/Loaders/src/LoaderListItems";
import React from "react";
import { i18nFilter } from "filters/ngFilters";

export const Loader = () => (
    <LoaderListBullets
        title={i18nFilter()("keywordanalysis.graph.loader.title")}
        subtitle={i18nFilter()("keywordanalysis.graph.loader.subtitle")}
    />
);
