import React from "react";
import { IChosenItem } from "app/@types/chosenItems";
import { StyledSitesDropdownContainer } from "./styles";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { ListItemSeparator } from "@similarweb/ui-components/dist/list-item";
import { useOnOutsideClick } from "pages/sales-intelligence/hooks/useOnOutsideClick";
import { BaseWebsiteType } from "pages/workspace/sales/sub-modules/benchmarks/types/common";
import { AutocompleteWebsitesCompareItem } from "components/AutocompleteWebsites/AutocompleteWebsitesCompareItem";

type SimilarSitesDropdownProps = {
    domain: string;
    excludeList: { name: string }[];
    otherSimilarSites: ({ Domain: string; Favicon: string } | number)[];
    onSelect(website: BaseWebsiteType): void;
    renderButton(openDropdown: () => void): React.ReactNode;
};

const className = "website-selector";
const SimilarSitesDropdown = (props: SimilarSitesDropdownProps) => {
    const translate = useTranslation();
    const { domain, otherSimilarSites, excludeList, renderButton, onSelect } = props;
    const [isOpen, setIsOpen] = React.useState(false);
    const autocompleteProps = React.useMemo(() => {
        return { placeholder: translate("si.sidebar.similar_sites.dropdown.placeholder") };
    }, [domain]);
    const openDropdown = React.useCallback(() => setIsOpen(true), []);
    const closeDropdown = React.useCallback(() => setIsOpen(false), []);

    const renderSimilarSitesHead = () => {
        return (
            <ListItemSeparator>
                {translate("si.sidebar.similar_sites.dropdown.separator_text")}
            </ListItemSeparator>
        );
    };

    const handleSelect = (site: { name: string; icon: string }) => {
        onSelect({ domain: site.name, favicon: site.icon });
        closeDropdown();
    };

    useOnOutsideClick(className, closeDropdown);

    return (
        <StyledSitesDropdownContainer>
            {renderButton(openDropdown)}
            {isOpen && (
                <AutocompleteWebsitesCompareItem
                    className={className}
                    onClick={handleSelect}
                    similarSites={otherSimilarSites}
                    autocompleteProps={autocompleteProps}
                    excludes={excludeList as IChosenItem[]}
                    renderSimilarSitesHead={renderSimilarSitesHead}
                />
            )}
        </StyledSitesDropdownContainer>
    );
};

export default SimilarSitesDropdown;
