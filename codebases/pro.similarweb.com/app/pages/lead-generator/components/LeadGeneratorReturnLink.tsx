import * as React from "react";
import { StatelessComponent } from "react";
import { LeadGeneratorReturnLinkWrapper } from "./elements";
import { SWReactIcons } from "@similarweb/icons";
import I18n from "../../../components/React/Filters/I18n";

interface ILeadGeneratorReturnLinkProps {
    text: string;
    link: string;
}

const LeadGeneratorReturnLink: StatelessComponent<ILeadGeneratorReturnLinkProps> = ({
    text,
    link,
}) => {
    return (
        <LeadGeneratorReturnLinkWrapper href={link}>
            <SWReactIcons iconName="arrow-left" />
            <I18n>{text}</I18n>
        </LeadGeneratorReturnLinkWrapper>
    );
};

export default LeadGeneratorReturnLink;
