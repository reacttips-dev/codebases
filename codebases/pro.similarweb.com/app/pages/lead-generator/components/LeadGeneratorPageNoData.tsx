import * as React from "react";
import { StatelessComponent } from "react";
import {
    LeadGeneratorBox,
    LeadGeneratorPageWrapper,
    LeadGeneratorPageLoaderTitle,
    LeadGeneratorPageLoaderSubtitle,
    LeadGeneratorPageSubtitleLink,
} from "./elements";
import { AssetsService } from "services/AssetsService";
import I18n from "../../../components/React/Filters/I18n";
import { i18nFilter } from "../../../filters/ngFilters";

interface ILeadGeneratorPageNoDataProps {
    href?: string;
    onClick?: () => void;
}

const LeadGeneratorPageNoData: StatelessComponent<ILeadGeneratorPageNoDataProps> = (props) => {
    function getSubtitleWithLink() {
        const subtitle = i18nFilter()("grow.lead_generator.page.no_data.subtitle").split("&&&");
        if (subtitle.length === 3) {
            return (
                <LeadGeneratorPageLoaderSubtitle>
                    {subtitle[0]}
                    <LeadGeneratorPageSubtitleLink {...props}>
                        {subtitle[1]}
                    </LeadGeneratorPageSubtitleLink>
                    {subtitle[2]}
                </LeadGeneratorPageLoaderSubtitle>
            );
        }
        return (
            <LeadGeneratorPageLoaderSubtitle>{subtitle.join("")}</LeadGeneratorPageLoaderSubtitle>
        );
    }

    return (
        <LeadGeneratorBox data-automation="lead-generator-on-results-box">
            <LeadGeneratorPageWrapper>
                <img src={AssetsService.assetUrl(`/images/empty.svg`)} />
                <LeadGeneratorPageLoaderTitle>
                    <I18n>grow.lead_generator.page.no_data</I18n>
                </LeadGeneratorPageLoaderTitle>
                {getSubtitleWithLink()}
            </LeadGeneratorPageWrapper>
        </LeadGeneratorBox>
    );
};

export default LeadGeneratorPageNoData;
