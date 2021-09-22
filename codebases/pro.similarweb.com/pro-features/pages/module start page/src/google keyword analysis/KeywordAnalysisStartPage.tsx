import { UseCaseHomepage } from "@similarweb/ui-components/dist/homepages";
import WithTranslation from "components/WithTranslation/src/WithTranslation";
import { SecondaryHomePageHeaderImageUrl } from "pages/digital-marketing/KeywordResearchKeywordGap";
import { FunctionComponent } from "react";
import * as React from "react";

export interface IGoogleKeywordAnalysisStartPageProps {
    listItems: any;
    searchComponent: React.ReactElement;
}

const GoogleKeywordAnalysisStartPage: FunctionComponent<IGoogleKeywordAnalysisStartPageProps> = ({
    listItems,
    searchComponent,
}) => {
    return (
        <WithTranslation>
            {(translate) => (
                <UseCaseHomepage
                    title={translate("research.apps.googleplaykw.homepage.mainTitle")}
                    titlePosition="centered"
                    subtitle={translate("research.apps.googleplaykw.homepage.subtitle")}
                    bodyText={translate("research.apps.googleplaykw.homepage.listTitle")}
                    searchComponents={searchComponent}
                    listItems={listItems}
                    headerImageUrl={SecondaryHomePageHeaderImageUrl}
                />
            )}
        </WithTranslation>
    );
};

GoogleKeywordAnalysisStartPage.displayName = "GoogleKeywordAnalysisStartPage";
export default GoogleKeywordAnalysisStartPage;
