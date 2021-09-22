import React from "react";
import styled from "styled-components";
import { colorsPalettes, mixins, rgba } from "@similarweb/styles";
import { Button } from "@similarweb/ui-components/dist/button";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import { Autocomplete } from "@similarweb/ui-components/dist/autocomplete";
import { ListItemWebsite } from "@similarweb/ui-components/dist/list-item";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { getWebsiteResults } from "services/solutions2Services/HomepageDataFetchers/NewModulesHomepageDataFetcher";
import {
    StyledAutocompleteContainer,
    StyledDropdownsContainer,
    StyledFindCompetitorsFooter,
    StyledFindCompetitorsInner,
    StyledFindCompetitorsSection,
    StyledFindCompetitorsSectionRelativeContainer,
    StyledTrafficDropdownContainer,
} from "./styles";
import { TrafficType } from "pages/sales-intelligence/sub-modules/competitor-customers/types";
import TrafficTypeDropdown from "../../../../common-components/dropdown/TrafficTypeDropdown/TrafficTypeDropdown";
import trafficTypes from "./traffic-types";

type FindCompetitorsSearchSectionProps = {
    onSubmit(domain: string, trafficType: string): void;
};

const PlaceholderText = styled.span`
    ${mixins.setFont({ $color: rgba(colorsPalettes.carbon["500"], 0.4), $size: 14 })};
    margin-left: 32px;
`;

const FindCompetitorsSearchSection = (props: FindCompetitorsSearchSectionProps) => {
    const { onSubmit } = props;
    const translate = useTranslation();
    const [selectedDomain, setSelectedDomain] = React.useState("");
    const [footerVisible, setFooterVisible] = React.useState(false);
    const [isAutocompleteLoading, setAutocompleteLoading] = React.useState(false);
    const [selectedTrafficType, setSelectedTrafficType] = React.useState<TrafficType>("outgoing");
    const placeholder = React.useMemo(() => {
        return (
            <PlaceholderText>
                {translate("si.pages.find_competitors.search.placeholder")}
            </PlaceholderText>
        );
    }, []);
    const loader = React.useMemo(() => {
        return <DotsLoader />;
    }, []);

    const handleSeeResultsClick = () => {
        onSubmit(selectedDomain, selectedTrafficType);
    };

    const onAutocompleteGetData = async (query: string) => {
        if (query === "") {
            return [];
        } else {
            setAutocompleteLoading(true);

            const results = await getWebsiteResults(query);

            setAutocompleteLoading(false);

            return results.map((item) => {
                return (
                    <ListItemWebsite
                        img={item.image}
                        text={item.name}
                        key={`website.${item.name}`}
                        onClick={() => setSelectedDomain(item.name)}
                    />
                );
            });
        }
    };

    React.useEffect(() => {
        if (selectedDomain.trim().length > 0) {
            setFooterVisible(true);
        } else {
            setFooterVisible(false);
        }
    }, [selectedDomain]);

    return (
        <StyledFindCompetitorsSectionRelativeContainer>
            <StyledFindCompetitorsSection>
                <StyledFindCompetitorsInner>
                    <StyledDropdownsContainer>
                        <StyledAutocompleteContainer>
                            <Autocomplete
                                floating
                                debounce={250}
                                maxResults={8}
                                placeholder={placeholder}
                                loadingComponent={loader}
                                selectedValue={selectedDomain}
                                isLoading={isAutocompleteLoading}
                                getListItems={onAutocompleteGetData}
                            />
                        </StyledAutocompleteContainer>
                        <StyledTrafficDropdownContainer>
                            <TrafficTypeDropdown
                                trafficTypes={trafficTypes}
                                selected={selectedTrafficType}
                                onSelect={setSelectedTrafficType}
                            />
                        </StyledTrafficDropdownContainer>
                    </StyledDropdownsContainer>
                </StyledFindCompetitorsInner>
                {footerVisible && (
                    <StyledFindCompetitorsFooter>
                        <Button
                            type="flat"
                            onClick={handleSeeResultsClick}
                            dataAutomation="si-find-competitors-see-results-button"
                        >
                            {translate("si.pages.find_competitors.search.submit_button")}
                        </Button>
                    </StyledFindCompetitorsFooter>
                )}
            </StyledFindCompetitorsSection>
        </StyledFindCompetitorsSectionRelativeContainer>
    );
};

export default FindCompetitorsSearchSection;
