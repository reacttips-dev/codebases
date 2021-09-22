import React from "react";
import CountryService from "services/CountryService";
import { SWReactCountryIcons } from "@similarweb/icons";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { PANEL_VISIBLE_COUNTRIES_COUNT } from "../../constants/similar-sites";
import {
    StyledSimilarSitesPanelCountries,
    StyledPrefix,
    StyledCountriesContainer,
    StyledCountry,
    StyledCountryText,
    StyledLeftSection,
    StyledMoreBlock,
} from "./styles";

type SimilarSitesPanelCountriesProps = {
    countriesIds: number[];
};

const SimilarSitesPanelCountries = (props: SimilarSitesPanelCountriesProps) => {
    const translate = useTranslation();
    const { countriesIds } = props;
    const visiblePart = countriesIds.slice(0, PANEL_VISIBLE_COUNTRIES_COUNT);
    const notVisiblePart = countriesIds.slice(PANEL_VISIBLE_COUNTRIES_COUNT);

    return (
        <StyledSimilarSitesPanelCountries>
            <StyledLeftSection>
                <StyledPrefix>{translate("si.common.in")}</StyledPrefix>
                <StyledCountriesContainer>
                    {visiblePart.map((id) => (
                        <StyledCountry key={id}>
                            <SWReactCountryIcons countryCode={id} size="xs" />
                            <StyledCountryText>
                                {CountryService.getCountryById(id)?.text}
                            </StyledCountryText>
                        </StyledCountry>
                    ))}
                </StyledCountriesContainer>
            </StyledLeftSection>
            {notVisiblePart.length > 0 && (
                <StyledMoreBlock>
                    <span>+</span>
                    <span>
                        {translate("si.sidebar.similar_sites.countries.more", {
                            numberOfCountries: notVisiblePart.length,
                        })}
                    </span>
                </StyledMoreBlock>
            )}
        </StyledSimilarSitesPanelCountries>
    );
};

export default SimilarSitesPanelCountries;
