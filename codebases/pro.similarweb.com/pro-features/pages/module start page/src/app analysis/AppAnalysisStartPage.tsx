import { UseCaseHomepage } from "@similarweb/ui-components/dist/homepages";
import WithTranslation from "components/WithTranslation/src/WithTranslation";
import { SecondaryHomePageHeaderImageUrl } from "pages/digital-marketing/KeywordResearchKeywordGap";
import { FunctionComponent } from "react";
import * as React from "react";

export interface IAppAnalysisStartPageProps {
    listItems: any;
    searchComponent: React.ReactElement;
}

const AppAnalysisStartPage: FunctionComponent<IAppAnalysisStartPageProps> = ({
    listItems,
    searchComponent,
}) => {
    return (
        <WithTranslation>
            {(translate) => (
                <UseCaseHomepage
                    title={translate("research.apps.appanalysis.homepage.mainTitle")}
                    titlePosition="centered"
                    subtitle={translate("research.apps.appanalysis.homepage.subTitle")}
                    bodyText={translate("research.apps.appanalysis.homepage.bodyText")}
                    searchComponents={searchComponent}
                    listItems={listItems}
                    headerImageUrl={SecondaryHomePageHeaderImageUrl}
                />
            )}
        </WithTranslation>
    );
};

AppAnalysisStartPage.displayName = "AppAnalysisStartPage";
export default AppAnalysisStartPage;
