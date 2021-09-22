import {
    Dropdown,
    DropdownButton,
    EllipsisDropdownItem,
} from "@similarweb/ui-components/dist/dropdown";
import { RadioButton } from "@similarweb/ui-components/dist/radio-button";
import LocationService from "components/Modals/src/UnlockModal/LocationService";
import { StyledLeadGeneratorLockIcon } from "pages/lead-generator/components/elements";
import * as React from "react";
import { openUnlockModal } from "services/ModalService";
import { allTrackers } from "services/track/track";
import I18n from "../../../../../components/React/Filters/I18n";
import { i18nFilter } from "../../../../../filters/ngFilters";
import { FunctionalFlagFilterWrapper, StyledLeadGeneratorFilterLock } from "../elements";
import { DefaultSummary } from "../summary/DefaultSummary";
import { Expand } from "./TechnographicsBoxFilter";
import { IBoxFilterProps } from "./types";

export const FUNCTIONAL_FLAG_INCLUDE = "include_only";
export const FUNCTIONAL_FLAG_EXCLUDE = "exclude_only";
export const FUNCTIONAL_FLAG_ALL = "all";
export const FUNCTIONAL_FLAG_TRANSACTIONAL = "transactional";
export const FUNCTIONAL_FLAG_CONTENT = "content";

const dropdownButtonTexts = {
    [FUNCTIONAL_FLAG_ALL]: "grow.lead_generator.new.general.functional_flag.dropdown.all",
    [FUNCTIONAL_FLAG_TRANSACTIONAL]:
        "grow.lead_generator.new.general.functional_flag.dropdown.transactional",
    [FUNCTIONAL_FLAG_CONTENT]: "grow.lead_generator.new.general.functional_flag.dropdown.content",
};

const dropdownButtonTooltips = {
    [FUNCTIONAL_FLAG_ALL]: "grow.lead_generator.new.general.functional_flag.dropdown.all.tooltip",
    [FUNCTIONAL_FLAG_TRANSACTIONAL]:
        "grow.lead_generator.new.general.functional_flag.dropdown.transactional.tooltip",
    [FUNCTIONAL_FLAG_CONTENT]:
        "grow.lead_generator.new.general.functional_flag.dropdown.content.tooltip",
};

export function getFunctionalFlagText(value) {
    let description = "";
    switch (value.inclusion) {
        case FUNCTIONAL_FLAG_INCLUDE: {
            if (value.type === FUNCTIONAL_FLAG_TRANSACTIONAL) {
                description =
                    "grow.lead_generator.new.general.functional_flag.summary.include.transactional";
            } else if (value.type === FUNCTIONAL_FLAG_CONTENT) {
                description =
                    "grow.lead_generator.new.general.functional_flag.summary.include.content";
            }
            break;
        }
        case FUNCTIONAL_FLAG_EXCLUDE: {
            if (value.type === FUNCTIONAL_FLAG_TRANSACTIONAL) {
                description =
                    "grow.lead_generator.new.general.functional_flag.summary.exclude.transactional";
            } else if (value.type === FUNCTIONAL_FLAG_CONTENT) {
                description =
                    "grow.lead_generator.new.general.functional_flag.summary.exclude.content";
            }
            break;
        }
    }
    return description;
}

export function getFunctionalFlagSubtitle(serverValue) {
    return i18nFilter()(getFunctionalFlagText(serverValue));
}

export const FunctionalFlagSummary = ({ filter, isLocked }: IBoxFilterProps) => {
    const description = isLocked?.() ? "" : getFunctionalFlagText(filter.getValue());

    return <DefaultSummary title="" description={description} />;
};

