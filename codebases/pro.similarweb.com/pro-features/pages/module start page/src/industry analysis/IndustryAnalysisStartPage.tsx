import UseCaseHomepage from "@similarweb/ui-components/dist/homepages/use-case/src/UseCaseHomepage";
import { AutocompleteWebCategories } from "components/AutocompleteWebCategories/AutocompleteWebCategories";
import WithTranslation from "components/WithTranslation/src/WithTranslation";
import { SecondaryHomePageHeaderImageUrl } from "pages/digital-marketing/KeywordResearchKeywordGap";
import React, { FunctionComponent } from "react";
import { SubTitleAlignment } from "@similarweb/ui-components/dist/homepages/common/ICommonHomepageProps";

interface IIndustryAnalysisStartPageProps {
    title: string;
    subtitle: string;
    bodyText: string;
    subtitlePosition: string;
    listButtons: React.ReactElement[];
    listItems: React.ReactElement[];
    handleItemClick: (item: any) => VoidFunction;
    autocompletePlaceholder: string | React.ReactElement;
}

export const IndustryAnalysisStartPage: FunctionComponent<IIndustryAnalysisStartPageProps> = ({
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
                <UseCaseHomepage
                    title={translate(title)}
                    titlePosition={subtitlePosition as SubTitleAlignment}
                    subtitle={translate(subtitle)}
                    bodyText={translate(bodyText)}
                    headerImageUrl={SecondaryHomePageHeaderImageUrl}
                    searchComponents={
                        <AutocompleteWebCategories
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
