import React, { StatelessComponent } from "react";
import Filter from "./Filter";
import { SitesDropDown } from "@similarweb/ui-components/dist/dropdown";

const SiteFilter: StatelessComponent<any> = (props) => {
    let { sites, onSiteChanged } = props;
    sites = sites.map(({ displayName, icon }) => ({
        id: displayName,
        name: displayName,
        imageUrl: icon,
    }));

    return (
        <Filter fieldName="Website">
            <SitesDropDown {...props} sites={sites} onClick={onSiteChanged} />
        </Filter>
    );
};
export default SiteFilter;
