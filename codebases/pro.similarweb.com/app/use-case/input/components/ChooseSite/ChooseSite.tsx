import {
    ChooseMySite,
    IChooseMySiteProps,
} from "components/Workspace/Wizard/src/steps/ChooseMySite";
import noop from "lodash/noop";
import React, { FC, useCallback } from "react";

interface IChooseSite
    extends Omit<
        IChooseMySiteProps,
        | "availableCountries"
        | "onCountryChange"
        | "showCountryInput"
        | "onClearMainSite"
        | "selectedCountry"
    > {}

export const ChooseSite: FC<IChooseSite> = ({ selectedSite, onSelectMainSite, ...props }) => {
    const onClearMainSite = useCallback(() => onSelectMainSite(null), [onSelectMainSite]);
    return (
        <ChooseMySite
            {...props}
            selectedCountry={null}
            onCountryChange={noop}
            showCountryInput={false}
            availableCountries={[]}
            selectedSite={selectedSite}
            onSelectMainSite={onSelectMainSite}
            onClearMainSite={onClearMainSite}
        />
    );
};
