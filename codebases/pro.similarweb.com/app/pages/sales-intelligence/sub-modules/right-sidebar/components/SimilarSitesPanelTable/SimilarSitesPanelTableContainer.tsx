import React from "react";
import { SimilarSiteType } from "../../types/similar-sites";
import RightSidebarContext from "../../contexts/RightSidebarContext";
import SimilarSitesPanelContext from "../../contexts/SimilarSitesPanelContext";
import SimilarSitesPanelTable from "./SimilarSitesPanelTable";
import useSimilarSitesTrackingService from "../../hooks/useSimilarSitesTrackingService";

type SimilarSitesPanelTableContainerProps = {
    websites: SimilarSiteType[];
};

const SimilarSitesPanelTableContainer = (props: SimilarSitesPanelTableContainerProps) => {
    const { website } = React.useContext(RightSidebarContext);
    const { removeWebsite } = React.useContext(SimilarSitesPanelContext);
    const trackingService = useSimilarSitesTrackingService(website.domain);

    const onWebsiteLinkClick = (domain: string) => {
        trackingService.trackWebsiteLinkClicked(domain);
    };

    return (
        <SimilarSitesPanelTable
            websites={props.websites}
            onWebsiteRemove={removeWebsite}
            onWebsiteLinkClick={onWebsiteLinkClick}
        />
    );
};

export default SimilarSitesPanelTableContainer;