export const FunctionalFlagBoxFilter = ({ filter, isLocked, trialHookName }: IBoxFilterProps) => {
    const setServerValueByKey = (key, value) => {
        const clientValue = filter.getValue();

        filter.setValue({
            [filter.stateName]: {
                ...filter.getValue(),
                [key]: value,
            },
        });

        switch (clientValue.inclusion) {
            case FUNCTIONAL_FLAG_INCLUDE: {
                allTrackers.trackEvent(
                    "Drop down",
                    "click",
                    `Website category functionality/include/${value}`,
                );
                break;
            }
            case FUNCTIONAL_FLAG_EXCLUDE: {
                allTrackers.trackEvent(
                    "Drop down",
                    "click",
                    `Website category functionality/exclude/${value}`,
                );
                break;
            }
        }
    };

    const setServerValue = (newValue) => {
        filter.setValue({
            [filter.stateName]: newValue,
        });
    };

    const clientValue = filter.getValue();

    const dropDownProps = {
        onClick: (item) => setServerValueByKey("type", item.id),
        dropdownPopupMinScrollHeight: 48,
        dropdownPopupHeight: 432,
        cssClassContainer: "DropdownContent-container Popup-content--pro-dropdown",
    };

    const dropDownItems = [
        <EllipsisDropdownItem
            id={FUNCTIONAL_FLAG_ALL}
            key={FUNCTIONAL_FLAG_ALL}
            tooltipText={i18nFilter()(dropdownButtonTooltips[FUNCTIONAL_FLAG_ALL])}
            disabled={clientValue.inclusion === FUNCTIONAL_FLAG_EXCLUDE}
        >
            <I18n>{dropdownButtonTexts[FUNCTIONAL_FLAG_ALL]}</I18n>
        </EllipsisDropdownItem>,
        <EllipsisDropdownItem
            id={FUNCTIONAL_FLAG_TRANSACTIONAL}
            key={FUNCTIONAL_FLAG_TRANSACTIONAL}
            tooltipText={i18nFilter()(dropdownButtonTooltips[FUNCTIONAL_FLAG_TRANSACTIONAL])}
        >
            <I18n>{dropdownButtonTexts[FUNCTIONAL_FLAG_TRANSACTIONAL]}</I18n>
        </EllipsisDropdownItem>,
        <EllipsisDropdownItem
            id={FUNCTIONAL_FLAG_CONTENT}
            key={FUNCTIONAL_FLAG_CONTENT}
            tooltipText={i18nFilter()(dropdownButtonTooltips[FUNCTIONAL_FLAG_CONTENT])}
        >
            <I18n>{dropdownButtonTexts[FUNCTIONAL_FLAG_CONTENT]}</I18n>
        </EllipsisDropdownItem>,
    ];

    const locked: boolean = isLocked && isLocked();

    const setInclude = () => {
        allTrackers.trackEvent(
            "include",
            "click",
            `categories list/website type/${clientValue.type}`,
        );
        setServerValueByKey("inclusion", FUNCTIONAL_FLAG_INCLUDE);
    };

    const setExclude = () => {
        if (clientValue.type === FUNCTIONAL_FLAG_ALL) {
            allTrackers.trackEvent(
                "exclude",
                "click",
                `categories list/website type/${FUNCTIONAL_FLAG_TRANSACTIONAL}`,
            );
            setServerValue({
                inclusion: FUNCTIONAL_FLAG_EXCLUDE,
                type: FUNCTIONAL_FLAG_TRANSACTIONAL,
            });
        } else {
            allTrackers.trackEvent(
                "exclude",
                "click",
                `categories list/website type/${clientValue.type}`,
            );
            setServerValueByKey("inclusion", FUNCTIONAL_FLAG_EXCLUDE);
        }
    };

    return (
        <FunctionalFlagFilterWrapper className={`${locked ? "isLocked" : ""}`}>
            {locked && (
                <>
                    <StyledLeadGeneratorLockIcon className="isInline" />
                    <StyledLeadGeneratorFilterLock
                        onClick={() => {
                            openUnlockModal(
                                {
                                    modal: trialHookName,
                                    slide: trialHookName,
                                },
                                `${LocationService.getCurrentLocation()}/TrialBanner`,
                            );
                        }}
                    />
                </>
            )}
            <RadioButton
                itemLabel={i18nFilter()(
                    "grow.lead_generator.new.general.functional_flag.radio_button.include",
                )}
                itemSelected={clientValue.inclusion === FUNCTIONAL_FLAG_INCLUDE}
                onClick={setInclude}
                itemDisabled={locked}
            />
            <RadioButton
                itemLabel={i18nFilter()(
                    "grow.lead_generator.new.general.functional_flag.radio_button.exclude",
                )}
                itemSelected={clientValue.inclusion === FUNCTIONAL_FLAG_EXCLUDE}
                onClick={setExclude}
                itemDisabled={locked}
            />
            <Expand>
                <Dropdown
                    {...dropDownProps}
                    selectedIds={{ [clientValue.type]: true }}
                    disabled={locked}
                >
                    {[
                        <DropdownButton key="DropdownButton1" disabled={locked}>
                            <I18n>{dropdownButtonTexts[clientValue.type]}</I18n>
                        </DropdownButton>,
                        ...dropDownItems,
                    ]}
                </Dropdown>
            </Expand>
        </FunctionalFlagFilterWrapper>
    );
};
