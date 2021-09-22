import { setFont } from "@similarweb/styles/src/mixins";
import { rgba, colorsPalettes } from "@similarweb/styles";
import UseCaseHomePage from "@similarweb/ui-components/dist/homepages/use-case/src/UseCaseHomepage";
import { ButtonLabel, IconButton } from "@similarweb/ui-components/dist/button";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { swSettings } from "common/services/swSettings";
import { AutocompleteKeywordGroups } from "components/AutocompleteKeywords/AutocompleteKeywordsGroups";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import {
    ESelectedTypes,
    SecondaryHomePageHeaderImageUrl,
} from "pages/digital-marketing/KeywordResearchKeywordGap";
import * as React from "react";
import styled from "styled-components";
import { KeywordsGroupUtilities } from "UtilitiesAndConstants/UtilityFunctions/KeywordsGroupUtilities";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { Text } from "../digital-marketing/KeywordResearchTopKeywords";
import { iconTypes } from "UtilitiesAndConstants/Constants/IconTypes";
import { AutocompleteKeywords } from "components/AutocompleteKeywords/AutocompleteKeywords";
import { DefaultFetchService } from "services/fetchService";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import * as utils from "components/filters-bar/utils";
import * as _ from "lodash";
import { Pill } from "components/Pill/Pill";

const translate = i18nFilter();

export const StartPageAutoCompleteWrap = styled.div`
    display: flex;
    width: 80%;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px 16px 0;
`;

const TopComponentWrapper = styled.div`
    display: flex;
`;

const LinkWrapper = styled.div`
    a {
        color: currentColor;
        text-decoration: underline;
        cursor: pointer;
    }
`;

const ButtonWrapper = styled.div`
    margin-top: 2px;
`;

const EnginesContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
    > * {
        margin: 0 4px;
    }
`;

const IconButtonInactive = styled(IconButton)`
    border-color: ${colorsPalettes.carbon[300]};
    .SWReactIcons svg path {
        fill: ${colorsPalettes.carbon[200]};
    }
    ${ButtonLabel} {
        color: ${colorsPalettes.carbon[400]};
    }
`;

const StyledPill = styled(Pill)`
    transform: translate(4px, 2px);
`;

const Placeholder1 = styled.div`
    ${setFont({ $size: 14, $weight: 400, $color: rgba(colorsPalettes.carbon[300], 0.8) })};
`;

const Placeholder2 = styled.div`
    ${setFont({ $size: 14, $weight: 700, $color: rgba(colorsPalettes.carbon[300], 0.8) })};
