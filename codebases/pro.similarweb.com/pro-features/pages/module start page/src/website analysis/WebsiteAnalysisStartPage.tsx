import UseCaseHomepage from "@similarweb/ui-components/dist/homepages/use-case/src/UseCaseHomepage";
import WithTranslation from "components/WithTranslation/src/WithTranslation";
import { SecondaryHomePageHeaderImageUrl } from "pages/digital-marketing/KeywordResearchKeywordGap";
import React, { FunctionComponent } from "react";
import { Autocomplete } from "@similarweb/ui-components/dist/autocomplete";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";

interface IWebsiteAnalysisStartPageProps {
    listButtons?: React.ReactElement[];
    listItems: React.ReactElement[];
    autocompleteProps: any;
}

export const WebsiteAnalysisStartPage: FunctionComponent<IWebsiteAnalysisStartPageProps> = ({
    listButtons,
    listItems,
    autocompleteProps,
}) => {
    return (
        <WithTranslation>
            {(translate) => (
                <UseCaseHomepage
                    title={translate("websiteanalysis.homepage.mainTitle")}
                    subtitle={translate("websiteanalysis.homepage.subTitle")}
                    titlePosition={"centered"}
                    headerImageUrl={SecondaryHomePageHeaderImageUrl}
                    searchComponents={
                        <Autocomplete
                            loadingComponent={<DotsLoader />}
                            floating={true}
                            debounce={250}
                            maxResults={8}
                            {...autocompleteProps}
                        />
                    }
                    bodyText={translate("websiteanalysis.homepage.bodyText")}
                    listItems={listItems}
                />
            )}
        </WithTranslation>
    );
};
