import React from "react";
import { SimilarSiteType } from "../types/similar-sites";
import { BaseWebsiteType } from "pages/workspace/sales/sub-modules/benchmarks/types/common";

type SimilarSitesPanelContextType = {
    applying: boolean;
    similarSites: SimilarSiteType[];
    selectedCountriesIds: number[];
    cancel(): void;
    applySelection(): void;
    addWebsite(website: BaseWebsiteType): void;
    removeWebsite(domain: string): void;
};

const SimilarSitesPanelContext = React.createContext<SimilarSitesPanelContextType>(null);

export default SimilarSitesPanelContext;
