import { Injector } from "common/ioc/Injector";
import { SWReactTableWrapperContextConsumer } from "components/React/Table/SWReactTableWrapperSelectionContext";
import { TableSelection } from "components/TableSelection/src/TableSelection";
import { TableSelectionNewGroupDropdown } from "components/TableSelection/src/TableSelectionNewGroupDropdown";
import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import { KeywordGroupEditorHelpers } from "pages/keyword-analysis/KeywordGroupEditorHelpers";
import { useRef, useState } from "react";
import * as React from "react";
import { marketingWorkspaceApiService } from "services/marketingWorkspaceApiService";
import { allTrackers } from "services/track/track";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

const i18n = i18nFilter();

export enum ETableSelectionNewGroupDropdownMode {
    NEW_GROUP,
    ALL_ITEMS_EXISTS,
    MAX_ITEMS,
    GROUP_LIST,
}

export const KeywordSelection: React.FC<{
    selectedRows: any[];
    clearAllSelectedRows: VoidFunction;
    onKeywordsAddedToGroup?: (group, flag, workspaceId?) => void;
    notify?: boolean;
    showToast: (a, b, c) => void;
    appendTo: string;
}> = (props) => {
    const dropdownRef = useRef<any>();
    const [tableSelectionMode, setTableSelectionMode] = useState<
        ETableSelectionNewGroupDropdownMode
    >(ETableSelectionNewGroupDropdownMode.GROUP_LIST);
    const [tableSelectionCurrentGroup, setTableSelectionCurrentGroup] = useState<string>(null);
    const [tableSelectionErrorMessage, setTableSelectionErrorMessage] = useState<string>(null);
    const [isTableSelectionLoading, setIsTableSelectionLoading] = useState<boolean>(false);
    const [tableSelectionIsValid, setTableSelectionIsValid] = useState<boolean>(true);
    const maxKeywordsInGroup = KeywordGroupEditorHelpers.getMaxGroupCount();
    const swNavigator = Injector.get<any>("swNavigator");

    const tableSelectionOnCancel = () => {
        if (tableSelectionMode === ETableSelectionNewGroupDropdownMode.NEW_GROUP) {
            allTrackers.trackEvent(
                "add to keyword group",
                "click",
                "Create New Keyword Group/Cancel",
            );
        }
        setTableSelectionMode(ETableSelectionNewGroupDropdownMode.GROUP_LIST);
        setTableSelectionIsValid(true);
        setTableSelectionErrorMessage(null);
    };

    const getSelectedRowsFromStore = () => {
        // TODO: liorb - make 'SearachTerm' customable via props
        return props.selectedRows.map((item) => item.SearchTerm);
    };

    const onNewGroupClick = (item) => {
        allTrackers.trackEvent("add to keyword group", "click", "create new group");
        if (getSelectedRowsFromStore().length > KeywordGroupEditorHelpers.getMaxGroupCount()) {
            setTableSelectionMode(ETableSelectionNewGroupDropdownMode.MAX_ITEMS);
        } else {
            setTableSelectionMode(ETableSelectionNewGroupDropdownMode.NEW_GROUP);
        }
    };

    const showGroupLinkToast = (name, text, label, workspaceId?: string) => {
        const { country, duration } = swNavigator.getParams();
        let linkToGroup;
        if (workspaceId) {
            linkToGroup = swNavigator.href("marketingWorkspace-keywordGroup", {
                keywordGroupId: name,
                workspaceId,
            });
        } else {
            linkToGroup = swNavigator.href("keywordAnalysis_overview", {
                country,
                duration,
                keyword: `*${name}`,
            });
        }
        props.showToast(linkToGroup, text, label);
    };

    const onExistingGroupClick = async (item) => {
        const currentGroup = keywordsGroupsService.findGroupById(item.id);
        const currentKeywords = currentGroup.Keywords.map((keyword) => {
            return { text: keyword };
        });
        const newKeywords = getSelectedRowsFromStore().map((keyword) => {
            return { text: keyword };
        });
        const withoutDuplications = _.uniqWith(
            [...currentKeywords, ...newKeywords],
            (crr, other) => crr.text === other.text,
        );
        const newKeywordsCount = withoutDuplications.length - currentKeywords.length;
        // if no new keywords was added
        setTableSelectionCurrentGroup(currentGroup.Name);
        // await this.setStateAsync({
        //     tableSelectionCurrentGroup:
        // });

        if (newKeywordsCount === 0) {
            setTableSelectionMode(ETableSelectionNewGroupDropdownMode.ALL_ITEMS_EXISTS);
        }
        // new keywords added
        else {
            const group = KeywordGroupEditorHelpers.keywordGroupFromList(
                {
                    title: currentGroup.Name,
                    items: withoutDuplications,
                },
                currentGroup,
            );
            allTrackers.trackEvent(
                "add to keyword group",
                "click",
                `Edit Keyword Group/Save/${group.Name};${group.Keywords.length}`,
            );
            // check number of keywords in group
            if (group.Keywords.length > maxKeywordsInGroup) {
                setTableSelectionMode(ETableSelectionNewGroupDropdownMode.MAX_ITEMS);
            } else {
                const result = await keywordsGroupsService.update(group);
                if (result) {
                    props.clearAllSelectedRows();
                    setTableSelectionMode(ETableSelectionNewGroupDropdownMode.GROUP_LIST);
                    setTableSelectionIsValid(true);
                    setTableSelectionErrorMessage(null);
                    dropdownRef.current.close();
                    props.onKeywordsAddedToGroup(group, false);
                    if (props.notify) {
                        showGroupLinkToast(
                            currentGroup.Id,
                            i18n("table.selection.keywords.groupupdated", {
                                count: newKeywordsCount.toString(),
                            }),
                            i18n("table.selection.keywords.seegroup"),
                        );
                    }
                }
            }
        }
    };

    const onGroupClick = async (item) => {
        // click on new group
        if (!item.id) {
            onNewGroupClick(item);
        }
        // click on existing group
        else {
            await onExistingGroupClick(item);
        }
    };

    const tableSelectionOnSubmit = async (name) => {
        const { isValid, errorMessage } = KeywordGroupEditorHelpers.validateTitle(name);
        if (!isValid) {
            setTableSelectionIsValid(isValid);
            setTableSelectionErrorMessage(errorMessage);
        } else {
            // await this.toggleLoading();
            setIsTableSelectionLoading(!isTableSelectionLoading);
            const group = KeywordGroupEditorHelpers.keywordGroupFromList({
                title: name,
                items: getSelectedRowsFromStore().map((keyword) => {
                    return { text: keyword };
                }),
            });
            allTrackers.trackEvent(
                "add to keyword group",
                "submit-ok",
                `Create New Keyword Group/Save/${name};${group.Keywords.length}`,
            );
            const result = await keywordsGroupsService.update(group);
            const groupFound = result.find((record) => record.Name === name);
            if (result) {
                const workspaceId = await marketingWorkspaceApiService.getOrCreateAnEmptyWorkspace();
                if (workspaceId) {
                    if (groupFound) {
                        if (props.notify) {
                            showGroupLinkToast(
                                groupFound.Id,
                                i18n("table.selection.keywords.groupcreated"),
                                i18n("table.selection.keywords.seegroup"),
                                workspaceId,
                            );
                        }
                    }
                } else {
                    if (props.notify) {
                        showGroupLinkToast(
                            groupFound.Id,
                            i18n("table.selection.keywords.groupcreated"),
                            i18n("table.selection.keywords.seegroup"),
                        );
                    }
                }
                // await this.toggleLoading();
                setIsTableSelectionLoading(!isTableSelectionLoading);
                props.clearAllSelectedRows();
                setTableSelectionMode(ETableSelectionNewGroupDropdownMode.GROUP_LIST);
                setTableSelectionIsValid(true);
                setTableSelectionErrorMessage(null);
                dropdownRef.current.close();
                const addedGroup = result.find((r) => r.Name === group.Name) || {};
                props.onKeywordsAddedToGroup(
                    {
                        ...group,
                        ...addedGroup,
                    },
                    true,
                    workspaceId,
                );
            } else {
                // error
                dropdownRef.current.close();
            }
        }
    };

    const getDropdown = () => {
        return (
            <TableSelectionNewGroupDropdown
                appendTo={props.appendTo}
                ref={(ref) => {
                    dropdownRef.current = ref;
                }}
                groups={keywordsGroupsService.groupsToDropDown()}
                onSubmit={tableSelectionOnSubmit}
                isLoading={isTableSelectionLoading}
                error={!tableSelectionIsValid}
                errorMessage={tableSelectionErrorMessage}
                onGroupClick={onGroupClick}
                mode={tableSelectionMode}
                currentGroup={tableSelectionCurrentGroup}
                onCancel={tableSelectionOnCancel}
                groupIconName="keyword-group"
                count={maxKeywordsInGroup}
                newGroupNameLabel={i18n("table.selection.newgroup.keywords.title")}
                trackingCategory="add to keyword group"
                allItemsExistsMessage="table.selection.keywords.exists"
                maxItemsMessage="table.selection.keywords.max.keywords"
                newGroupItemText="table.selection.newgroup.keywords.create"
            />
        );
    };
    return (
        <SWReactTableWrapperContextConsumer>
            {({ selectedRows, clearAllSelectedRows }) => {
                const text = i18n("keyword.generator.tool.table.keywords.selected", {
                    number: selectedRows.length.toString(),
                });
                return (
                    <TableSelection
                        key="1"
                        selectedText={text}
                        onCloseClick={clearAllSelectedRows}
                        addToGroupLabel=""
                        isVisible={selectedRows.length > 0}
                        groupSelectorElement={getDropdown()}
                    />
                );
            }}
        </SWReactTableWrapperContextConsumer>
    );
};

KeywordSelection.defaultProps = {
    notify: true,
    onKeywordsAddedToGroup: () => null,
    showToast: () => null,
};
