import React, { useState } from "react";
import { UseCaseHomepage } from "@similarweb/ui-components/dist/homepages";
import { AutocompleteKeywordGroups } from "components/AutocompleteKeywords/AutocompleteKeywordsGroups";
import { useTranslation } from "components/WithTranslation/src/I18n";
import HomepageKeywordGroupItem from "@similarweb/ui-components/dist/homepages/common/UseCaseHomepageItems/HomepageKeywordListItem";
import { SecondaryHomePageHeaderImageUrl } from "pages/digital-marketing/KeywordResearchKeywordGap";
import {
    KEYWORD_LEADS_PLACEHOLDER,
    KEYWORD_LEADS_SUBTITLE,
    KEYWORD_LEADS_BODY_TEXT,
    KEYWORD_LEADS_TITLE,
} from "../../../../pages/find-leads/constants/keywordLeads";
import { KeywordsLeads } from "../../../../pages/find-leads/interfaces/keywordsLeads";
import { LEAD_ROUTES } from "../../../../pages/find-leads/constants/routes";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { paramsFindListGroupKeywords } from "../../../../utils/leads";
import useGroupService from "../../../../hooks/useGroupService";
import { GroupType } from "../../types";
import { swSettings } from "common/services/swSettings";
import FindLeadsByCriteriaPageHeader from "pages/sales-intelligence/common-components/header/FindLeadsByCriteriaPageHeader/FindLeadsByCriteriaPageHeader";
import { KeywordsGroupEditorModal } from "pages/keyword-analysis/KeywordsGroupEditorModal";

export function View({ navigator }: KeywordsLeads): JSX.Element {
    const [keywordGroupToEdit, setKeywordGroupToEdit] = useState<any>();
    const [isOpen, setIsOpen] = useState<boolean>();
    const translate = useTranslation();

    const { services, replaceGroup, mergeNewGroupIntoList, keywordGroups } = useGroupService();
    const defaultParams =
        swSettings.components[
            services.swNavigator.getState(LEAD_ROUTES.KEYWORD_RESULTS_TOTAL).configId
        ].defaultParams;

    const intervalForPackageNum =
        services?.swNavigator?.swSettings?.components?.KeywordAnalysis?.resources?.SnapshotInterval
            ?.count;

    const handleClick = (keyword): void => {
        navigator.go(
            LEAD_ROUTES.KEYWORD_RESULTS_TOTAL,
            paramsFindListGroupKeywords(keyword, {
                ...defaultParams,
                duration: intervalForPackageNum
                    ? `${
                          intervalForPackageNum && intervalForPackageNum > 3
                              ? 3
                              : intervalForPackageNum
                      }m`
                    : defaultParams.duration,
            }),
        );
    };

    const handleClickBack = (): void => {
        navigator.go(LEAD_ROUTES.ROOT);
    };

    const handleSave = (modifiedOrNewGroup: GroupType): void => {
        const index = keywordGroups.findIndex((kw) => kw.Id === modifiedOrNewGroup.Id);
        // the group existed and was edited
        if (index !== -1) {
            replaceGroup(index, modifiedOrNewGroup);
        } else {
            // a new group was created
            mergeNewGroupIntoList(modifiedOrNewGroup);
        }
    };

    const handleEditClick = (item: GroupType) => () => {
        setKeywordGroupToEdit(item);
        setIsOpen(true);
    };

    const onNewKeywordGroupClick = (): void => {
        setKeywordGroupToEdit({});
        setIsOpen(true);
    };

    const listButton = [
        <IconButton key="button-1" type="outlined" iconName="add" onClick={onNewKeywordGroupClick}>
            {translate("salesintelligence.keywords.new_group")}
        </IconButton>,
    ];

    const createHomepageItems = (): JSX.Element[] => {
        return keywordGroups.map((item) => {
            return (
                <HomepageKeywordGroupItem
                    key={item.Id}
                    id={item.Id}
                    groupName={item.Name}
                    keywordCount={item.Keywords.length}
                    onItemClick={() => handleClick(item)}
                    onEditClick={handleEditClick(item)}
                />
            );
        });
    };

    return (
        <>
            <FindLeadsByCriteriaPageHeader step={0} onBackClick={handleClickBack} />
            <UseCaseHomepage
                searchComponents={
                    <AutocompleteKeywordGroups
                        onClick={handleClick}
                        autocompleteProps={{
                            placeholder: translate(KEYWORD_LEADS_PLACEHOLDER),
                        }}
                    />
                }
                titlePosition="left-aligned"
                subtitle={translate(KEYWORD_LEADS_SUBTITLE)}
                title={translate(KEYWORD_LEADS_TITLE)}
                listItems={createHomepageItems()}
                bodyText={translate(KEYWORD_LEADS_BODY_TEXT)}
                listButtons={listButton}
                headerImageUrl={SecondaryHomePageHeaderImageUrl}
            />
            <KeywordsGroupEditorModal
                onClose={() => setIsOpen(false)}
                open={isOpen}
                keywordsGroup={keywordGroupToEdit}
                onSave={handleSave}
            />
        </>
    );
}
