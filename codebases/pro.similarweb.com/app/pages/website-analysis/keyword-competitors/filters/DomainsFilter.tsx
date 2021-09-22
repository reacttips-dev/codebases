import React from "react";
import { DomainsChipDownContainer } from "@similarweb/ui-components/dist/dropdown";
import { useKeywordCompetitorsPageContext } from "pages/website-analysis/keyword-competitors/KeywordCompetitorsPageContext";
import { ListItemWebsite } from "@similarweb/ui-components/dist/list-item";

export const DomainsFilter = () => {
    const { onSelectSite, selectedSite, allSites } = useKeywordCompetitorsPageContext();
    const selectedSiteObject = allSites.find((x) => x.name === selectedSite) || allSites[0];
    return (
        <DomainsChipDownContainer
            onClick={onSelectSite}
            selectedIds={{ [selectedSiteObject.name]: true }}
            selectedDomainText={selectedSiteObject.displayName}
            selectedDomainIcon={selectedSiteObject.icon}
            onCloseItem={() => onSelectSite(null)}
            buttonText={null}
        >
            {allSites.map((item, index) => {
                const { name, displayName, icon } = item;
                return (
                    <ListItemWebsite key={index} text={name} img={icon}>
                        {displayName}
                    </ListItemWebsite>
                );
            })}
        </DomainsChipDownContainer>
    );
};
