import { SubTitleAlignment } from "@similarweb/ui-components/dist/homepages/common/ICommonHomepageProps";
import UseCaseHomePage from "@similarweb/ui-components/dist/homepages/use-case/src/UseCaseHomepage";
import { AutocompleteKeywordGroups } from "components/AutocompleteKeywords/AutocompleteKeywordsGroups";
import WithTranslation from "components/WithTranslation/src/WithTranslation";
import { SecondaryHomePageHeaderImageUrl } from "pages/digital-marketing/KeywordResearchKeywordGap";
import React, { FunctionComponent, ReactNode } from "react";

interface IIndustryAnalysisStartPageProps {
    title: ReactNode;
    subtitle: ReactNode;
    bodyText: ReactNode;
    subtitlePosition: string;
    listButtons: React.ReactElement[];
    listItems: React.ReactElement[];
    handleItemClick: (item: any) => VoidFunction;
    autocompletePlaceholder: string | React.ReactElement;
}

export const KeywordAnalysisStartPage: FunctionComponent<IIndustryAnalysisStartPageProps> = ({
    title,
    subtitle,
    bodyText,
    subtitlePosition,
    listButtons,
    listItems,
    handleItemClick,
    autocompletePlaceholder,
}) => {
    return (
        <WithTranslation>
            {(translate) => (
                <UseCaseHomePage
                    title={translate(title)}
                    titlePosition={subtitlePosition as SubTitleAlignment}
                    subtitle={translate(subtitle)}
                    bodyText={bodyText}
                    headerImageUrl={SecondaryHomePageHeaderImageUrl}
                    searchComponents={
                        <AutocompleteKeywordGroups
                            onClick={(item) => handleItemClick(item)()}
                            autocompleteProps={{
                                placeholder: autocompletePlaceholder,
                            }}
                        />
                    }
                    listButtons={listButtons}
                    listItems={listItems}
                />
            )}
        </WithTranslation>
    );
};