`;

type EngineName = "google" | "amazon" | "youtube";
interface IEngine {
    shortName: EngineName;
    description: string;
    navigationState: string;
    autocompleteComponent: React.FC<any>;
    topCountryEndpoint?: string;
}

const engines: Record<EngineName, IEngine> = {
    google: {
        shortName: "google",
        description: "digital.marketing.keywords.research.google.search.description",
        navigationState: "findkeywords_keywordGeneratorTool",
        autocompleteComponent: AutocompleteKeywordGroups,
    },
    amazon: {
        shortName: "amazon",
        description: "digital.marketing.keywords.research.amazon.search.description",
        navigationState: "findkeywords_amazonKeywordGenerator",
        autocompleteComponent: AutocompleteKeywords,
        topCountryEndpoint: "api/AmazonKeywordsGenerator/topCountry",
    },
    youtube: {
        shortName: "youtube",
        description: "digital.marketing.keywords.research.youtube.search.description",
        navigationState: "findkeywords_youtubeKeywordGenerator",
        autocompleteComponent: AutocompleteKeywords,
        topCountryEndpoint: "api/recommendations/YoutubeKeywords/topCountry",
    },
};

const KeywordResearchKeywordGeneratorHomepage: React.FC = () => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const [seedKeyword, setSeedKeyword] = React.useState({ keyword: "", isRecent: false });
    const [engine, setEngine] = React.useState<IEngine>(engines.google);
    const [isLoading, setIsLoading] = React.useState(false);
    const fetchService = DefaultFetchService.getInstance();

    const onClickSeedKeyword = (keyword, isRecent = undefined) => {
        setSeedKeyword({ keyword, isRecent });
    };

    const visitKeywordGenerator = async ({ keyword }) => {
        let country;

        if (engine.topCountryEndpoint) {
            setIsLoading(true);
            try {
                country = await fetchService.get(
                    `${engine.topCountryEndpoint}?${fetchService.requestParams({ keyword })}`,
                );
            } catch (e) {
                country = 999;
            } finally {
                setIsLoading(false);
            }
        }

        let toStateDefaultDuration;
        const toState = swNavigator.getState(engine.navigationState);
        if (toState?.params?.duration) {
            toStateDefaultDuration = toState.params.duration;
        } else {
            const componentConfigId = swNavigator.getConfigId(toState);
            toStateDefaultDuration =
                swSettings.components[componentConfigId]?.defaultParams?.duration;
        }
        // see SIM-33264. Defining the params here prevented duplicate calls to the
        // back end as a result of additional renders/mounts.
        swNavigator.go(engine.navigationState, {
            keyword,
            country: isNaN(country) ? 999 : country,
            duration: toStateDefaultDuration ?? "3m",
        });
    };

    const onClickVisitKeywordGenerator = () => {
        if (seedKeyword.keyword) {
            const isRecentText = seedKeyword.isRecent
                ? ESelectedTypes.RECENT
                : ESelectedTypes.SEARCH_RESULT;
            const isGroup = seedKeyword.keyword.startsWith("*");
            const groupName =
                isGroup &&
                `*${KeywordsGroupUtilities.getGroupNameById(seedKeyword.keyword.substring(1))}`;
            TrackWithGuidService.trackWithGuid(
                "digital.marketing.keywords.research.find.keywords.by",
                "click",
                {
                    isRecent: isRecentText,
                    section: "keyword",
                    search: isGroup ? groupName : seedKeyword.keyword,
                },
            );
            visitKeywordGenerator({ keyword: seedKeyword.keyword });
        }
    };

    const onExample1Click = () => {
        setSeedKeyword({ keyword: "face masks", isRecent: false });
    };

    const onExample2Click = () => {
        setSeedKeyword({ keyword: "winter jackets", isRecent: false });
    };
    const onClearSearch = () => {
        setSeedKeyword({ keyword: "", isRecent: false });
    };

    const onKeyDown = (event) => {
        const { keyCode } = event;
        const ENTER_KEY_CODE = 13;
        if (keyCode === ENTER_KEY_CODE) {
            onClickVisitKeywordGenerator();
        }
    };

    const handleAutocompleteValueChange = (value: string) => {
        setSeedKeyword({ keyword: value, isRecent: false });
    };

    const PlaceholderComponent = () => {
        if (!seedKeyword.keyword) {
            return (
                <div style={{ marginLeft: "35px", display: "flex" }}>
                    <Placeholder1>
                        {i18nFilter()(
                            "digital.marketing.find.keywords.keyword.generator.search.placeHolder.1",
                        )}
                    </Placeholder1>
                    &nbsp;
                    <Placeholder2>
                        {i18nFilter()(
                            engine.autocompleteComponent === AutocompleteKeywordGroups
                                ? "digital.marketing.find.keywords.keyword.generator.search.placeHolder.2"
                                : "digital.marketing.find.keywords.keyword.generator.search.placeHolder.2.keyword.only",
                        )}
                    </Placeholder2>
                </div>
            );
        }
    };

    const onEngineSelected = (engineName: EngineName) => {
        TrackWithGuidService.trackWithGuid("keyword.research.generator.engine.selected", "click", {
            engine: engineName,
        });
        // Reset keyword if engine doesn't support keyword groups
        if (
            engines[engineName].autocompleteComponent !== AutocompleteKeywordGroups &&
            seedKeyword.keyword.startsWith("*")
        ) {
            setSeedKeyword({ keyword: "", isRecent: false });
        }
        setEngine(engines[engineName]);
    };

    const AutoCompleteComponent = engine.autocompleteComponent;

    return (
        <UseCaseHomePage
            showSearchComponentsInTheBody={true}
            paddingBottom={"0"}
            icon={{ name: iconTypes.ICON_LIGHT_BULB, size: "xxl" }}
            title={translate("digitalMarketing.findKeywords.keywordGenerator.title")}
            titlePosition="centered"
            subtitle={translate("digitalMarketing.findKeywords.keywordGenerator.subTitle")}
            headerImageUrl={SecondaryHomePageHeaderImageUrl}
            searchComponents={
                <div>
                    <EnginesContainer>
                        {Object.values(engines).map(({ shortName, description }) => {
                            const ButtonComponent =
                                shortName === engine.shortName ? IconButton : IconButtonInactive;
                            return (
                                <PlainTooltip
                                    key={shortName}
                                    placement="top"
                                    tooltipContent={i18nFilter()(description)}
                                >
                                    <div>
                                        <ButtonComponent
                                            type="outlined"
                                            iconName={shortName}
                                            onClick={() => onEngineSelected(shortName)}
                                        >
                                            {shortName}
                                            {shortName === "youtube" && (
                                                <StyledPill
                                                    text={i18nFilter()("filters.title.new")}
                                                    backgroundColor={colorsPalettes.orange[400]}
                                                />
                                            )}
                                        </ButtonComponent>
                                    </div>
                                </PlainTooltip>
                            );
                        })}
                    </EnginesContainer>
                    <TopComponentWrapper>
                        <StartPageAutoCompleteWrap onKeyDown={onKeyDown}>
                            <AutoCompleteComponent
                                autocompleteProps={{
                                    placeholder: PlaceholderComponent(),
                                }}
                                selectedValue={
                                    seedKeyword.keyword?.startsWith("*")
                                        ? KeywordsGroupUtilities.getGroupNameById(
                                              seedKeyword.keyword.substring(1),
                                          )
                                        : seedKeyword.keyword
                                }
                                onValueChange={handleAutocompleteValueChange}
                                onClick={(keywordsObj) => {
                                    // In case component is normal autocomplete
                                    if (typeof keywordsObj === "string") {
                                        onClickSeedKeyword(keywordsObj);
                                    } else {
                                        // In case component is tabbed autocomplete
                                        const isGroupContext = keywordsObj.hasOwnProperty(
                                            "GroupHash",
                                        );
                                        onClickSeedKeyword(
                                            isGroupContext
                                                ? "*" + keywordsObj.Id
                                                : keywordsObj.name,
                                            keywordsObj.isRecent,
                                        );
                                    }
                                }}
                                onClearSearch={onClearSearch}
                            />
                        </StartPageAutoCompleteWrap>
                        <ButtonWrapper>
                            <IconButton
                                isLoading={isLoading}
                                iconName={iconTypes.ARROW_RIGHT}
                                onClick={onClickVisitKeywordGenerator}
                            >
                                {i18nFilter()("digitalMarketing.findKeywords.keywordGenerator.cta")}
                            </IconButton>
                        </ButtonWrapper>
                    </TopComponentWrapper>
                    <LinkWrapper>
                        <Text>
                            {i18nFilter()(
                                "digitalMarketing.findKeywords.keywordGenerator.link.title",
                            )}
                            &nbsp;
                            <a onClick={onExample1Click}>
                                {i18nFilter()(
                                    "digitalMarketing.findKeywords.keywordGenerator.link.1",
                                )}
                            </a>
                            &nbsp;
                            {i18nFilter()("digitalMarketing.findKeywords.topKeywords.link.or")}
                            &nbsp;
                            <a onClick={onExample2Click}>
                                {i18nFilter()(
                                    "digitalMarketing.findKeywords.keywordGenerator.link.2",
                                )}
                            </a>
                        </Text>
                    </LinkWrapper>
                </div>
            }
        />
    );
};

export default SWReactRootComponent(
    KeywordResearchKeywordGeneratorHomepage,
    "KeywordResearchKeywordGeneratorHomepage",
);
