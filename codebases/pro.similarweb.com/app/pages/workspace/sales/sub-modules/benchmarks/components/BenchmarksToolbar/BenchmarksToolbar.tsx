import React from "react";
import {
    makeTitleBtnCountry,
    makeTitleValue,
    makeValueTitle,
} from "pages/workspace/sales/sub-modules/benchmarks/helpers";
import Toolbar from "../Toolbar/Toolbar";
import DropdownCountryItem from "../../../../components/multi-select-dropdown/DropdownItems/DropdownCountryItem";
import SimpleCountryDropdown from "../../../../components/multi-select-dropdown/DropdownItems/SimpleCountryDropdown";
import DropdownButtonCountry from "../../../../components/multi-select-dropdown/DropdownButtons/DropdownButtonCountry";
import MultiSelectDropdown from "../../../../components/multi-select-dropdown/MultiSelectDropdownItem";
import { MultiSelectorsDropdownContainerProps } from "./BenchmarksToolbarContainer";
import { useTranslation } from "components/WithTranslation/src/I18n";
import {
    TOOLBAR_DROPDOWN_BTN_TITLE_ALL_COUNTRIES,
    TOOLBAR_DROPDOWN_COUNTRIES_HEADER_LEFT_TITLE,
    TOOLBAR_DROPDOWN_COUNTRIES_HEADER_RIGHT_TITLE,
    TOOLBAR_DROPDOWN_TITLE_ALL_COUNTRIES,
    TOOLBAR_DROPDOWN_COUNTRIES,
    TOPICS_TRANSLATION_KEY,
    TOOLBAR_DROPDOWN_COUNTRIES_DISABLED_TOOLTIP,
    BenchmarksMode,
} from "../../../../sub-modules/benchmarks/constants";
import {
    StyledChipDownSelectWrapper,
    StyledDropdownsContainer,
    StyledIcon,
    StyledSingleSelectDropdown,
} from "./styles";
import { ChipdownSelect } from "../../../../components/ChipdownSelect/ChipdownSelect";
import useRightSidebarTrackingService from "pages/sales-intelligence/hooks/useRightSidebarTrackingService";
import { getSelectedText } from "pages/workspace/sales/components/ChipdownSelect/utils";
import { isNotEmptyObject, mapOnObjectKeys } from "pages/workspace/sales/utils/object";
import { stringToNum } from "pages/workspace/sales/utils/transformers";
import { BenchmarkModeItemProps, BenchmarksToolbarProps, TopicItemProps } from "./types";
import { SingleSelectDropdown } from "pages/workspace/sales/components/SingleSelectDropdown/SingleSelectDropdown";
import { TopicType } from "../../types/topics";

const BenchmarksToolbar: React.FC<
    MultiSelectorsDropdownContainerProps & BenchmarksToolbarProps
