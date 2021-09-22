import React, { useState } from "react";
import { SWReactIcons } from "@similarweb/icons";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { usePrevious } from "components/hooks/usePrevious";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { useOnOutsideClick } from "pages/sales-intelligence/hooks/useOnOutsideClick";
import { ListItemsLoader } from "pages/sales-intelligence/common-components/ListItemsLoader/ListItemsLoader";
import ScrollableDropdownContainer from "pages/workspace/sales/components/custom-dropdown/ScrollableDropdownContainer/ScrollableDropdownContainer";
import { doesSearchObjectHaveIds, getSearchId } from "../../../saved-searches/helpers";
import { fromStringToLegacyDomainDto, getLastOpportunityByDate } from "../../helpers";
import {
    StyledAddToListDropdown,
    StyledAddToListDropdownButton,
    StyledAddToListDropdownContent,
} from "./styles";
import AddToListDropdownItem from "./AddToListDropdownItem";
import CreateListItem from "./CreateListItem";
import CreateListForm from "./CreateListForm";
import { AddOpportunitiesToListDto, OpportunityListType } from "../../types";
import { AddToListDropdownProps, DisabledOpportunityListType } from "./types";

const SCROLL_AREA_STYLES: React.CSSProperties = { maxHeight: 200 };

const AddToListDropdown = ({
    onDone,
    domains,
    searchObject,
    listCreating,
    listUpdating,
    createList,
    opportunityLists,
    renderDropdownButton,
    updateListOpportunitiesFromSearch,
    className = "add-to-list-dropdown",
    dropdownItemClick,
    labelCreateBtn,
    isOpen,
    setIsOpen,
    disabledText,
    withLoadingState,
    getWorkspace,
    isOldSales,
}: AddToListDropdownProps) => {
    const translate = useTranslation();

    const [isLoading, setIsLoading] = useState(false);

    const withSearchObject = doesSearchObjectHaveIds(searchObject);
    // Previous values
    const prevCreating = usePrevious(listCreating);
    const prevUpdating = usePrevious(listUpdating);

    const [isCreateModeActive, setIsCreateModeActive] = React.useState(false);

    // Callbacks
    const openDropdown = React.useCallback(() => setIsOpen(true), []);

    const handleItemClick = React.useCallback(
        (list: DisabledOpportunityListType) => {
            setIsLoading(true);
            if (list.disabled) {
                return;
            }

            const dto: AddOpportunitiesToListDto = {
                opportunities: domains,
            };

            if (withSearchObject) {
                dto.queryId = getSearchId(searchObject);
                dto.runId = searchObject.lastRun.id;
            }

            if (typeof dropdownItemClick === "function") {
                dropdownItemClick(list, dto); // TODO add props items;
                setIsOpen(false);

                return null;
            }

            setIsLoading(false);

            // Get workspace only if in sales 1
            isOldSales && getWorkspace();
            updateListOpportunitiesFromSearch(list, dto);
        },
        [domains, searchObject, withSearchObject, updateListOpportunitiesFromSearch],
    );

    const handleCreateCancelClick = React.useCallback(() => setIsCreateModeActive(false), []);

    const handleCreateSubmit = React.useCallback(
        (name: OpportunityListType["friendlyName"]) => {
            const mappedDomains = domains.map(fromStringToLegacyDomainDto);

            if (withSearchObject) {
                createList(name, mappedDomains, getSearchId(searchObject), searchObject.lastRun.id);
            } else {
                createList(name, mappedDomains);
            }
        },
        [domains, createList, searchObject, withSearchObject],
    );

    const handleOutsideClick = React.useCallback(() => {
        if (isCreateModeActive) {
            setIsCreateModeActive(false);
        }

        if (isOpen) {
            setIsOpen(false);
        }
    }, [isOpen, isCreateModeActive]);

    useOnOutsideClick(className, handleOutsideClick);

    // React to list create finished
    React.useEffect(() => {
        if (typeof prevCreating !== "undefined" && prevCreating !== listCreating && !listCreating) {
            handleOutsideClick();
            onDone(getLastOpportunityByDate(opportunityLists));
        }
    }, [listCreating]);

    // React to list update finished
    React.useEffect(() => {
        if (typeof prevUpdating !== "undefined" && prevUpdating !== listUpdating && !listUpdating) {
            handleOutsideClick();
            onDone();
        }
    }, [listUpdating]);

    function renderButton() {
        if (typeof renderDropdownButton === "function") {
            return renderDropdownButton(openDropdown);
        }

        return (
            <StyledAddToListDropdownButton
                onClick={openDropdown}
                data-automation="add-to-list-dropdown-button"
            >
                <span>{translate("si.components.add_to_list_dropdown.button.text")}</span>
                <SWReactIcons iconName="arrow" />
            </StyledAddToListDropdownButton>
        );
    }

    function renderContent() {
        // Will be implemented later
        // if (withLoadingState && isLoading) {
        //     return <ListItemsLoader />;
        // }

        if (isCreateModeActive) {
            return (
                <CreateListForm
                    loading={listCreating}
                    onSubmit={handleCreateSubmit}
                    onCancel={handleCreateCancelClick}
                    labelCreateBtn={labelCreateBtn}
                />
            );
        }

        const renderItem = (list: DisabledOpportunityListType) => {
            const item = (
                <AddToListDropdownItem
                    key={list?.opportunityListId}
                    disabled={list.disabled}
                    list={list}
                    onClick={handleItemClick}
                />
            );

            if (disabledText && list.disabled) {
                return (
                    <PlainTooltip
                        maxWidth={200}
                        key={list.opportunityListId}
                        placement="top"
                        tooltipContent={disabledText}
                    >
                        {item}
                    </PlainTooltip>
                );
            }

            return item;
        };

        return (
            <ScrollableDropdownContainer scrollAreaStyle={SCROLL_AREA_STYLES}>
                {opportunityLists.map(renderItem)}
            </ScrollableDropdownContainer>
        );
    }

    return (
        <StyledAddToListDropdown className={className}>
            {renderButton()}
            <StyledAddToListDropdownContent open={isOpen}>
                <CreateListItem
                    clickable={!isCreateModeActive}
                    onClick={() => setIsCreateModeActive(true)}
                />
                {renderContent()}
            </StyledAddToListDropdownContent>
        </StyledAddToListDropdown>
    );
};

export default AddToListDropdown;
