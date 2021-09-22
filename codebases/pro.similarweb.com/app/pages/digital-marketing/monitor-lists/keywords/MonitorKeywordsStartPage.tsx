import { KeywordGroupCreationDropdown } from "components/GroupCreationDropdown/src/KeywordGroupCreationDropdown";
import { ConfirmationTextModal } from "components/Modals/src/ConfirmationTextModal";
import I18n from "components/WithTranslation/src/I18n";
import { i18nFilter } from "filters/ngFilters";
import dayjs from "dayjs";
import { KeywordGroupTable } from "pages/digital-marketing/monitor-lists/keywords/KeywordGroupTable";
import { ISharedKeywordGroup, trackDeleteList, trackOpenDeleteModal } from "../utils";
import {
    NoGroupsContainer,
    NoGroupsDescription,
    NoGroupsImage,
    NoGroupsTitle,
    StartPageContentWrapper,
    StartPageWrapper,
    StartPageTitleSection,
    StartPageTitle,
} from "pages/digital-marketing/monitor-lists/StyledComponents";
import {
    ListsType,
    removeUnnecessaryFieldsFromGroups,
    sortGroupsByCreationDate,
} from "pages/digital-marketing/monitor-lists/utils";
import { KeywordGroupsShareModal } from "pages/workspace/marketing/pages/KeywordGroupShareModal";
import React, { FC, useRef, useState } from "react";
import { AssetsService } from "services/AssetsService";
import { IAccountUser } from "sharing/SharingService";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";
import { IconButton } from "@similarweb/ui-components/dist/button/src/IconButton";
import { IKeywordGroup } from "../utils";
import { KeywordsGroupEditorModal } from "pages/keyword-analysis/KeywordsGroupEditorModal";

const i18n = i18nFilter();

const KeywordGroupsSection = styled.div``;

const SharedKeywordGroupsSection = styled.div``;

const ContentSection = styled(FlexRow)`
    flex-wrap: wrap;
    margin-bottom: 32px;
`;

const NoKeywordGroupsComponent: FC<any> = () => {
    return (
        <NoGroupsContainer>
            <NoGroupsImage>
                <img
                    src={AssetsService.assetUrl("/images/empty-state/monitor-keyword-groups.svg")}
                    alt="monitor keyword groups"
                />
            </NoGroupsImage>
            <NoGroupsTitle>
                <I18n>keywordresearch.monitorkeywords.nogroups.title</I18n>
            </NoGroupsTitle>
            <NoGroupsDescription>
                <I18n>keywordresearch.monitorkeywords.nogroups.description</I18n>
            </NoGroupsDescription>
        </NoGroupsContainer>
    );
};

interface IMonitorKeywordsStartPage {
    keywordGroups: IKeywordGroup[];
    sharedKeywordGroups: ISharedKeywordGroup[];
    users: IAccountUser[];
    onSeeGroupClick: (listId: string) => () => void;
    fetchTableData: (params) => any;
    defaultCountry: number;
    keywordGroupsUpdater: any;
    hasGroupSharingPermissions: boolean;
    service: any;
}

