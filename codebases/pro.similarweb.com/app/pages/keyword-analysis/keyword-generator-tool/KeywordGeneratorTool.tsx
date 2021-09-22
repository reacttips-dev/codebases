import { IconButton } from "@similarweb/ui-components/dist/button";
import { ICountryDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { NoBorderTile } from "@similarweb/ui-components/dist/grouped-tiles";
import { ListItemKeyword, ListItemKeywordGroup } from "@similarweb/ui-components/dist/list-item";
import { showTopNav } from "actions/commonActions";
import { swSettings } from "common/services/swSettings";
import * as PropTypes from "prop-types";
import * as React from "react";
import { connect } from "react-redux";
import { IKeywordGroup } from "userdata";
import { KeywordsGroupUtilities } from "UtilitiesAndConstants/UtilityFunctions/KeywordsGroupUtilities";
import TrackProvider from "../../../../.pro-features/components/WithTrack/src/TrackProvider";
import TranslationProvider from "../../../../.pro-features/components/WithTranslation/src/TranslationProvider";
import { KWResearchToolWizard } from "../../../../.pro-features/pages/keyword research tool/wizard/src/KWResearchToolWizard";
import { Injector } from "../../../../scripts/common/ioc/Injector";
import {
    clearAllParams,
    setCountry,
    setDuration,
    setSeedKeyword,
    setWebSource,
    setResultsTableView,
    setIsGroupContext,
} from "../../../actions/keywordGeneratorToolActions";
import { getCountries } from "../../../components/filters-bar/utils";
import * as utils from "../../../components/filters-bar/utils";
import I18n from "../../../components/React/Filters/I18n";
import { ISuggestionProvider } from "../../../components/React/Tooltip/AutoComplete/AutoComplete";
import { i18nFilter } from "../../../filters/ngFilters";
import { allTrackers } from "../../../services/track/track";
import { TrackWithGuidService } from "../../../services/track/TrackWithGuidService";
import { IDurationSelectorSimpleProps } from "../../website-analysis/DurationSelectorSimple";
import {
    arrow,
    KeywordGeneratorToolIcon1,
    KeywordGeneratorToolIcon2,
    KeywordGeneratorToolIcon3,
} from "./illustrations";
import { KeywordGeneratorToolResults } from "./KeywordGeneratorToolResults";
import {
    BackButtonWrapper,
    FirstStepWrap,
    IllustrationContainer,
    KeywordGeneratorToolPageWrapper,
    PageTitle,
    SeparatorContainer,
} from "./styledComponents";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

interface IKeywordGeneratorToolConnectedProps {
    seedKeyword: string;
    webSource: string;
    keys: string;
    country: number;
    duration: string;
    arenaCountry: number;
    arenaTitle: string;
    resultsTableView: boolean;
    clearAllParams: () => void;
    setSeedKeyword: (seedKeyword) => void;
    setIsGroupContext: (isGroupContext: boolean) => void;
    setCountry: (country: number) => void;
    setDuration: (duration: string) => void;
    setWebSource: (webSource: string) => void;
    clearAllSelectedRows: () => void;
    setResultsTableView: (resultsTableView: boolean) => void;
    tableSelection: any; // artem: the real any here
}

interface IKeywordGeneratorToolProps {
    onKeywordsAddedToGroup: (group: IKeywordGroup, newlyCreatedGroup: boolean) => void;
    showSuggestionWidgets?: boolean;
}

interface IKeywordGeneratorToolState
    extends Pick<IDurationSelectorSimpleProps, "minDate" | "maxDate" | "componentName"> {
    isLandingPage: boolean;
    isTable: boolean;
    availableCountries: ICountryDropdownItem[];
    durationSelectorPresets: any;
    durationSelectorDisabled: boolean;
    selectedDuration: string;
    selectedComparedDuration: string;
    comparedDurationAllowed: boolean;
    durationPaymentHook: boolean;
    isModalOpen: boolean;
    availableWebsource: any; // todo
    selectedWebSource: string;
    selectedKeyword: string;
    selectedCountry: number;
    totalRows: number;
    totalRelatedRows: number;
    tableSelectionCurrentGroup: IKeywordGroup;
    isButtonDisabled: boolean;
    isFromSuggestionWidget?: boolean;
    showSuggestionWidgets?: boolean;
    isGroupContext: boolean;
}

interface IKeywordGeneratorToolDispatchFromProps {
    showTopNav: () => void;
}

type Props = IKeywordGeneratorToolConnectedProps &
    IKeywordGeneratorToolDispatchFromProps &
    IKeywordGeneratorToolProps;

class KeywordGeneratorTool extends React.Component<Props, IKeywordGeneratorToolState> {
    public static propTypes = {
        showSuggestionWidgets: PropTypes.bool,
    };
    public static defaultProps = { showSuggestionWidgets: false };

    private swSettings = swSettings;
    private swNavigator = Injector.get<any>("swNavigator");
    private i18nFilter = i18nFilter();
    private keywordsSuggestionProvider;

    constructor(props, context) {
        super(props, context);
        this.keywordsSuggestionProvider = Injector.get<ISuggestionProvider>(
            "keywordsSuggestionProvider",
        );
        const availableCountries = getCountries();
        const availableWebsource = this.getAvailableWebSource(
            this.swSettings.current.defaultParams.duration,
            availableCountries[0].id,
        );
        this.state = {
            tableSelectionCurrentGroup: null,
            isModalOpen: false,
            totalRows: undefined,
            selectedWebSource: props.selectedWebSource || availableWebsource[0].id,
            totalRelatedRows: undefined,
            selectedKeyword: props.seedKeyword || "",
            isGroupContext: props.isGroupContext,
            selectedCountry: props.country || availableCountries[0].id,
            availableWebsource,
            isLandingPage: true,
            isTable: false,
            availableCountries,
            minDate: this.swSettings.current.startDate,
            maxDate: this.swSettings.current.endDate,
            durationSelectorPresets: this.swSettings.current.datePickerPresets,
            durationSelectorDisabled: false,
            selectedDuration: this.swSettings.current.defaultParams.duration, // todo: duration from url
            selectedComparedDuration: null, // todo: comparedDuration from url
            componentName: this.swSettings.current.componentId,
            comparedDurationAllowed: false, // todo: check this via state.periodOverPeriodEnabled === true
            durationPaymentHook: this.swSettings.current.durationPaymentHook,
            isButtonDisabled: true,
            isFromSuggestionWidget: false,
            showSuggestionWidgets: this.props.showSuggestionWidgets,
        };
    }

    public componentDidUpdate(prevProps) {
        if (this.props.seedKeyword && this.props.seedKeyword !== prevProps.seedKeyword) {
            this.setState({
                selectedKeyword: this.props.seedKeyword,
            });
        }

        if (this.props.country && this.props.country !== prevProps.country) {
            this.setState({
                selectedCountry: this.props.country || this.state.availableCountries[0].id,
            });
        }
    }

    public render() {
        return (
            <KeywordGeneratorToolPageWrapper>
                <BackButtonWrapper>
                    <IconButton type="flat" onClick={this.onBackClick} iconName="arrow-left">
                        Back
                    </IconButton>
                </BackButtonWrapper>
                <TrackProvider
                    track={allTrackers.trackEvent.bind(allTrackers)}
                    trackWithGuid={TrackWithGuidService.trackWithGuid}
                >
                    <TranslationProvider translate={this.i18nFilter}>
                        {!this.props.resultsTableView && (
                            <FirstStepWrap>
                                <KWResearchToolWizard
                                    availableCountries={this.state.availableCountries}
                                    changeCountry={this.changeCountry}
                                    selectedCountryIds={{ [this.state.selectedCountry]: true }}
                                    selectedKeyword={this.getDisplayedSelectedKeywordOrGroup()}
                                    isGroupContext={this.state.isGroupContext}
                                    onRun={this.onApplyClick}
                                    fastEnterFunc={this.fastEnterFunc}
                                    isButtonDisabled={this.state.selectedKeyword === ""}
                                    onKeyUp={this.seedKeywordUpdate}
                                    onToggle={this.onCountryFilterToggle}
                                    onChange={this.onChange}
                                    showSuggestionWidgets={this.state.showSuggestionWidgets}
                                    isFromSuggestionWidget={this.state.isFromSuggestionWidget}
                                    suggestionWidgetParams={{
                                        keys: this.props.keys,
                                        arenaCountry: this.props.arenaCountry,
                                        arenaTitle: this.props.arenaTitle,
                                    }}
                                />
                                <IllustrationContainer>
                                    <NoBorderTile
                                        icon={KeywordGeneratorToolIcon1}
                                        text={this.i18nFilter(
                                            "keyword.generator.tool.page.illustration.one.text",
                                        )}
                                        title={this.i18nFilter(
                                            "keyword.generator.tool.page.illustration.one.title",
                                        )}
                                    />
                                    <SeparatorContainer>{arrow}</SeparatorContainer>
                                    <NoBorderTile
                                        icon={KeywordGeneratorToolIcon2}
                                        text={this.i18nFilter(
                                            "keyword.generator.tool.page.illustration.two.text",
                                        )}
                                        title={this.i18nFilter(
                                            "keyword.generator.tool.page.illustration.two.title",
                                        )}
                                    />
                                    <SeparatorContainer>{arrow}</SeparatorContainer>
                                    <NoBorderTile
                                        icon={KeywordGeneratorToolIcon3}
                                        text={this.i18nFilter(
                                            "keyword.generator.tool.page.illustration.three.text",
                                        )}
                                        title={this.i18nFilter(
                                            "keyword.generator.tool.page.illustration.three.title",
                                        )}
                                    />
                                </IllustrationContainer>
                            </FirstStepWrap>
                        )}
                        {this.props.resultsTableView && (
                            <>
                                <PageTitle>
                                    <I18n>keyword.generator.tool.page.title</I18n>
                                </PageTitle>
                                <KeywordGeneratorToolResults
                                    selectedKeyword={this.getDisplayedSelectedKeywordOrGroup()}
                                    isGroupContext={this.state.isGroupContext}
                                    availableCountries={this.state.availableCountries}
                                    selectedCountry={this.state.selectedCountry}
                                    availableWebsource={this.state.availableWebsource}
                                    selectedWebSource={this.state.selectedWebSource}
                                    isButtonDisabled={this.state.isButtonDisabled}
                                    changeCountry={this.changeCountry}
                                    onApplyClick={this.onApplyClick}
                                    getListItems={this.getListItems}
                                    onWebsourceChange={this.onWebsourceChange}
                                    fastEnterFunc={this.fastEnterFunc}
                                    seedKeywordUpdate={this.seedKeywordUpdate}
                                    onCountryFilterToggle={this.onCountryFilterToggle}
                                    onWebSourceFilterToggle={this.onWebSourceFilterToggle}
                                    onKeywordsAddedToGroup={this.props.onKeywordsAddedToGroup}
                                    settingsComponent={this.swSettings.current}
                                    onDurationChange={this.onDurationChange}
                                    selectedComparedDuration={this.state.selectedComparedDuration}
                                    selectedDuration={this.state.selectedDuration}
                                    onKeywordOrGroupChange={this.onChange}
                                />
                            </>
                        )}
                    </TranslationProvider>
                </TrackProvider>
            </KeywordGeneratorToolPageWrapper>
        );
    }

    // miniwizard
    private onCountryFilterToggle = (isOpen) => {
        if (isOpen) {
            allTrackers.trackEvent("Drop down", "open", "Country filter");
        }
    };

    private changeCountry = (selectedCountry) => {
        if (selectedCountry.permitted) {
            const availableWebsource = this.getAvailableWebSource(
                this.state.selectedDuration,
                selectedCountry.id,
            );
            let selectedWebSource;
            if (availableWebsource.length === 1) {
                selectedWebSource = availableWebsource[0].id;
            } else {
                selectedWebSource = this.state.selectedWebSource;
            }
            allTrackers.trackEvent("Drop down", "click", `Country filter/${selectedCountry.text}`);
            this.setState({
                isButtonDisabled: false,
                selectedCountry: selectedCountry.id,
                availableWebsource,
                selectedWebSource,
            });
        }
    };

    protected getDisplayedSelectedKeywordOrGroup = () => {
        return this.state.selectedKeyword;
    };

    private onApplyClick = () => {
        const {
            country,
            seedKeyword,
            duration,
            webSource,
            setCountry,
            setSeedKeyword,
            setDuration,
            setWebSource,
            resultsTableView,
            setResultsTableView,
            setIsGroupContext,
        } = this.props;
        const {
            selectedCountry,
            selectedKeyword,
            selectedDuration,
            selectedWebSource,
        } = this.state;
        if (
            country !== selectedCountry ||
            seedKeyword !== selectedKeyword ||
            duration !== selectedDuration ||
            webSource !== selectedWebSource ||
            !resultsTableView
        ) {
            setCountry(selectedCountry);
            setSeedKeyword(selectedKeyword);
            setIsGroupContext(this.state.isGroupContext);
            setDuration(selectedDuration);
            setWebSource(selectedWebSource);
            setResultsTableView(true);
            this.setState({ isButtonDisabled: true });
            const tracking = [
                selectedKeyword,
                this.state.availableCountries.find((country) => country.id === selectedCountry)
                    .text,
                this.state.availableWebsource.find(
                    (websource) => websource.id === selectedWebSource,
                ).text,
                selectedDuration,
            ];
            allTrackers.trackEvent("keywordGeneratorTool", "Submit-ok", tracking.join("/"));
        }
    };
    private getListItems = (query: string): Promise<JSX.Element[]> => {
        if (query != "") {
            return this.keywordsSuggestionProvider
                .getSuggestions(query, false)
                .then((suggestions) => {
                    const keywordsList = suggestions.map((name, index) => {
                        return (
                            <ListItemKeyword
                                key={index}
                                onClick={this.onChange(name, false, false)}
                                text={name}
                            />
                        );
                    });
                    const userKeywordsGroups = keywordsGroupsService.userGroups;
                    const userKeywordsGroupsRelevantToQuery = userKeywordsGroups.filter(
                        (keywordsGroup) =>
                            keywordsGroup.Name.toLowerCase().includes(query.toLowerCase()),
                    );
                    const keywordsGroupsList = userKeywordsGroupsRelevantToQuery.map(
                        (keywordsGroup, index) => (
                            <ListItemKeywordGroup
                                key={index}
                                onClick={this.onChange(keywordsGroup.Name, false, true)}
                                text={keywordsGroup.Name}
                            />
                        ),
                    );
                    return [...keywordsGroupsList, ...keywordsList];
                });
        } else {
            return new Promise((resolve) => resolve([]));
        }
    };

    private onChange = (selectedKeyword, isFromSuggestionWidget, isGroupContext) => () => {
        this.setState({
            isButtonDisabled: !Boolean(selectedKeyword),
            selectedKeyword,
            isFromSuggestionWidget,
            isGroupContext,
        });
        if (isFromSuggestionWidget) {
            TrackWithGuidService.trackWithGuid(
                "workspaces.marketing.keywordGeneratorTool.suggestionWidget",
                "add",
                { keyword: selectedKeyword },
            );
        }
    };

    // wizard
    private onWebSourceFilterToggle = (isOpen) => {
        if (isOpen) {
            allTrackers.trackEvent("Drop down", "open", "WebSource Filter");
        }
    };
    private onWebsourceChange = (webSource) => {
        allTrackers.trackEvent("Drop down", "click", `WebSource filter/${webSource.text}`);
        this.setState({ isButtonDisabled: false, selectedWebSource: webSource.id });
    };
    private onDurationChange = (selectedDuration) => {
        const availableWebsource = this.getAvailableWebSource(
            selectedDuration,
            this.state.selectedCountry,
        );
        let selectedWebSource;
        if (availableWebsource.length === 1) {
            selectedWebSource = availableWebsource[0].id;
        } else {
            selectedWebSource = this.state.selectedWebSource;
        }
        allTrackers.trackEvent("Drop down", "click", `Date filter/${selectedDuration}`);
        this.setState({
            isButtonDisabled: false,
            selectedDuration,
            availableWebsource,
            selectedWebSource,
        });
    };
    // page
    private onBackClick = (e) => {
        allTrackers.trackEvent("Button", "click", "back");
        if (this.props.resultsTableView) {
            this.props.setResultsTableView(false);
        } else {
            if (this.props.showSuggestionWidgets) {
                this.props.showTopNav();
            }
            history.back();
        }
    };
    private getAvailableWebSource = (duration, countryId) => {
        const params = this.swNavigator.getParams();
        const state = this.swNavigator.current();
        return utils.getAvailableWebSource(state, { ...params, duration, country: countryId });
    };

    private seedKeywordUpdate = (e) => {
        this.setState({
            selectedKeyword: e.target.value,
            isButtonDisabled: false,
            isFromSuggestionWidget: false,
        });
    };
    private fastEnterFunc = async (query) => {
        await this.setStateAsync({ selectedKeyword: query });
        this.onApplyClick();
    };

    private setStateAsync(newState) {
        return new Promise<void>((resolve, reject) => {
            this.setState(newState, resolve);
        });
    }
}

const mapStateToProps = (props) => {
    const { keywordGeneratorTool, tableSelection } = props;
    const {
        seedKeyword,
        country,
        duration,
        webSource,
        keys,
        arenaCountry,
        arenaTitle,
        resultsTableView,
    } = keywordGeneratorTool;
    const isSeedKeywordStartsWithGroupPrefix = seedKeyword?.startsWith("*");
    const isGroupContext =
        keywordGeneratorTool.isGroupContext || isSeedKeywordStartsWithGroupPrefix;
    return {
        seedKeyword: isSeedKeywordStartsWithGroupPrefix
            ? KeywordsGroupUtilities.getGroupNameById(seedKeyword.substring(1))
            : seedKeyword,
        isGroupContext,
        country,
        duration,
        webSource,
        tableSelection,
        arenaCountry,
        keys,
        arenaTitle,
        resultsTableView,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSeedKeyword: (seedKeyword) => {
            dispatch(setSeedKeyword(seedKeyword.toLowerCase()));
        },
        setIsGroupContext: (isGroupContext) => {
            dispatch(setIsGroupContext(isGroupContext));
        },
        setCountry: (country) => {
            dispatch(setCountry(country));
        },
        setDuration: (duration) => {
            dispatch(setDuration(duration));
        },
        setWebSource: (webSource) => {
            dispatch(setWebSource(webSource));
        },
        clearAllParams: () => {
            dispatch(clearAllParams());
        },
        showTopNav: () => {
            dispatch(showTopNav());
        },
        setResultsTableView: (resultsTableView) => {
            dispatch(setResultsTableView(resultsTableView));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(KeywordGeneratorTool);
