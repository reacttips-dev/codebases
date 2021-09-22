import { SubTitleAlignment } from "@similarweb/ui-components/dist/homepages/common/ICommonHomepageProps";
import { UseCaseHomepage } from "@similarweb/ui-components/dist/homepages";
import WithTranslation from "components/WithTranslation/src/WithTranslation";
import { SecondaryHomePageHeaderImageUrl } from "pages/digital-marketing/KeywordResearchKeywordGap";
import { FunctionComponent } from "react";
import * as React from "react";

export interface IAppCategoriesStartPageProps {
    subtitlePosition?: string;
    title: string;
    subtitle: string;
    bodyText?: string;
    listItems: any;
    searchComponent: React.ReactElement;
}

const AppCategoriesStartPage: FunctionComponent<IAppCategoriesStartPageProps> = ({
    title,
    subtitle,
    bodyText,
    subtitlePosition,
    listItems,
    searchComponent,
}) => {
    return (
        <WithTranslation>
            {(translate) => (
                <UseCaseHomepage
                    title={translate(title)}
                    titlePosition={subtitlePosition as SubTitleAlignment}
                    subtitle={translate(subtitle)}
                    bodyText={translate(bodyText)}
                    searchComponents={searchComponent}
                    listItems={listItems}
                    headerImageUrl={SecondaryHomePageHeaderImageUrl}
                />
            )}
        </WithTranslation>
    );
};

AppCategoriesStartPage.displayName = "AppCategoriesStartPage";
export default AppCategoriesStartPage;
