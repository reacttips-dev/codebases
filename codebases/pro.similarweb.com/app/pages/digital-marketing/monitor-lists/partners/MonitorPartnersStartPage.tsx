import { ECategoryType } from "common/services/categoryService.types";
import { GroupCreationDropdownItem } from "components/GroupCreationDropdown/src/GroupCreationDropdownItem";
import { ConfirmationTextModal } from "components/Modals/src/ConfirmationTextModal";
import I18n from "components/WithTranslation/src/I18n";
import { i18nFilter } from "filters/ngFilters";
import {
    getPartnerTypeLists,
    IPartnerList,
    ListsType,
    removeUnnecessaryFieldsFromGroups,
    sortGroupsByCreationDate,
    trackDeleteList,
    trackOpenDeleteModal,
} from "pages/digital-marketing/monitor-lists/utils";
import { PartnerList } from "pages/digital-marketing/monitor-lists/partners/PartnerList";
import {
    NoGroupsContainer,
    NoGroupsDescription,
    NoGroupsImage,
    NoGroupsTitle,
    StartPageContentWrapper,
    StartPageTitle,
    StartPageTitleSection,
    StartPageWrapper,
} from "pages/digital-marketing/monitor-lists/StyledComponents";
import React, { FC, useState } from "react";
import { AssetsService } from "services/AssetsService";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";
import { IconButton } from "@similarweb/ui-components/dist/button/src/IconButton";
import { Dropdown } from "@similarweb/ui-components/dist/dropdown";
import { CustomCategoriesWizard } from "components/customCategoriesWizard/CustomCategoriesWizard";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";

const i18n = i18nFilter();
const NoGroupsImageAssetUrl = "/images/empty-state/monitor-partner-lists.svg";
const NoGroupsImageAltText = "monitor partner lists";

const PartnerListsSection = styled.div``;

const ContentSection = styled(FlexRow)`
    flex-wrap: wrap;
    margin-bottom: 32px;
`;

const ToolTitle = styled.span`
    display: flex;
    align-items: center;
`;

const NoPartnerListsComponent: FC<any> = () => {
    return (
        <NoGroupsContainer>
            <NoGroupsImage>
                <img
                    src={AssetsService.assetUrl(NoGroupsImageAssetUrl)}
                    alt={NoGroupsImageAltText}
                />
            </NoGroupsImage>
            <NoGroupsTitle>
                <I18n>affiliateresearch.monitorpartners.nogroups.title</I18n>
            </NoGroupsTitle>
            <NoGroupsDescription>
                <I18n>affiliateresearch.monitorpartners.nogroups.description</I18n>
            </NoGroupsDescription>
        </NoGroupsContainer>
    );
};

interface IMonitorPartnersStartPageProps {
    partnerLists: IPartnerList[];
    onSeeGroupClick: (partnerListId: string) => () => void;
    fetchTableData: (partnerListId: string, params) => any;
    defaultCountry: number;
    partnerListsUpdater: any;
    service: any;
}

