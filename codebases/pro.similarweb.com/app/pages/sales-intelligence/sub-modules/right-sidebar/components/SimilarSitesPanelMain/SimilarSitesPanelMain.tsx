import React from "react";
import { Textfield } from "@similarweb/ui-components/dist/textfield";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { StyledSimilarSitesPanelMain, StyledSearchSection, StyledSearchField } from "./styles";
import SimilarSitesPanelTableContainer from "../SimilarSitesPanelTable/SimilarSitesPanelTableContainer";
import SimilarSitesDropdownContainer from "../SimilarSitesDropdown/SimilarSitesDropdownContainer";
import SimilarSitesPanelTableEmpty from "../SimilarSitesPanelTableEmpty/SimilarSitesPanelTableEmpty";
import { SimilarSiteType } from "../../types/similar-sites";

type SimilarSitesPanelMainProps = {
    similarSites: SimilarSiteType[];
};

const SimilarSitesPanelMain = (props: SimilarSitesPanelMainProps) => {
    const translate = useTranslation();
    const { similarSites } = props;
    const [searchTerm, setSearchTerm] = React.useState("");

    const keepOnlyMatchingSearch = (website: SimilarSiteType) => {
        return website.domain.toLowerCase().includes(searchTerm.toLowerCase());
    };

    const renderTable = () => {
        if (similarSites.length > 0) {
            return (
                <SimilarSitesPanelTableContainer
                    websites={similarSites.filter(keepOnlyMatchingSearch)}
                />
            );
        }

        return <SimilarSitesPanelTableEmpty />;
    };

    return (
        <StyledSimilarSitesPanelMain>
            <StyledSearchSection>
                <StyledSearchField>
                    <Textfield
                        hideBorder
                        iconName="search"
                        onChange={setSearchTerm}
                        defaultValue={searchTerm}
                        disabled={similarSites.length === 0}
                        dataAutomation="si-similar-sites-search-field"
                        placeholder={translate("forms.search.placeholder")}
                    />
                </StyledSearchField>
                <SimilarSitesDropdownContainer />
            </StyledSearchSection>
            {renderTable()}
        </StyledSimilarSitesPanelMain>
    );
};

export default SimilarSitesPanelMain;
