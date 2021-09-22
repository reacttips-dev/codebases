import React from "react";
import SimilarSitesPanelContext from "../../contexts/SimilarSitesPanelContext";
import SimilarSitesPanelCountries from "./SimilarSitesPanelCountries";

const SimilarSitesPanelCountriesContainer = () => {
    const { selectedCountriesIds } = React.useContext(SimilarSitesPanelContext);

    return <SimilarSitesPanelCountries countriesIds={selectedCountriesIds} />;
};

export default SimilarSitesPanelCountriesContainer;
