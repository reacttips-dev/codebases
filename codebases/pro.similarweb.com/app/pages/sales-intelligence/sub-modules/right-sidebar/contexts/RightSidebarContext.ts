import React from "react";
import { BaseWebsiteType } from "pages/workspace/sales/sub-modules/benchmarks/types/common";

export type RightSidebarContextType = {
    website: BaseWebsiteType | null;
    isSidebarOpen: boolean;
    isSimilarSitesPanelOpen: boolean;
    toggleSimilarSitesPanel(isOpen: boolean): void;
    closeSidebar(): void;
};

const RightSidebarContext = React.createContext<RightSidebarContextType>(null);

export default RightSidebarContext;
