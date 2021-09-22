import React from "react";
import { DropdownButton } from "@similarweb/ui-components/dist/dropdown";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { useOnOutsideClick } from "pages/sales-intelligence/hooks/useOnOutsideClick";
import {
    nameMatchesSearchTerm,
    toItemWithMatchedSubStrings,
    compareByPrimaryNameMatch,
    isOfTypeCategory,
    isOfTypeSubCategory,
    isOfTypeTechnology,
    toEntryName,
} from "../../../helpers/filters";
import { StyledBaseDropdownButtonWrap } from "../../styles";
import { CONTAINER_CLASSNAME, StyledDDContainer, StyledDDContent } from "./styles";
import { TechnologiesDDSmartTabs } from "../TechnologiesDDTabs/TechnologiesDDTabs";
import {
    CategoryListItemType,
    SubCategoryListItemType,
    TechnologiesBaseListItem,
    TechnologiesConditionEntry,
    TechnologiesDDItemType,
    TechnologyListItemType,
} from "../../../filters/technology/types";

export type TechnologiesDropdownProps = {
    categories: readonly CategoryListItemType[];
    subCategories: readonly SubCategoryListItemType[];
    technologies: readonly TechnologyListItemType[];
    selectedEntries: TechnologiesConditionEntry[];
    onSelect(item: TechnologiesConditionEntry): void;
};

const TechnologiesDropdown = (props: TechnologiesDropdownProps) => {
    const translate = useTranslation();
    const { categories, subCategories, technologies, selectedEntries, onSelect } = props;
    const [isOpened, setIsOpened] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");
    /** SearchTerm filter predicate */
    const matchesSearchTerm = nameMatchesSearchTerm(searchTerm);
    /** SearchTerm mapper to make matches bold */
    const toItemWithSubStringMatches = toItemWithMatchedSubStrings(searchTerm);
    /**
     * The main transformer function for each array of items.
     * It filters out all unmatched items.
     * Then it maps them to objects that contain matched string.
     * And sorts by matched string priority, meaning that primary string is coming first.
     */
    const processItemsAccordingToSearchTerm = <T extends TechnologiesBaseListItem>(
        items: readonly T[],
    ) => {
        return items
            .filter(matchesSearchTerm)
            .map(toItemWithSubStringMatches)
            .sort(compareByPrimaryNameMatch);
    };

    const searchProps = React.useMemo(() => {
        return {
            value: searchTerm,
            onChange: setSearchTerm,
            placeholder: translate("si.lead_gen_filters.technologies.dd_placeholder"),
        };
    }, [searchTerm]);

    const handleButtonClick = () => {
        setIsOpened(true);
    };

    const handleItemClick = ({ name, type }: TechnologiesDDItemType) => {
        onSelect({ name, type });
    };

    const handleOutsideClick = React.useCallback(() => {
        if (isOpened) {
            setIsOpened(false);
        }
    }, [isOpened]);

    const tabs = React.useMemo(() => {
        const filteredCategories = processItemsAccordingToSearchTerm(categories);
        const filteredSubCategories = processItemsAccordingToSearchTerm(subCategories);
        const filteredTechnologies = processItemsAccordingToSearchTerm(technologies);

        const selectedCategories = selectedEntries.filter(isOfTypeCategory).map(toEntryName);
        const selectedSubCategories = selectedEntries.filter(isOfTypeSubCategory).map(toEntryName);
        const selectedTechnologies = selectedEntries.filter(isOfTypeTechnology).map(toEntryName);

        return [
            {
                id: "categories",
                name: translate(`si.lead_gen_filters.technologies.dd_tab.categories.name`, {
                    amountOfItems: filteredCategories.length,
                }),
                items: filteredCategories.map((c) => ({
                    ...c,
                    isSelected: selectedCategories.includes(c.name),
                })),
            },
            {
                id: "subCategories",
                name: translate(`si.lead_gen_filters.technologies.dd_tab.subCategories.name`, {
                    amountOfItems: filteredSubCategories.length,
                }),
                items: filteredSubCategories.map((c) => ({
                    ...c,
                    isSelected: selectedSubCategories.includes(c.name),
                })),
            },
            {
                id: "technologies",
                name: translate(`si.lead_gen_filters.technologies.dd_tab.technologies.name`, {
                    amountOfItems: filteredTechnologies.length,
                }),
                items: filteredTechnologies.map((c) => ({
                    ...c,
                    isSelected: selectedTechnologies.includes(c.name),
                })),
            },
        ];
    }, [categories, subCategories, technologies, searchTerm, selectedEntries]);

    useOnOutsideClick(CONTAINER_CLASSNAME, handleOutsideClick);

    return (
        <StyledDDContainer className={CONTAINER_CLASSNAME}>
            <StyledBaseDropdownButtonWrap>
                <div onClick={handleButtonClick}>
                    <DropdownButton>
                        {translate("si.lead_gen_filters.technologies.dd_button_text")}
                    </DropdownButton>
                </div>
            </StyledBaseDropdownButtonWrap>
            <StyledDDContent includesSearch open={isOpened} searchProps={searchProps}>
                <TechnologiesDDSmartTabs
                    tabs={tabs}
                    onItemClick={handleItemClick}
                    isSearchEmpty={searchTerm.length === 0}
                />
            </StyledDDContent>
        </StyledDDContainer>
    );
};

export default TechnologiesDropdown;