export const MonitorPartnersStartPage: FC<IMonitorPartnersStartPageProps> = ({
    partnerLists,
    onSeeGroupClick,
    fetchTableData,
    partnerListsUpdater,
    defaultCountry,
    service,
}) => {
    const [showPartnerListDeleteModal, setShowPartnerListDeleteModal] = useState(false);
    const [activeGroup, setActiveGroup] = useState<IPartnerList>(undefined);

    // custom categories wizard
    const [showCustomCategoryWizard, setShowCustomCategoryWizard] = useState(false);
    const [customCategoryId, setCustomCategoryId] = useState(null);

    const hasPartnerLists = partnerLists?.length > 0;

    const onGoToGeneratorToolClick = () => {
        service.swNavigator.go("findaffiliates_home");
    };

    // if no customCategoryId is passed in, the controller knows that we are creating a new list.
    // if however, a customCategoryId is passed in, it knows that we are "editing" (ie. editing or deleting) an existing list.
    const openPartnerListModal = (customCategoryId?: string) => {
        setShowCustomCategoryWizard(true);
        setCustomCategoryId(customCategoryId ?? null);
    };

    /** method for handling of creating a list */
    const onCreateNewListClick = () => {
        openPartnerListModal();
    };

    /** method for handling of editing an existing list */
    const onEditClick = (partnerListId) => () => {
        openPartnerListModal(partnerListId);
    };

    /** methods for handling of deleting a list  */
    const onDeleteClick = (partnerList) => () => {
        setActiveGroup(partnerList);
        setShowPartnerListDeleteModal(true);
        trackOpenDeleteModal(
            service.trackWithGuid,
            partnerList?.Name,
            partnerList?.Domains?.length,
        );
    };

    const onDeleteModalCloseClick = () => {
        setActiveGroup(undefined);
        setShowPartnerListDeleteModal(false);
    };

    const onDeleteModalCancelClick = () => {
        setActiveGroup(undefined);
        setShowPartnerListDeleteModal(false);
    };

    const onDeleteModalConfirmDeleteClick = async (): Promise<void> => {
        const updatedListArray = await UserCustomCategoryService.deleteCustomCategory({
            id: activeGroup.Id,
        });
        updatePartnersLists(updatedListArray);
        setShowPartnerListDeleteModal(false);
        setActiveGroup(undefined);
        trackDeleteList(service.trackWithGuid, activeGroup?.Name, activeGroup?.Domains?.length);
    };

    const updatePartnersLists = (newLists) => {
        partnerListsUpdater(
            sortGroupsByCreationDate(
                removeUnnecessaryFieldsFromGroups(
                    getPartnerTypeLists(newLists),
                    ListsType.PARTNERS,
                ),
            ),
        );
    };

    const CreateListFromModalMenuitem = () => (
        <GroupCreationDropdownItem
            preventDefault={true}
            onClick={onCreateNewListClick}
            iconName="add"
            description={service.translate(
                "affiliateresearch.monitorpartners.homepage.create_new_list_from_modal.description",
            )}
            title={service.translate(
                "affiliateresearch.monitorpartners.homepage.create_new_list_from_modal.title",
            )}
        />
    );

    const GoToGeneratorToolMenuitem = () => (
        <GroupCreationDropdownItem
            preventDefault={true}
            onClick={onGoToGeneratorToolClick}
            iconName="wand"
            description={service.translate(
                "affiliateresearch.monitorpartners.homepage.create_new_list_from_affiliate_homepage.description",
            )}
            title={
                <ToolTitle>
                    {service.translate(
                        "affiliateresearch.monitorpartners.homepage.create_new_list_from_affiliate_homepage.title",
                    )}
                </ToolTitle>
            }
        />
    );

    return (
        <>
            <StartPageWrapper alignItems={"center"} justifyContent={"center"}>
                <StartPageContentWrapper>
                    <PartnerListsSection>
                        <StartPageTitleSection
                            alignItems={"center"}
                            className={"monitor-lists-startpage--title-section"}
                        >
                            <StartPageTitle>
                                <I18n>affiliateresearch.monitorpartners.partnerLists.header</I18n>
                            </StartPageTitle>
                            <Dropdown
                                width={328}
                                appendTo={".monitor-lists-startpage--title-section"}
                                onToggle={() => null}
                                cssClassContainer={`DropdownContent-container Popup-content--pro-dropdown`}
                                dropdownPopupPlacement={"ontop-right"}
                                buttonWidth={"auto"}
                            >
                                <IconButton key="button-1" iconName="add">
                                    <I18n>affiliateresearch.monitorpartners.button.create</I18n>
                                </IconButton>
                                <CreateListFromModalMenuitem />
                                <GoToGeneratorToolMenuitem />
                            </Dropdown>
                        </StartPageTitleSection>
                        <ContentSection justifyContent={"space-between"}>
                            {hasPartnerLists ? (
                                partnerLists.map((partnerList) => (
                                    <PartnerList
                                        key={partnerList.Id}
                                        groupData={partnerList}
                                        onSeeGroupClick={onSeeGroupClick}
                                        fetchTableData={fetchTableData}
                                        onEdit={onEditClick}
                                        onDelete={onDeleteClick}
                                        defaultCountry={defaultCountry}
                                        service={service}
                                    />
                                ))
                            ) : (
                                <NoPartnerListsComponent />
                            )}
                        </ContentSection>
                    </PartnerListsSection>
                </StartPageContentWrapper>
            </StartPageWrapper>
            {showPartnerListDeleteModal && (
                <ConfirmationTextModal
                    isOpen={true}
                    onCloseClick={onDeleteModalCloseClick}
                    onCancelClick={onDeleteModalCancelClick}
                    onApproveClick={onDeleteModalConfirmDeleteClick}
                    cancelButtonText={i18n("workspaces.grouprow.confirmaion.cancel.button")}
                    approveButtonText={i18n("workspaces.grouprow.confirmaion.ok.button")}
                    headerText={i18n(
                        "affiliateresearch.monitorpartners.homepage.modal.delete.header.text",
                        {
                            name: activeGroup.Name,
                        },
                    )}
                    contentText={i18n(
                        "affiliateresearch.monitorpartners.homepage.modal.delete.content.text",
                    )}
                />
            )}
            <CustomCategoriesWizard
                isOpen={showCustomCategoryWizard}
                onClose={() => {
                    setShowCustomCategoryWizard(false);
                }}
                wizardProps={{
                    stayOnPage: true,
                    namePlaceholder:
                        "workspaces.marketing.customcategories.wizard.name.placeholder",
                    editorTitle: "workspaces.marketing.customcategories.wizard.editor.title",
                    placeholder:
                        "workspaces.marketing.customcategories.wizard.editor.placeholder.bold",
                    isCategoryTypeDisabled: true,
                    initialCategoryType: ECategoryType.PARTNERS_LIST,
                    reloadOnDelete: false,
                    showDeleteButton: false,
                    customCategoryId: customCategoryId || null,
                    onSave: async (modal, data) => {
                        updatePartnersLists(data);
                        setShowCustomCategoryWizard(false);
                        setCustomCategoryId(null);
                    },
                    onDelete: async (modal, data) => {
                        updatePartnersLists(data);
                        setShowCustomCategoryWizard(false);
                        setCustomCategoryId(null);
                    },
                }}
            />
        </>
    );
};
