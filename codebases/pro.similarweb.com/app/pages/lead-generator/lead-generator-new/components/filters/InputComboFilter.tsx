import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import * as React from "react";
import { FC } from "react";
import { allTrackers } from "services/track/track";
import InputComboBox from "../../../../../../.pro-features/components/InputComboBox/src/InputComboBox";
import { InputComboBoxWrapper } from "../elements";
import { DefaultSummary } from "../summary/DefaultSummary";
import { getChipsSummaryDescription } from "./ChipsFilter";
import { IInputComboFilterProps } from "./types";
import { useTrack } from "components/WithTrack/src/useTrack";

export function getInputComboSubtitle(serverValue, title) {
    return i18nFilter()(title, { list: serverValue.join(", ") });
}

export function getInputComboSubtitleValue(serverValue) {
    return serverValue.join(", ");
}

export const InputComboSummaryFilter = ({ filter, filters }) => {
    let crrVal = "";
    let title = "";

    switch (filter.stateName) {
        case "company_zip":
            crrVal = filter.getValue();
            const companyCountryCodeFunctionality = filters.find(
                (crr) => crr.stateName === "company_country_code_functionality",
            );

            if (companyCountryCodeFunctionality) {
                const FLAG_INCLUDE = "include_only";

                title =
                    FLAG_INCLUDE === companyCountryCodeFunctionality.getValue().inclusion
                        ? i18nFilter()(
                              "grow.lead_generator.new.company.headquarters.zip-code.summary.title.include",
                          )
                        : i18nFilter()(
                              "grow.lead_generator.new.company.headquarters.zip-code.summary.title.exclude",
                          );
            }

            break;
        default:
            crrVal = filter.getValue();
            title = filter.title;
            break;
    }

    return <DefaultSummary title={title} description={getChipsSummaryDescription(crrVal)} />;
};

export function breakValueToArr(value) {
    return value.split(/,\s*/).filter((val) => !!val.trim());
}

function transformInputDefault(value) {
    return value;
}

const isErrorDefault = (newVal) => {
    const arr = breakValueToArr(newVal);
    return arr.length > 100 || !!arr.find((val) => val.length > 20);
};

export interface IChangeEvent {
    type: "add" | "remove";
    item: any;
}

export const InputComboBoxFilter: FC<IInputComboFilterProps> = ({
    filters,
    filter,
    isActive,
    setBoxActive,
    additionalChipParams,
    itemsComponent,
    transformInput = transformInputDefault,
    isError = isErrorDefault,
    onChange,
}) => {
    const [track] = useTrack();

    const onAddInput = (newVal) => {
        const newValArr = breakValueToArr(newVal);
        const allItems = [...transformInput(newValArr)].reduce(
            (all, crr) => {
                if (all.indexOf(crr) < 0) {
                    all.push(crr);
                    onChange({
                        type: "add",
                        item: crr,
                    });
                }
                return all;
            },
            [...getClientValue()],
        );
        setServerValue(allItems);

        if (filter.trackCategoryEvent) {
            track(filter.trackCategoryEvent, "add", `zipcode/${newVal}`);
        }
    };

    const OnRemoveItem = (newVal) => {
        const crrValue = getClientValue();
        setServerValue(crrValue.filter((val) => val !== newVal));
        onChange({
            type: "remove",
            item: newVal,
        });

        if (filter.trackCategoryEvent) {
            track(filter.trackCategoryEvent, "remove", `zipcode/${newVal}`);
        }
    };

    const setServerValue = (value) => {
        filter.setValue({
            [filter.stateName]: value,
        });
        setBoxActive(true);
    };

    const getClientValue = () => {
        return filter.getValue();
    };

    const crrValue = getClientValue();

    const isDisabledInputComboBoxForHQ = (filters) => {
        if (!isActive) {
            return true;
        }

        if (!filters) {
            return false;
        }

        const companyCountryCodeList = filters.find(
            (crr) => crr.stateName === "company_country_code_list",
        );
        if (!companyCountryCodeList.getValue().length) {
            if (getClientValue().length) {
                setServerValue([]);
            }
            return true;
        }

        const companyCountryCodeFunctionality = filters.find(
            (crr) => crr.stateName === "company_country_code_functionality",
        );
        const { inclusion } = companyCountryCodeFunctionality.getValue();

        if (inclusion && inclusion === "exclude_only") {
            if (getClientValue().length) {
                setServerValue([]);
            }

            return true;
        }

        return false;
    };
    return (
        <InputComboBoxWrapper
            chipsExist={crrValue.length > 0}
            data-automation={filter.dataAutomationAttrName}
        >
            <InputComboBox
                values={crrValue}
                onAddItem={onAddInput}
                OnRemoveItem={OnRemoveItem}
                placeholder={
                    filter.disabled
                        ? i18nFilter()(filter.disabledMsg)
                        : i18nFilter()(filter.placeholder)
                }
                disabled={
                    isDisabledInputComboBoxForHQ(filters) || filter.disabled || crrValue.length > 99
                }
                isError={isError}
                errorMsg={i18nFilter()(filter.errorMsg)}
                searchIcon={filter.iconName}
                itemsComponent={itemsComponent}
                searchIconTooltipText={i18nFilter()(filter.searchIconTooltipText)}
                additionalChipParams={additionalChipParams}
            />
        </InputComboBoxWrapper>
    );
};

InputComboBoxFilter.defaultProps = {
    onChange: (e: IChangeEvent) => _.noop,
};
