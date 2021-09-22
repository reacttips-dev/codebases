import * as React from "react";
import { StatelessComponent } from "react";
import {
    LeadGeneratorPageWrapper,
    LeadGeneratorErrorIcon,
    LeadGeneratorPageErrorTitle,
    LeadGeneratorPageErrorSubtitle,
    LeadGeneratorPageSubtitleLink,
} from "./elements";
import I18n from "../../../components/React/Filters/I18n";
import { i18nFilter } from "filters/ngFilters";

interface ILeadGeneratorPageErrorProps {
    onClickRefresh: () => void;
}

const LeadGeneratorPageError: StatelessComponent<ILeadGeneratorPageErrorProps> = ({
    onClickRefresh,
}) => {
    function getSubtitleWithLink() {
        const subtitle = i18nFilter()("grow.lead_generator.page.error.subtitle").split("&&&");
        if (subtitle.length === 3) {
            return (
                <LeadGeneratorPageErrorSubtitle>
                    {subtitle[0]}
                    <LeadGeneratorPageSubtitleLink onClick={onClickRefresh}>
                        {subtitle[1]}
                    </LeadGeneratorPageSubtitleLink>
                    {subtitle[2]}
                </LeadGeneratorPageErrorSubtitle>
            );
        }
        return <LeadGeneratorPageErrorSubtitle>{subtitle.join("")}</LeadGeneratorPageErrorSubtitle>;
    }

    return (
        <LeadGeneratorPageWrapper>
            <LeadGeneratorErrorIcon />
            <LeadGeneratorPageErrorTitle>
                <I18n>grow.lead_generator.page.error.title</I18n>
            </LeadGeneratorPageErrorTitle>
            {getSubtitleWithLink()}
        </LeadGeneratorPageWrapper>
    );
};

export default LeadGeneratorPageError;
