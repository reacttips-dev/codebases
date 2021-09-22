import { RadioButton } from "@similarweb/ui-components/dist/radio-button";
import { i18nFilter } from "filters/ngFilters";
import React, { useEffect } from "react";
import { allTrackers } from "services/track/track";
import styled from "styled-components";
import { FunctionalFlagFilterWrapper } from "../elements";
import { IBoxFilterProps } from "./types";

export const FLAG_INCLUDE = "include_only";
export const FLAG_EXCLUDE = "exclude_only";

const OPACITY_0_4 = "0.4";
const OPACITY_1 = "1";

const FunctionalFlagFilterWrapperCustom: any = styled(FunctionalFlagFilterWrapper)`
    margin-bottom: 10px;
    > div {
        padding: 0;
    }
    > div:last-of-type {
        margin: 0;
        padding: 0;
    }
`;
const IncludeWrapper: any = styled.div<{ disabled: boolean }>`
    margin: 0;
    padding: 0;
    > div {
        padding: 9px 9px;
    }
    label {
        opacity: ${(props) => (props.disabled ? OPACITY_1 : OPACITY_0_4)};
    }
`;
const ExcludeWrapper: any = styled.div<{ disabled: boolean }>`
    margin: 0;
    > div {
        padding: 9px 9px;
    }
    label {
        opacity: ${(props) => (props.disabled ? OPACITY_1 : OPACITY_0_4)};
    }
`;

export function getFunctionalFlagBoxRadioBtnText(value) {
    let isExclude = false;
    switch (value.inclusion) {
        case FLAG_EXCLUDE: {
            isExclude = true;
            break;
        }
    }
    return isExclude;
}

export const FunctionalFlagBoxRadioBtnSummary = () => {
    return null;
};

export const FunctionalFlagBoxRadioBtnFilter = ({
    filter,
    isActive,
    setBoxActive,
    isLocked,
}: IBoxFilterProps) => {
    const setServerValueByKey = (key, value) => {
        filter.setValue({
            [filter.stateName]: {
                ...filter.getValue(),
                [key]: value,
            },
        });
    };

    useEffect(() => {
        setServerValueByKey("inclusion", FLAG_INCLUDE);
    }, []);

    const clientValue = filter.getValue();
    const locked: boolean = isLocked && isLocked();

    const setInclude = () => {
        setBoxActive(true);
        setServerValueByKey("inclusion", FLAG_INCLUDE);

        allTrackers.trackEvent("include", "click", "Company Headquarters");
    };
    const setExclude = () => {
        setBoxActive(true);
        setServerValueByKey("inclusion", FLAG_EXCLUDE);

        allTrackers.trackEvent("exclude", "click", "Company Headquarters");
    };

    return (
        <FunctionalFlagFilterWrapperCustom className={`${locked ? "isLocked" : ""}`}>
            <IncludeWrapper className="IncludeRadioButton" disabled={isActive}>
                <RadioButton
                    itemLabel={i18nFilter()(
                        "grow.lead_generator.new.general.functional_flag.radio_button.include",
                    )}
                    itemSelected={clientValue.inclusion === FLAG_INCLUDE}
                    onClick={setInclude}
                    itemDisabled={false}
                />
            </IncludeWrapper>
            <ExcludeWrapper className="ExcludeRadioButton" disabled={isActive}>
                <RadioButton
                    itemLabel={i18nFilter()(
                        "grow.lead_generator.new.general.functional_flag.radio_button.exclude",
                    )}
                    itemSelected={clientValue.inclusion === FLAG_EXCLUDE}
                    onClick={setExclude}
                    itemDisabled={false}
                />
            </ExcludeWrapper>
        </FunctionalFlagFilterWrapperCustom>
    );
};
