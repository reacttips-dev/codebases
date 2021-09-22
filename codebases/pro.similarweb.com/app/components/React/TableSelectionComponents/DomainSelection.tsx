import React, { FunctionComponent, useRef, useState } from "react";
import { SwLog } from "@similarweb/sw-log";
import { Injector } from "common/ioc/Injector";
import categoryService, { ECategoryNameValidation } from "common/services/categoryService";
import { ECategoryType } from "common/services/categoryService.types";
import { SWReactTableWrapperContextConsumer } from "components/React/Table/SWReactTableWrapperSelectionContext";
import { TableSelection } from "components/TableSelection/src/TableSelection";
import { ETableSelectionNewGroupDropdownMode } from "components/TableSelection/src/TableSelectionNewGroupDropdown";
import { TableSelectionGroupWebsiteComponent } from "components/TableSelection/src/TableSelectionGroupWebsiteComponent";
import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import { marketingWorkspaceApiService } from "services/marketingWorkspaceApiService";
import { allTrackers } from "services/track/track";
import { MAX_DOMAINS_IN_CATEGORY } from "components/customCategoriesWizard/custom-categories-wizard-react";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";

export const DomainSelection: FunctionComponent<any> = (props) => {
    const i18n = i18nFilter();
    const {
        selectedRows,
        clearAllSelectedRows,
        showToast,
        appendTo = ".swReactTable-header-wrapper",
    } = props;
    const swNavigator = Injector.get<any>("swNavigator");
    const dropdownRef = useRef(null);

    const [newGroupLoading, setNewGroupLoading] = useState(false);
    const [isCreateNewListModalOpen, setIsCreateNewListModalOpen] = useState(false);
    const [newGroupType, setNewGroupType] = useState(ECategoryType.GENERAL_LIST);
    const [newGroupError, setNewGroupError] = useState(false);
    const [newGroupErrorMessage, setNewGroupErrorMessage] = useState(null);
    const [tableSelectionMode, setTableSelectionMode] = useState(
        ETableSelectionNewGroupDropdownMode.GROUP_LIST,
    );
    const [currentGroup, setCurrentGroup] = useState(null);
    const [linkToGroup, setLinkToGroup] = useState(null);

    const showSuccessToast = (name, isNewGroup, workspaceId?: string) => {
        clearAllSelectedRows();
        setTableSelectionMode(ETableSelectionNewGroupDropdownMode.GROUP_LIST);
        setNewGroupType(ECategoryType.GENERAL_LIST);
        setNewGroupErrorMessage(null);
        setNewGroupError(false);
        if (!isNewGroup) {
            setIsCreateNewListModalOpen(false);
        }
        dropdownRef.current.close();
        const text = isNewGroup
            ? i18n("table.selection.websites.groupcreated")
            : i18n("table.selection.websites.groupupdated");
        showGroupLinkToast(
            name,
            text,
            i18n("table.selection.websites.seegroup"),
            workspaceId,
            isNewGroup,
        );
    };
    const showGroupLinkToast = (name, text, label, workspaceId: string, isNewGroup: boolean) => {
        const params = swNavigator.getParams();
        let linkToGroup;
        const categoryObject = UserCustomCategoryService.getCustomCategoryByName(name);
        if (workspaceId) {
            linkToGroup = swNavigator.href("monitorpartners_home", null);
        } else {
            linkToGroup = swNavigator.href("marketresearch_webmarketanalysis_overview", {
                ...params,
                category: categoryObject?.forUrl,
            });
        }
        dropdownRef.current.close();
        if (isNewGroup) {
            setLinkToGroup(linkToGroup);
        } else {
            showToast(linkToGroup, text, label);
        }
    };
    const tableSelectionOnCancel = () => {
        setTableSelectionMode(ETableSelectionNewGroupDropdownMode.GROUP_LIST);
        setNewGroupError(false);
        setNewGroupErrorMessage(null);
        setIsCreateNewListModalOpen(false);
        setNewGroupType(ECategoryType.GENERAL_LIST);
        setLinkToGroup(null);
    };
    const getSelectedRowsFromStore = () => {
        return selectedRows.map((item) => item.Domain);
    };
    const onListTypeSelect = (typeId) => {
        setNewGroupType(typeId);
    };

    const tableSelectionOnSubmit = async (name) => {
        if (!name) {
            setNewGroupErrorMessage(i18n("customcategories.wizard.error.emptyname"));
            setNewGroupError(true);
            return;
        }
        const nameIsValid = categoryService.validateGroupName(name);
        if (nameIsValid === ECategoryNameValidation.ILLEGAL_EXIST) {
            setNewGroupErrorMessage(i18n("customcategories.wizard.error.duplicatename"));
            setNewGroupError(true);
            return;
        }
        if (nameIsValid === ECategoryNameValidation.ILLEGAL_LENGTH) {
            setNewGroupErrorMessage(i18n("customcategories.wizard.error.illegallength"));
            setNewGroupError(true);
            return;
        }
        if (nameIsValid === ECategoryNameValidation.ILLEGAL_CHARS) {
            setNewGroupErrorMessage(i18n("customcategories.wizard.error.illegalchars"));
            setNewGroupError(true);
            return;
        } else {
            const selectedDomains = getSelectedRowsFromStore();
            allTrackers.trackEvent(
                "add to Custom Category",
                "submit-ok",
                `create new group/Save/${name};${selectedDomains.length}`,
            );
            setNewGroupLoading(true);
            try {
                await UserCustomCategoryService.addCustomCategory({
                    name,
                    domains: selectedDomains,
                    categoryType: newGroupType,
                });
                if (newGroupType === ECategoryType.PARTNERS_LIST) {
                    const workspaceId = await marketingWorkspaceApiService.getOrCreateAnEmptyWorkspace();
                    showSuccessToast(name, true, workspaceId);
                } else {
                    showSuccessToast(name, true, null);
                }
            } catch (e) {
                SwLog.error(e);
            } finally {
                setNewGroupLoading(false);
            }
        }
    };
    const getGroups = () => {
        return UserCustomCategoryService.getCustomCategories().map(({ text, categoryId: id }) => ({
            text,
            id,
        }));
    };
    const onGroupClick = async (item) => {
        // click on new group
        if (!item.id) {
            onNewGroupClick(item);
            allTrackers.trackEvent("add to Custom Category", "click", "create new group");
        }
        // click on existing group
        else {
            await onExistingGroupClick(item);
        }
    };
    const onExistingGroupClick = async ({ id, text }) => {
        const currentGroup = UserCustomCategoryService.getCustomCategoryById(id);
        const currentDomains = currentGroup.domains;
        const selectedDomains = getSelectedRowsFromStore();
        const withoutDuplications = _.uniq([...currentDomains, ...selectedDomains]);
        const newDomainsCount = withoutDuplications.length - currentDomains.length;

        // if no new domains were added
        if (newDomainsCount === 0) {
            setTableSelectionMode(ETableSelectionNewGroupDropdownMode.ALL_ITEMS_EXISTS);
            setCurrentGroup(text);
        }

        // new domains added
        else {
            // check number of domains in category
            if (withoutDuplications.length > MAX_DOMAINS_IN_CATEGORY) {
                setTableSelectionMode(ETableSelectionNewGroupDropdownMode.MAX_ITEMS);
            } else {
                allTrackers.trackEvent(
                    "add to Custom Category",
                    "click",
                    `edit keyword group/Save/${text};${newDomainsCount}`,
                );
                try {
                    const update = await UserCustomCategoryService.updateCustomCategory({
                        domains: withoutDuplications,
                        id,
                        name: text,
                    });
                    let workspaces = null;
                    if (currentGroup.categoryType === ECategoryType.PARTNERS_LIST) {
                        workspaces = await marketingWorkspaceApiService.getMarketingWorkspaces();
                    }

                    if (update) {
                        showSuccessToast(
                            text,
                            false,
                            Array.isArray(workspaces) ? workspaces[0].id : null,
                        );
                    }
                } catch (e) {
                    SwLog.error(e);
                }
            }
        }
    };

    const onNewGroupClick = (item) => {
        if (selectedRows.length > MAX_DOMAINS_IN_CATEGORY) {
            setTableSelectionMode(ETableSelectionNewGroupDropdownMode.MAX_ITEMS);
        } else {
            setTableSelectionMode(ETableSelectionNewGroupDropdownMode.NEW_GROUP);
        }
    };
    const onNewListButtonClick = () => {
        setIsCreateNewListModalOpen(true);
    };
    const getDropdownComponent = () => {
        return (
            <>
                <TableSelectionGroupWebsiteComponent
                    appendTo={appendTo}
                    onNewListButtonClick={onNewListButtonClick}
                    onCancel={tableSelectionOnCancel}
                    isCreateNewListModalOpen={isCreateNewListModalOpen}
                    newGroupNameLabel={i18n("table.selection.newgroup.websites.title")}
                    groups={getGroups()}
                    groupIconName="category"
                    onGroupClick={onGroupClick}
                    isLoading={newGroupLoading}
                    onSubmit={tableSelectionOnSubmit}
                    errorMessage={newGroupErrorMessage}
                    error={newGroupError}
                    onListTypeSelect={onListTypeSelect}
                    selectedListType={newGroupType}
                    ref={dropdownRef}
                    mode={tableSelectionMode}
                    newGroupItemText="table.selection.newgroup.websites.create"
                    currentGroup={currentGroup}
                    allItemsExistsMessage="table.selection.websites.exists"
                    maxItemsMessage="table.selection.websites.max.websites"
                    count={selectedRows?.length || 0}
                    linkToGroup={linkToGroup}
                />
            </>
        );
    };
    return (
        <SWReactTableWrapperContextConsumer>
            {({ selectedRows, clearAllSelectedRows }) => {
                const text = i18n("incomingtraffic.tableselection.selected", {
                    count: selectedRows.length.toString(),
                });
                return (
                    <TableSelection
                        showSeparator={false}
                        key="1"
                        selectedText={text}
                        onCloseClick={clearAllSelectedRows}
                        addToGroupLabel=""
                        isVisible={selectedRows.length > 0}
                        groupSelectorElement={getDropdownComponent()}
                    />
                );
            }}
        </SWReactTableWrapperContextConsumer>
    );
};
