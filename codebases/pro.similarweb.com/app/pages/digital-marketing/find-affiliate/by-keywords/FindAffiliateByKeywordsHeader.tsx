import React, { FunctionComponent, useState } from "react";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import {
    ItemContainer,
    KeywordContainer,
    ButtonContainer,
} from "components/compare/KeywordsQueryBar/KeywordsQueryBarStyles";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { Injector } from "common/ioc/Injector";
import { KWOPPORTUNITIES } from "./localStorageKey";
import useLocalStorage from "custom-hooks/useLocalStorage";
import { IKeywordGroup } from "userdata";
import { KeywordsQueryBar } from "components/compare/KeywordsQueryBar/KeywordsQueryBar";
import { adaptKeywordsQueryBarProps } from "components/compare/KeywordsQueryBar/KeywordsQueryBarHelper";
import { SwNavigator } from "common/services/swNavigator";
import { KeywordsGroupEditorModal } from "pages/keyword-analysis/KeywordsGroupEditorModal";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

interface IFindAffiliateByKeywordsHeaderProps {
    keyword: string;
}

const FindAffiliateByKeywordsHeader: FunctionComponent<IFindAffiliateByKeywordsHeaderProps> = ({
    keyword,
}) => {
    const [kwGroupRaw, setOpportunitiesKeywords] = useLocalStorage(KWOPPORTUNITIES, null, [
        keyword,
    ]);
    const [keywordGroupToEdit, setKeywordGroupToEdit] = useState<any>();
    const [isOpen, setIsOpen] = useState<boolean>();

    const kwGroupFromLocalStorage: IKeywordGroup = JSON.parse(kwGroupRaw);
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const isKeywordGroup = keyword.startsWith("*");
    const keywordGroupIdFromUrl = keyword.slice(1);
    const getGroupFromId = (groupId) => {
        const userGroups = keywordsGroupsService.userGroups;
        const sharedGroups = keywordsGroupsService
            .getSharedGroups()
            .map((group) => ({ ...group, sharedWithUsers: "yes" }));
        return [...userGroups, ...sharedGroups].find(({ Id }) => Id === groupId);
    };
    const getKeywordGroup = (): IKeywordGroup => {
        if (isKeywordGroup) {
            if (kwGroupFromLocalStorage && kwGroupFromLocalStorage.Id === keywordGroupIdFromUrl) {
                return kwGroupFromLocalStorage;
            }
            const foundUserGroup = getGroupFromId(keywordGroupIdFromUrl);
            if (foundUserGroup?.Id) {
                return foundUserGroup;
            } else {
                return null;
            }
        } else {
            return null;
        }
    };
    const keywordGroup = getKeywordGroup();
    const onGroupSave = (modifiedGroup) => {
        setOpportunitiesKeywords(JSON.stringify(modifiedGroup));
        swNavigator.go(swNavigator.current(), {
            keyword: `*${modifiedGroup.Id}`,
        });
    };
    const onGroupDelete = () => {
        swNavigator.go(swNavigator.current().homeState);
    };
    const EditGroupButton = (
        <PlainTooltip placement={"bottom"} tooltipContent={"Edit Keyword Group"}>
            <ButtonContainer>
                <IconButton
                    type="flat"
                    iconName="edit-group"
                    onClick={() => {
                        setIsOpen(true);
                        setKeywordGroupToEdit({
                            Id: keywordGroup.UserId ? keywordGroup.Id : null,
                            Keywords: keywordGroup.Keywords,
                            Name: keywordGroup.Name,
                        });
                    }}
                />
            </ButtonContainer>
        </PlainTooltip>
    );
    const userGroups = keywordsGroupsService.groupsToDropDown().map((item) => {
        return {
            ...item,
            shareable: true,
            editable: true,
            deletable: true,
        };
    });

    if (keywordGroup) {
        userGroups.unshift({
            domains: keywordGroup.Keywords,
            icon: "sw-icon-folder",
            id: keywordGroup.Id,
            shared: false,
            sharedWithAccounts: [],
            sharedWithUsers: [],
            text: keywordGroup.Name,
            shareable: false,
            editable: true,
            deletable: false,
        });
    }
    const customCategories = [
        userGroups,
        keywordsGroupsService.sharedGroupsToDropDown().map((item) => {
            return {
                ...item,
                shareable: false,
                editable: false,
                deletable: false,
            };
        }),
    ];
    const queryBarProps = adaptKeywordsQueryBarProps({
        customCategories,
        selectedCat: keywordGroup?.Id,
        isKeywordMode: !keywordGroup,
        searchTerm: keyword,
        isLoading: !keywordGroup,
    });
    const onSearchItemClick = (item) => {
        swNavigator.go(swNavigator.current(), {
            keyword: item.Id ? `*${item.Id}` : item.name,
        });
    };
    return (
        <>
            <ItemContainer>
                <KeywordContainer>
                    <KeywordsQueryBar
                        {...{
                            ...queryBarProps,
                            showButtons: false,
                            onSearchItemClick,
                        }}
                    />
                    {isKeywordGroup && !keywordGroup?.sharedWithUsers && EditGroupButton}
                </KeywordContainer>
            </ItemContainer>
            <KeywordsGroupEditorModal
                onClose={() => setIsOpen(false)}
                open={isOpen}
                keywordsGroup={keywordGroupToEdit}
                onSave={onGroupSave}
                onDelete={onGroupDelete}
            />
        </>
    );
};

SWReactRootComponent(FindAffiliateByKeywordsHeader, "FindAffiliateByKeywordsHeader");
export default FindAffiliateByKeywordsHeader;
