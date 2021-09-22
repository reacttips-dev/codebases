import React from "react";
import RightSidebarContext from "../../contexts/RightSidebarContext";
import { BaseWebsiteType } from "pages/workspace/sales/sub-modules/benchmarks/types/common";
import RightBarHoverContainer from "pages/workspace/sales/components/RightBar/RightBarHoverContainer";

type SidebarProps = {
    isOpen: boolean;
    website: BaseWebsiteType;
    closeSidebar(): void;
    // TODO: Legacy code, remove.
    getExcelTableRowHref(...args: any): string;
};

const Sidebar = (props: SidebarProps) => {
    const { isOpen, website, closeSidebar, getExcelTableRowHref } = props;
    const [isSimilarSitesPanelOpen, setIsSimilarSitesPanelOpen] = React.useState(false);

    return (
        <RightSidebarContext.Provider
            value={{
                website,
                isSimilarSitesPanelOpen,
                isSidebarOpen: isOpen,
                toggleSimilarSitesPanel: setIsSimilarSitesPanelOpen,
                closeSidebar,
            }}
        >
            <RightBarHoverContainer getExcelTableRowHref={getExcelTableRowHref} />
        </RightSidebarContext.Provider>
    );
};

export default Sidebar;
