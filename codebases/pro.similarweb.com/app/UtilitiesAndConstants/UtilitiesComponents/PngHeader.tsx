import { SOURCES_TEXT } from "components/widget/widget-types/Widget";
import CountryService, { ICountryObject } from "services/CountryService";
import {
    PngHeaderContainer,
    PngHeaderContentContainer,
    Text,
} from "pages/website-analysis/TrafficAndEngagement/Components/StyledComponents";
import * as React from "react";
import { colorsPalettes } from "@similarweb/styles";

export const PngHeader = ({ metricTitle, durations, webSource, country }) => {
    const textColor = colorsPalettes.carbon[500];
    const webSourceDisplayName = SOURCES_TEXT.websites[webSource];
    const countryObject: ICountryObject = CountryService.getCountryById(country);
    return (
        <PngHeaderContainer>
            <PngHeaderContentContainer>
                <Text color={textColor} size={28} opacity={0.8}>
                    {metricTitle}
                </Text>
                <Text
                    color={textColor}
                    size={16}
                    opacity={0.8}
                >{`${durations} | ${countryObject.text} | ${webSourceDisplayName}`}</Text>
            </PngHeaderContentContainer>
        </PngHeaderContainer>
    );
};
