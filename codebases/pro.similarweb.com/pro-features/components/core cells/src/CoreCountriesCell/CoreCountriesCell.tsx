import { SWReactCountryIcons } from "@similarweb/icons";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import * as React from "react";
import { CoreCountriesCellIcon, CoreCountriesCellWrapper } from "./StyledComponents";

const MAXIMUM_COUNTRY_FLAGS = 3;

export interface ICoreCountriesCell {
    countries: Array<{
        code: number;
        text: string;
    }>;
    maxCountryFlags?: number;
}

export const CoreCountriesCell: React.StatelessComponent<ICoreCountriesCell> = ({
    countries,
    maxCountryFlags,
}) => {
    if (!Array.isArray(countries)) {
        return null;
    }
    const moreItemsCount = countries.length - maxCountryFlags;
    const countriesTooltipText = countries.reduce((acc, { text }, idx) => {
        acc += `${text}${idx === countries.length - 1 ? "" : ", "}`;

        return acc;
    }, "");

    return (
        <PlainTooltip placement="top" tooltipContent={countriesTooltipText}>
            <CoreCountriesCellWrapper>
                {countries.slice(0, maxCountryFlags).map(({ code, text }, idx) => {
                    return (
                        <CoreCountriesCellIcon key={`${text}_${idx}`}>
                            <SWReactCountryIcons size="xs" countryCode={code} />
                        </CoreCountriesCellIcon>
                    );
                })}
                {moreItemsCount > 0 && <span>{`+${moreItemsCount}`}</span>}
            </CoreCountriesCellWrapper>
        </PlainTooltip>
    );
};

CoreCountriesCell.defaultProps = {
    maxCountryFlags: MAXIMUM_COUNTRY_FLAGS,
};