> = ({
    updateBenchmarkSettings,
    selectedTopic,
    selectedWebsite,
    benchmarkCountries,
    selectedCountriesIds,
    benchmarkModeId,
    benchmarkModeOptions,
    isBenchmarksLoading,
    isSingleSelectCountryDropdown,
    isCountryDropdownDisabled,
    isShowAllMyCountries,
    selectedCountry,
    preparedTopics,
    topicsFetching,
}) => {
    const translate = useTranslation();

    const { domain } = selectedWebsite;

    const sidebarTrackingService = useRightSidebarTrackingService();

    React.useEffect(() => {
        if (
            isNotEmptyObject(selectedCountriesIds) &&
            Number(Object.keys(selectedCountriesIds)[0]) !== selectedCountry
        ) {
            updateBenchmarkSettings(
                { selectedCountry: mapOnObjectKeys(selectedCountriesIds, stringToNum)[0] },
                domain,
            );
        }
    }, [selectedCountry, selectedCountriesIds]);

    const onClickApplyCountry = (selectedIds: Record<number, boolean>) => {
        if (isSingleSelectCountryDropdown) {
            const id = Object.keys(selectedIds)[0];
            updateBenchmarkSettings({ selectedCountry: Number(id), countries: [] }, domain);
        } else {
            if (domain) {
                updateBenchmarkSettings(
                    {
                        countries: mapOnObjectKeys(selectedIds, stringToNum),
                        selectedCountry: null,
                    },
                    domain,
                );
            }
        }
    };

    const handleSelectBenchmarkMode = (benchmarkModeItem: BenchmarkModeItemProps): void => {
        const id = benchmarkModeItem?.children?.props?.id;
        const settings: { benchmarkMode: number; selectedCountry?: number } = { benchmarkMode: id };

        if (String(id) !== benchmarkModeId) {
            sidebarTrackingService.trackBenchmarksModeChanged(
                translate(getSelectedText(String(id), benchmarkModeOptions)),
                translate(`${TOPICS_TRANSLATION_KEY}.${selectedTopic}`),
            );

            updateBenchmarkSettings(settings, domain);
        }
    };

    const trackAppliedTopic = (code: TopicType["code"], isPopular: boolean) => {
        const previousTopic = selectedTopic
            ? translate(`workspace.sales.benchmarks.topics.${selectedTopic}`)
            : "No topic";

        sidebarTrackingService.trackSettingsTopicApplied(
            previousTopic,
            translate(`workspace.sales.benchmarks.topics.${code}`),
            isPopular,
        );
    };

    const onClickApplyTopic = ({ children: { key, isPopular } }: TopicItemProps) => {
        trackAppliedTopic(key, isPopular);
        updateBenchmarkSettings(
            {
                topic: key,
            },
            domain,
        );
    };

    return (
        <Toolbar>
            <StyledDropdownsContainer>
                <StyledChipDownSelectWrapper className="benchmarkModeSelector">
                    <ChipdownSelect
                        appendTo=".benchmarkModeSelector"
                        loading={isBenchmarksLoading}
                        disabled={isBenchmarksLoading}
                        itemClassName="benchmarkModeItem"
                        wrapperClassName="benchmark-mode-wrapper"
                        onClick={handleSelectBenchmarkMode}
                        options={benchmarkModeOptions}
                        width="350"
                        popupHeight={520}
                        selectedItemId={benchmarkModeId}
                        itemStyles={{ fontSize: "16px" }}
                        IconComponent={<StyledIcon iconName="arrow" size="xs" />}
                    />
                </StyledChipDownSelectWrapper>
                <MultiSelectDropdown
                    isTooltipDisabled={isCountryDropdownDisabled}
                    isShowFirstItem={isShowAllMyCountries}
                    disabled={isCountryDropdownDisabled}
                    isSingleMode={isSingleSelectCountryDropdown}
                    selected={selectedCountriesIds}
                    items={benchmarkCountries}
                    dropdownPopupPlacement="ontop-left"
                    tooltipContent={translate(
                        "workspace.sales.benchmarks.tooltip.dropdown.countries",
                    )}
                    btnLabelAllItems={makeTitleBtnCountry(
                        translate(TOOLBAR_DROPDOWN_BTN_TITLE_ALL_COUNTRIES),
                    )}
                    btnLabelSeveralItems={makeValueTitle(translate(TOOLBAR_DROPDOWN_COUNTRIES))}
                    titleSelectedAllItems={makeTitleValue(
                        translate(TOOLBAR_DROPDOWN_TITLE_ALL_COUNTRIES),
                    )}
                    widthDropdown={300}
                    heightDropdown={300}
                    dropdownPopupHeight={315}
                    onHandleApply={onClickApplyCountry}
                    DropdownItem={
                        isSingleSelectCountryDropdown ? SimpleCountryDropdown : DropdownCountryItem
                    }
                    DropdownButtonItem={DropdownButtonCountry}
                    leftTitleColumn={translate(TOOLBAR_DROPDOWN_COUNTRIES_HEADER_LEFT_TITLE)}
                    rightTitleColumn={translate(TOOLBAR_DROPDOWN_COUNTRIES_HEADER_RIGHT_TITLE)}
                    disabledTooltipText={translate(TOOLBAR_DROPDOWN_COUNTRIES_DISABLED_TOOLTIP)}
                />
                <StyledSingleSelectDropdown className="single-select-wrapper">
                    <SingleSelectDropdown
                        appendTo=".benchmarkModeSelector"
                        dropdownPopupPlacement="bottom-right"
                        selectedText={translate(`${TOPICS_TRANSLATION_KEY}.${selectedTopic}`)}
                        width="250"
                        onClick={onClickApplyTopic}
                        options={preparedTopics}
                        btnType="trial"
                        isLoading={topicsFetching}
                        buttonWidth="100%"
                        noHover
                        renderDropdownBtn
                        withLoader
                    />
                </StyledSingleSelectDropdown>
            </StyledDropdownsContainer>
        </Toolbar>
    );
};

export default BenchmarksToolbar;
