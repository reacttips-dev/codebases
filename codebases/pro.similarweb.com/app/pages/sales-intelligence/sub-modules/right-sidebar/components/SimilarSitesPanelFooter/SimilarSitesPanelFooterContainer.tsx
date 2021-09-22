import React from "react";
import SimilarSitesPanelContext from "../../contexts/SimilarSitesPanelContext";
import SimilarSitesPanelFooter from "./SimilarSitesPanelFooter";

const SimilarSitesPanelFooterContainer = () => {
    const { applying, cancel, applySelection, similarSites } = React.useContext(
        SimilarSitesPanelContext,
    );

    return (
        <SimilarSitesPanelFooter
            onCancel={cancel}
            isLoading={applying}
            onApply={applySelection}
            isDisabled={applying || similarSites.length === 0}
        />
    );
};

export default SimilarSitesPanelFooterContainer;