export const MonitorKeywordsStartPage: FC<IMonitorKeywordsStartPage> = ({
    keywordGroups,
    sharedKeywordGroups,
    users,
    onSeeGroupClick,
    fetchTableData,
    keywordGroupsUpdater,
    defaultCountry,
    service,
    hasGroupSharingPermissions,
}) => {
    const [showKeywordGroupShareModal, setShowKeywordGroupShareModal] = useState(false);
    const [showKeywordGroupDeleteModal, setShowKeywordGroupDeleteModal] = useState(false);
    const [groupToShare, setGroupToShare] = useState(undefined);
    const [activeGroup, setActiveGroup] = useState<IKeywordGroup>(undefined);
    const [keywordGroupToEdit, setKeywordGroupToEdit] = useState<any>();
    const [isOpen, setIsOpen] = useState<boolean>();
    const currentDateForTooltip = useRef(dayjs().format("MMM YYYY"));

    const hasKeywordGroups = keywordGroups.length > 0;
    const hasSharedKeywordGroups = hasGroupSharingPermissions && sharedKeywordGroups.length > 0;

    const onGoToGeneratorToolClick = () => {
        service.swNavigator.go("findkeywords_KeywordGenerator_home");
    };

    /** method for handling of creating a new group */
    const onCreateNewListClick = () => {
        setKeywordGroupToEdit({});
        setIsOpen(true);
    };

    /** methods for handling of sharing an existing group */
    const onShareClick = (group) => () => {
        // The sharing modal component assumes all the object keys are camelCase, therefore, we camelCase the keys.
        const transformedGroupDataForSharing = service.keywordsGroupsService.adaptGroupDataForShareModal(
            group,
        );
        setGroupToShare(transformedGroupDataForSharing);
        setShowKeywordGroupShareModal(true);
    };

    const onCloseShareModal = () => {
        setShowKeywordGroupShareModal(false);
        setGroupToShare(undefined);
    };

    // callback called by the keywordService after share request is complete
    const onFinishSharing = () => {
        handleSave();
        setShowKeywordGroupShareModal(false);
        setGroupToShare(undefined);
    };

    /** method for handling of editing(edit or delete) of an existing group using the edit modal*/
    const onEditClick = (keywordGroup: IKeywordGroup) => () => {
        setKeywordGroupToEdit(keywordGroup);
        setIsOpen(true);
    };

    /** methods for handling of deleting a group using the delete modal*/
    const onDeleteClick = (keywordGroup: IKeywordGroup) => () => {
        setActiveGroup(keywordGroup);
        setShowKeywordGroupDeleteModal(true);
        trackOpenDeleteModal(
            service.trackWithGuid,
            keywordGroup?.Name,
            keywordGroup?.Keywords?.length,
        );
    };

    const onDeleteModalCloseClick = () => {
        setActiveGroup(undefined);
        setShowKeywordGroupDeleteModal(false);
    };

    const onDeleteModalCancelClick = () => {
        setActiveGroup(undefined);
        setShowKeywordGroupDeleteModal(false);
    };

    const onDeleteModalConfirmDeleteClick = async (): Promise<void> => {
        const group = service.keywordsGroupsService.findGroupById(activeGroup.Id);
        if (group) {
            const updatedGroups = await service.keywordsGroupsService.deleteGroup(group);
            keywordGroupsUpdater(
                sortGroupsByCreationDate(
                    removeUnnecessaryFieldsFromGroups(updatedGroups, ListsType.KEYWORDS),
                ),
            );
            setShowKeywordGroupDeleteModal(false);
            trackDeleteList(
                service.trackWithGuid,
                activeGroup?.Name,
                activeGroup?.Keywords?.length,
            );
        }
        setActiveGroup(undefined);
    };

    /** general method for updating the keywordGroups array after edit/delete/creation/share */
    const handleSave = () => {
        keywordGroupsUpdater(
            sortGroupsByCreationDate(
                removeUnnecessaryFieldsFromGroups(
                    service.keywordsGroupsService.userGroups,
                    ListsType.KEYWORDS,
                ),
            ),
        );
    };

    return (
        <>
            <StartPageWrapper alignItems={"center"} justifyContent={"center"}>
                <StartPageContentWrapper>
                    <KeywordGroupsSection>
                        <StartPageTitleSection
                            alignItems={"center"}
                            className={"monitor-lists-startpage--title-section"}
                        >
                            <StartPageTitle>
                                <I18n>keywordresearch.monitorkeywords.group.header</I18n>
                            </StartPageTitle>
                            <KeywordGroupCreationDropdown
                                hasKeywordsGenerator={true}
                                onGeneratorToolClick={onGoToGeneratorToolClick}
                                onKeywordsModalClick={onCreateNewListClick}
                                dropdownPopupPlacement={"ontop-right"}
                                bubbleDirection={"right"}
                                hideNotification={true}
                                appendTo={".monitor-lists-startpage--title-section"}
                            >
                                <IconButton key="button-1" iconName="add">
                                    <I18n>keywordresearch.monitorkeywords.button.create</I18n>
                                </IconButton>
                            </KeywordGroupCreationDropdown>
                        </StartPageTitleSection>
                        <ContentSection justifyContent={"space-between"}>
                            {hasKeywordGroups ? (
                                keywordGroups.map((keywordGroup) => (
                                    <KeywordGroupTable
                                        key={keywordGroup.Id}
                                        groupData={keywordGroup}
                                        isSharedList={false}
                                        onSeeGroupClick={onSeeGroupClick}
                                        fetchTableData={fetchTableData}
                                        onEdit={onEditClick}
                                        onShare={onShareClick}
                                        onDelete={onDeleteClick}
                                        tooltipDate={currentDateForTooltip.current}
                                        defaultCountry={defaultCountry}
                                        service={service}
                                        hasGroupSharingPermissions={hasGroupSharingPermissions}
                                    />
                                ))
                            ) : (
                                <NoKeywordGroupsComponent />
                            )}
                        </ContentSection>
                    </KeywordGroupsSection>

                    {hasSharedKeywordGroups && (
                        <SharedKeywordGroupsSection>
                            <StartPageTitleSection>
                                <StartPageTitle>
                                    <I18n>keywordresearch.monitorkeywords.group.shared.header</I18n>
                                </StartPageTitle>
                            </StartPageTitleSection>
                            <ContentSection justifyContent={"space-between"}>
                                {sharedKeywordGroups.map((keywordGroup) => (
                                    <KeywordGroupTable
                                        key={keywordGroup.Id}
                                        groupData={keywordGroup}
                                        isSharedList={true}
                                        onSeeGroupClick={onSeeGroupClick}
                                        fetchTableData={fetchTableData}
                                        tooltipDate={currentDateForTooltip.current}
                                        defaultCountry={defaultCountry}
                                        service={service}
                                    />
                                ))}
                            </ContentSection>
                        </SharedKeywordGroupsSection>
                    )}
                </StartPageContentWrapper>
            </StartPageWrapper>
            {showKeywordGroupShareModal && (
                <KeywordGroupsShareModal
                    isOpen={true}
                    keywordGroup={groupToShare}
                    onCloseClick={onCloseShareModal}
                    onFinish={onFinishSharing}
                    users={users}
                />
            )}
            {showKeywordGroupDeleteModal && (
                <ConfirmationTextModal
                    isOpen={true}
                    onCloseClick={onDeleteModalCloseClick}
                    onCancelClick={onDeleteModalCancelClick}
                    onApproveClick={onDeleteModalConfirmDeleteClick}
                    cancelButtonText={i18n("workspaces.grouprow.confirmaion.cancel.button")}
                    approveButtonText={i18n("workspaces.grouprow.confirmaion.ok.button")}
                    headerText={i18n("workspaces.marketing.ppc.grouprow.confirmation.header.text", {
                        name: activeGroup.Name,
                    })}
                    contentText={i18n(
                        "workspaces.marketing.ppc.grouprow.confirmation.content.text",
                    )}
                />
            )}
            <KeywordsGroupEditorModal
                onClose={() => setIsOpen(false)}
                open={isOpen}
                keywordsGroup={keywordGroupToEdit}
                onSave={handleSave}
                onDelete={handleSave}
            />
        </>
    );
};
