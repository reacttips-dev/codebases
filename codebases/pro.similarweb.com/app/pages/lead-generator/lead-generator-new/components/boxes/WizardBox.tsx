import React from "react";
import I18n from "../../../../../components/React/Filters/I18n";
import { createFilterBoxes } from "./FiltersBox";
import { WizardBoxSubtitle, WizardBoxTitle, WizardBoxContent } from "../elements";
import { ICategoriesResponse } from "pages/lead-generator/lead-generator-new/components/filters/TechnographicsBoxFilter";

export interface IWizardBoxProps {
    dataAutomation: string;
    title: string;
    subtitle: string;
    filters: any[]; // TODO: proper type
    isActive: boolean;
    setActive: (boolean) => void;
    technologies: ICategoriesResponse;
}

const WizardBox: React.FC<IWizardBoxProps> = (props) => {
    const { dataAutomation, title, subtitle, filters, isActive, setActive, technologies } = props;

    return (
        <div>
            <WizardBoxTitle>
                <I18n>{title}</I18n>
            </WizardBoxTitle>
            <WizardBoxSubtitle>
                <I18n>{subtitle}</I18n>
            </WizardBoxSubtitle>
            <WizardBoxContent data-automation={dataAutomation}>
                {createFilterBoxes(filters, isActive, setActive, undefined, technologies)}
            </WizardBoxContent>
        </div>
    );
};

export default WizardBox;
