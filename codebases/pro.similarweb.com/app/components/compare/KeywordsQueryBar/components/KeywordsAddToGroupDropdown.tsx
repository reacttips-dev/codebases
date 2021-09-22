import { SwNavigator } from "common/services/swNavigator";
import React, { FC, useRef, useState } from "react";
import { showSuccessToast } from "actions/toast_actions";
import { getToastItemComponent } from "components/React/Toast/ToastItem";
import { allTrackers } from "services/track/track";
import { connect } from "react-redux";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { KeywordGroupEditorHelpers } from "pages/keyword-analysis/KeywordGroupEditorHelpers";
import {
    ETableSelectionNewGroupDropdownMode,
    TableSelectionNewGroupDropdown,
} from "components/TableSelection/src/TableSelectionNewGroupDropdown";
import { marketingWorkspaceApiService } from "services/marketingWorkspaceApiService";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

export interface IKeywordsAddToGroupDropdownProps {
    keywordToAdd: string;
    buttonIcon: string;
    services: {
        translate: (key: string, obj?: any, defaultValue?: string) => string;
        swNavigator: SwNavigator;
    };
    onDropdownToggle?: (isOpen: boolean) => void;
    showToast: (href, text, label) => void;
}

const KeywordsAddToGroupDropdown = (props: IKeywordsAddToGroupDropdownProps) => {
    const { services, keywordToAdd, showToast, onDropdownToggle, buttonIcon } = props;

    const dropdownRef = useRef<TableSelectionNewGroupDropdown>(null);
    const maxKeywordsInGroup = KeywordGroupEditorHelpers.getMaxGroupCount();

    const [selectedGroup, setSelectedGroup] = useState(null);
    const [isSelectionValid, setIsSelectionValid] = useState<boolean>(true);
    const [selectionErrMessage, setSelectionErrMessage] = useState<string>(null);
    const [selectMode, setSelectMode] = useState<ETableSelectionNewGroupDropdownMode>(
        ETableSelectionNewGroupDropdownMode.GROUP_LIST,
    );

    const showGroupLinkToast = (name, text, label, workspaceId?: string) => {
        const { country, duration } = services.swNavigator.getParams();
        let linkToGroup;
        if (workspaceId) {
            linkToGroup = services.swNavigator.href("marketingWorkspace-keywordGroup", {
                keywordGroupId: name,
                workspaceId,
            });
        } else {
            linkToGroup = services.swNavigator.href("keywordAnalysis_overview", {
                country,
                duration,
                keyword: `*${name}`,
            });
        }
        showToast(linkToGroup, text, label);
    };

    const onSubmit = async (name) => {
        const { isValid, errorMessage } = KeywordGroupEditorHelpers.validateTitle(name);

        if (!isValid) {
            setIsSelectionValid(isValid);
            setSelectionErrMessage(errorMessage);
            return;
        }

        const groupToCreate = KeywordGroupEditorHelpers.keywordGroupFromList({
            title: name,
            items: [{ text: keywordToAdd }],
        });

        const result = await keywordsGroupsService.update(groupToCreate);
        if (!result) {
            dropdownRef?.current?.close();
            return;
        }

        const newGroup = result.find((record) => record.Name === name);

        const workspaceId = await marketingWorkspaceApiService.getOrCreateAnEmptyWorkspace();
        if (workspaceId) {
            if (newGroup) {
                showGroupLinkToast(
                    newGroup.Id,
                    services.translate("table.selection.keywords.groupcreated"),
                    services.translate("table.selection.keywords.seegroup"),
                    workspaceId,
                );
            }
        } else {
            if (newGroup) {
                showGroupLinkToast(
                    newGroup.Id,
                    services.translate("table.selection.keywords.groupcreated"),
                    services.translate("table.selection.keywords.seegroup"),
                );
            }
        }

        setSelectMode(ETableSelectionNewGroupDropdownMode.GROUP_LIST);
        setIsSelectionValid(true);
        setSelectionErrMessage(null);
        dropdownRef?.current?.close();
    };

    const onCancel = () => {
        setSelectMode(ETableSelectionNewGroupDropdownMode.GROUP_LIST);
        setIsSelectionValid(true);
        setSelectionErrMessage(null);
    };

    const onNewGroupClick = () => {
        if (maxKeywordsInGroup < 1) {
            setSelectMode(ETableSelectionNewGroupDropdownMode.MAX_ITEMS);
            return;
        }

        setSelectMode(ETableSelectionNewGroupDropdownMode.NEW_GROUP);
    };

    const onExistingGroupClick = async (item) => {
        const currentGroup = keywordsGroupsService.findGroupById(item.id);
        setSelectedGroup(currentGroup.Name);

        const currentKeywords = currentGroup.Keywords.map((keyword: string) => {
            return { text: keyword };
        });

        const isKeywordExists = currentKeywords.some(
            (groupKeyword) => groupKeyword.text === keywordToAdd,
        );

        if (isKeywordExists) {
            setSelectMode(ETableSelectionNewGroupDropdownMode.ALL_ITEMS_EXISTS);
            return;
        }

        const updatedGroup = KeywordGroupEditorHelpers.keywordGroupFromList(
            {
                title: currentGroup.Name,
                items: [...currentKeywords, { text: keywordToAdd }],
            },
            currentGroup,
        );

        if (updatedGroup.Keywords.length > maxKeywordsInGroup) {
            setSelectMode(ETableSelectionNewGroupDropdownMode.MAX_ITEMS);
            return;
        }

        const result = await keywordsGroupsService.update(updatedGroup);
        if (!result) {
            return;
        }

        setSelectMode(ETableSelectionNewGroupDropdownMode.GROUP_LIST);
        setIsSelectionValid(true);
        setSelectionErrMessage(null);

        if (dropdownRef?.current) {
            dropdownRef.current.close();
        }

        showGroupLinkToast(
            currentGroup.Id,
            services.translate("table.selection.keywords.groupupdated", {
                count: 1,
            }),
            services.translate("table.selection.keywords.seegroup"),
        );
    };

    const onGroupClick = (item) => {
        if (!item.id) {
            onNewGroupClick();
            return;
        }

        onExistingGroupClick(item);
    };

    return (
        <TableSelectionNewGroupDropdown
            appendTo={"body"}
            renderDropdownButton={() => <IconButton type="flat" iconName={buttonIcon} />}
            ref={(ref) => {
                dropdownRef.current = ref;
            }}
            groups={keywordsGroupsService.groupsToDropDown()}
            onSubmit={onSubmit}
            isLoading={false}
            error={!isSelectionValid}
            errorMessage={selectionErrMessage}
            onGroupClick={onGroupClick}
            mode={selectMode}
            currentGroup={selectedGroup}
            onCancel={onCancel}
            groupIconName="keyword-group"
            count={maxKeywordsInGroup}
            newGroupNameLabel={services.translate("table.selection.newgroup.keywords.title")}
            trackingCategory="add to keyword group"
            allItemsExistsMessage="table.selection.keywords.exists"
            maxItemsMessage="table.selection.keywords.max.keywords"
            newGroupItemText="table.selection.newgroup.keywords.create"
            onToggleDropdown={(isOpen) => {
                if (onDropdownToggle) {
                    onDropdownToggle(isOpen);
                }
            }}
        />
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        showToast: (href, text, label) => {
            dispatch(
                showSuccessToast(
                    getToastItemComponent({
                        text,
                        linkText: label,
                        href,
                        onClick: allTrackers.trackEvent.bind(
                            allTrackers,
                            "add to keyword group",
                            "click",
                            "internal link/keywordAnalysis-organic",
                        ),
                    }),
                ),
            );
        },
    };
};

export default connect(null, mapDispatchToProps)(KeywordsAddToGroupDropdown);
