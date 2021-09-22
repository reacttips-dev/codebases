import { DropdownButton, ICountryDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { swSettings } from "common/services/swSettings";
import { DurationSelectorPresetOriented } from "components/duration-selectors/DurationSelectedPresetOriented";
import { KeywordGeneratorToolResultsTable } from "pages/keyword-analysis/keyword-generator-tool/KeywordGeneratorToolResultsTable";
import * as React from "react";
import { IKeywordGroup } from "userdata";
import { IKeywordsAutocompleteProps } from "../../../../.pro-features/components/KeywordsAutocompleteStateless/src/KeywordsAutocompleteStateless";
import { KWRTTableWrapperWizard } from "../../../../.pro-features/pages/keyword research tool/TableWrapper Wizard/src/KWRTTableWrapperWizard";
import { DropdownWrapper } from "../../../../.pro-features/pages/keyword research tool/TableWrapper Wizard/src/StyledComponent";
import { preparePresets } from "../../../components/dashboard/widget-wizard/components/DashboardWizardDuration";
import { allTrackers } from "../../../services/track/track";
import { DurationSelectorSimple } from "../../website-analysis/DurationSelectorSimple";
import { getDropDownButtonTitle } from "../../website-analysis/DurationSelectorUtils";

interface IKeywordGeneratorToolResultsProps
    extends Pick<IKeywordsAutocompleteProps, "getListItems"> {
    selectedKeyword: string;
    isGroupContext: boolean;
    availableCountries: ICountryDropdownItem[];
    selectedCountry: number;
    availableWebsource: any; // todo
    selectedWebSource: string;
    isButtonDisabled: boolean;
    changeCountry: (country: number) => void;
    onApplyClick: () => void;
    onWebsourceChange: (websource: any) => void;
    fastEnterFunc: (query) => void;
    seedKeywordUpdate: (e: string) => void; // string because of the requried interface which is wrong todo: fix all the chain
    onCountryFilterToggle: (isOpen: boolean) => void;
    onWebSourceFilterToggle: (isOpen: boolean) => void;
    onKeywordsAddedToGroup: (group: IKeywordGroup, newlyCreatedGroup: boolean) => void;
    settingsComponent: any; // swSettings.current
    onDurationChange: (duration: string) => void;
    selectedComparedDuration: string;
    selectedDuration: string;
    onKeywordOrGroupChange: (
        selectedKeyword: string,
        isFromSuggestionWidget: boolean,
        isGroupContext: boolean,
    ) => () => void;
}

export class KeywordGeneratorToolResults extends React.Component<
    IKeywordGeneratorToolResultsProps
> {
    public static defaultProps = {
        onApplyClick: () => null,
    };
    public render() {
        const {
            selectedKeyword,
            isGroupContext,
            availableCountries,
            selectedCountry,
            availableWebsource,
            selectedWebSource,
            isButtonDisabled,
            changeCountry,
            getListItems,
            onWebsourceChange,
            fastEnterFunc,
            seedKeywordUpdate,
            onCountryFilterToggle,
            onWebSourceFilterToggle,
            onKeywordsAddedToGroup,
            onKeywordOrGroupChange,
        } = this.props;

        return (
            <>
                <KWRTTableWrapperWizard
                    selectedKeyword={selectedKeyword}
                    isGroupContext={isGroupContext}
                    availableCountries={availableCountries}
                    changeCountry={changeCountry}
                    selectedCountryIds={{ [selectedCountry]: true }}
                    onRun={this.onApplyClick}
                    getListItems={getListItems}
                    durationSelectorComponent={this.getDurationSelectorComponent()}
                    items={availableWebsource}
                    onChange={onWebsourceChange}
                    selectedIds={{ [selectedWebSource]: true }}
                    fastEnterFunc={fastEnterFunc}
                    isButtonDisabled={isButtonDisabled}
                    onKeyUp={seedKeywordUpdate}
                    onCountryFilterToggle={onCountryFilterToggle}
                    onWebSourceFilterToggle={onWebSourceFilterToggle}
                    onKeywordOrGroupChange={onKeywordOrGroupChange}
                />
                <KeywordGeneratorToolResultsTable onKeywordsAddedToGroup={onKeywordsAddedToGroup} />
            </>
        );
    }

    private onApplyClick = () => {
        this.setState({ totalRows: -1, totalRelatedRows: -1 });
        this.props.onApplyClick();
    };

    private onDurationSelectorToggle = (isOpen) => {
        if (isOpen) {
            allTrackers.trackEvent("Drop down", "open", "Date filter");
        }
    };

    private getDurationSelectorComponent = () => {
        const {
            selectedKeyword,
            onDurationChange,
            selectedComparedDuration,
            selectedDuration,
            settingsComponent: {
                datePickerPresets: durationSelectorPresets,
                startDate: minDate,
                endDate: maxDate,
                componentId: componentName,
                durationPaymentHook,
            },
        } = this.props;
        const presets = preparePresets(durationSelectorPresets);
        const button = (
            <DropdownWrapper>
                <DropdownButton disabled={false} hasValue={true} width={190}>
                    {getDropDownButtonTitle(selectedDuration, presets)}
                </DropdownButton>
            </DropdownWrapper>
        );
        return !swSettings.user.isShortMonthIntervalsUser ? (
            <DurationSelectorSimple
                key="filter-duration"
                minDate={minDate}
                maxDate={maxDate}
                isDisabled={false}
                presets={presets}
                initialPreset={selectedDuration}
                initialComparedDuration={selectedComparedDuration}
                onSubmit={onDurationChange}
                componentName={componentName}
                keys={selectedKeyword}
                compareAllowed={false}
                hasPermissionsLock={durationPaymentHook}
                appendTo=".KWRTTableWrapperWizard"
                onToggle={this.onDurationSelectorToggle}
            >
                {button}
            </DurationSelectorSimple>
        ) : (
            <DurationSelectorPresetOriented
                minDate={minDate}
                maxDate={maxDate}
                isDisabled={false}
                onSubmit={onDurationChange}
                presets={presets}
                initialPreset={selectedDuration}
                appendTo=".KWRTTableWrapperWizard"
            />
        );
    };
}
