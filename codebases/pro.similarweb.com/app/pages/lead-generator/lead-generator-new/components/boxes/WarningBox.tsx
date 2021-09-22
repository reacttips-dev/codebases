import * as React from "react";
import { SWReactIcons } from "@similarweb/icons";
import { CountriesBoxWarningContent, CountriesBoxWarningText } from "../elements";
import { IDesktopOnlyBoxProps } from "./DesktopOnlyBox";
import { createFilterBoxes } from "./FiltersBox";
import StyledFiltersBox from "../FiltersBox/StyledFiltersBox";
import { useTranslation } from "components/WithTranslation/src/I18n";
import {
    isCountriesFilter,
    isDesktopDevice,
} from "pages/lead-generator/lead-generator-new/helpers";

interface IWarningBoxProps extends IDesktopOnlyBoxProps {
    groupingWarningText?: string;
    groupingWarning?: boolean;
    groupingDesktopOnly?: boolean;
    id: string;
}

const WarningBox: React.FC<IWarningBoxProps> = (props) => {
    const {
        filters,
        isActive,
        setActive,
        device,
        groupingWarningText,
        groupingWarning,
        groupingDesktopOnly,
        technologies,
    } = props;
    const translate = useTranslation();
    const countriesFilter = filters.find(isCountriesFilter);
    const countriesLen = countriesFilter?.getValue().length ?? 0;
    const showDesktopOnlyWarning =
        groupingDesktopOnly && isDesktopDevice(device) && countriesLen >= 1;
    const showGroupingWarning = groupingWarning && countriesLen > 1;

    function getWarningText(): string {
        if (showDesktopOnlyWarning && showGroupingWarning) {
            return translate("grow.lead_generator.wizard.desktop_countries_warning.query.grouping");
        }

        if (showDesktopOnlyWarning) {
            return translate("grow.lead_generator.wizard.desktop_countries_warning.query");
        }

        return translate(groupingWarningText);
    }

    return (
        <StyledFiltersBox {...props}>
            {createFilterBoxes(filters, isActive, setActive, undefined, technologies)}
            <CountriesBoxWarningContent
                data-automation="lead-generator-report-box"
                visible={showDesktopOnlyWarning || showGroupingWarning}
            >
                <SWReactIcons iconName="warning" size="sm" />
                <CountriesBoxWarningText
                    dangerouslySetInnerHTML={{
                        __html: getWarningText(),
                    }}
                />
            </CountriesBoxWarningContent>
        </StyledFiltersBox>
    );
};

export default WarningBox;
