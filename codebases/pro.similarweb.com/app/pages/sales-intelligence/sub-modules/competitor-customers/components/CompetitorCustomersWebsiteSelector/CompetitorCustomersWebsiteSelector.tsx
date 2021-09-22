import React from "react";
import { WebsiteData } from "../../../common/types";
import { QueryBarWebsiteItem } from "@similarweb/ui-components/dist/query-bar/src/QueryBarItems/QueryBarWebsiteItem";
import { AutocompleteWebsitesCompareItem } from "components/AutocompleteWebsites/AutocompleteWebsitesCompareItem";
import { useOnOutsideClick } from "pages/sales-intelligence/hooks/useOnOutsideClick";
import { StyledWebsiteSelector } from "./styles";

type CompetitorCustomersWebsiteSelectorProps = {
    domain: string;
    websiteData: WebsiteData;
    onWebsiteSelect(domain: string): void;
};

const className = "website-selector";
const CompetitorCustomersWebsiteSelector = (props: CompetitorCustomersWebsiteSelectorProps) => {
    const { domain, websiteData, onWebsiteSelect } = props;
    const [isOpen, setIsOpen] = React.useState(false);
    const autocompleteProps = React.useMemo(() => {
        return { placeholder: domain };
    }, [domain]);
    const handleChange = React.useCallback(
        (item: { name: string; icon: string }) => {
            onWebsiteSelect(item.name);
        },
        [domain, onWebsiteSelect],
    );
    const openDropdown = React.useCallback(() => setIsOpen(true), []);
    const closeDropdown = React.useCallback(() => setIsOpen(false), []);

    useOnOutsideClick(className, closeDropdown);

    return (
        <StyledWebsiteSelector>
            <QueryBarWebsiteItem
                text={domain}
                isCompare={false}
                onItemClick={openDropdown}
                image={websiteData?.info?.icon}
            />
            {isOpen && (
                <AutocompleteWebsitesCompareItem
                    excludes={[]}
                    className={className}
                    onClick={handleChange}
                    autocompleteProps={autocompleteProps}
                    similarSites={websiteData?.similarWebsites || []}
                />
            )}
        </StyledWebsiteSelector>
    );
};

export default CompetitorCustomersWebsiteSelector;
