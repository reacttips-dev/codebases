import { SecondaryHomePageHeaderImageUrl } from "pages/digital-marketing/KeywordResearchKeywordGap";
import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { UseCaseHomepage } from "@similarweb/ui-components/dist/homepages";
import FindLeadsPageContent from "./components/FindLeadsPageContent/FindLeadsPageContent";
import { FindLeadsPageContainerProps } from "./FindLeadsPageContainer";
import * as styles from "./styles";

const FindLeadsPage: React.FC<FindLeadsPageContainerProps> = (props) => {
    const translate = useTranslation();
    const { navigator } = props;

    return (
        <styles.StyledFindLeadsPage>
            <UseCaseHomepage
                searchComponents={null}
                titlePosition="centered"
                title={translate("si.pages.find_leads.title")}
                subtitle={translate("si.pages.find_leads.subtitle")}
                headerImageUrl={SecondaryHomePageHeaderImageUrl}
                listItems={[
                    <FindLeadsPageContent key="find-leads-page-content" navigator={navigator} />,
                ]}
            />
        </styles.StyledFindLeadsPage>
    );
};

export default FindLeadsPage;
