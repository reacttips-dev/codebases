import React, { useEffect, useState } from "react";
import { useScrollTo } from "components/hooks/useScrollTo";
import {
    StyledContainerWrapperRightBar,
    StyledScrollWrapperRightBar,
} from "pages/workspace/sales/components/RightBar/styles";
import { StyledToolbar } from "pages/workspace/sales/sub-modules/benchmarks/components/Toolbar/styles";
import SiteTendsExcel from "./SiteTrendsExcel/SiteTrendsExcel";
import SiteTrendsList from "pages/workspace/sales/sub-modules/site-trends/SiteTrendsList/SiteTrendsList";
import { SiteTrendsContainerProps } from "./SiteTrendsContainer";
import { ICountryObject } from "services/CountryService";
import DropdownCountries from "pages/workspace/sales/components/DropdownCountries/DropdownCountries";
import { opportunityListHasId } from "pages/sales-intelligence/sub-modules/opportunities/helpers";
import useRightSidebarTrackingService from "pages/sales-intelligence/hooks/useRightSidebarTrackingService";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { TOPICS_TRANSLATION_KEY } from "pages/workspace/sales/sub-modules/benchmarks/constants";
import { SingleSelectDropdown } from "../../components/SingleSelectDropdown/SingleSelectDropdown";
import { TopicType } from "../benchmarks/types/topics";
import { SiteTrendsProps } from "./types";
import { StyledDropdownContainer } from "./style";
import { TopicItemProps } from "../benchmarks/components/BenchmarksToolbar/types";

const SiteTrends = ({
    getExcelTableRowHref,
    linkToBenchmark,
    updateBenchmarkSettings,
    fetchSiteTrends,
    fetchDataForRightBar,
    isActiveTab,
    selectedWebsite,
    selectedCountry,
    activeListId,
    currentModule,
    opportunityListCountry,
    settings,
    navigator,
    opportunityLists,
    selectedTopic,
    preparedTopics,
    topicsFetching,
    isSiteTrendsLoading,
}: SiteTrendsProps & SiteTrendsContainerProps) => {
    const [isWelcome, setIsWelcome] = useState<boolean>(false);
    const ref = useScrollTo(isActiveTab);
    const sidebarTrackingService = useRightSidebarTrackingService();
    const translate = useTranslation();

    const { id, key } = navigator.getParams();
    const { topic } = settings;
    const activeList = opportunityLists.find(opportunityListHasId(id));

    useEffect(() => {
        const domain = selectedWebsite?.domain || key;
        if (domain && selectedCountry) {
            fetchSiteTrends(String(selectedCountry.id), domain);
        }
    }, [topic]);

    useEffect(() => {
        setIsWelcome(!!topic);
    }, [settings]);

    const handleDropdownToggle = (isOpen: boolean) => {
        if (isOpen) {
            sidebarTrackingService.trackSiteTrendsCountriesDDOpened(
                translate(`${TOPICS_TRANSLATION_KEY}.${topic}`),
            );
        }
    };

    const handleSelectCountry = (country: ICountryObject) => {
        sidebarTrackingService.trackSiteTrendsCountrySelected(
            country.text,
            translate(`${TOPICS_TRANSLATION_KEY}.${topic}`),
        );
        const domain = selectedWebsite?.domain || key;

        if (selectedWebsite !== null || key) {
            fetchDataForRightBar(
                domain,
                activeList?.opportunityListId || activeListId, //TODO delete activeListId after realese 2.0;
                activeList?.country || opportunityListCountry, //TODO delete opportunityListCountry after realese 2.0;
                country,
            );
        }
    };

    const renderContent = () => {
        if (isWelcome) {
            return (
                <SiteTrendsList
                    linkToBenchmark={linkToBenchmark}
                    selectedCountry={selectedCountry}
                />
            );
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

    const onClickApplyTopic = ({ children: { key: topicName, isPopular } }: TopicItemProps) => {
        const domain = selectedWebsite?.domain || key;

        trackAppliedTopic(topicName, isPopular);
        updateBenchmarkSettings(
            {
                topic: topicName,
            },
            domain,
        );
    };

    const countryId = selectedCountry?.id || activeList?.country || opportunityListCountry; //TODO delete opportunityListCountry after realese 2.0;

    return (
        <StyledContainerWrapperRightBar>
            {settings.topic && (
                <StyledToolbar>
                    <StyledDropdownContainer className="site-trends-dropdown">
                        <DropdownCountries
                            countryId={countryId}
                            currentModule={currentModule}
                            onDropdownToggle={handleDropdownToggle}
                            handleSelectCountry={handleSelectCountry}
                        />
                        <SingleSelectDropdown
                            appendTo=".site-trends-dropdown"
                            withLoader
                            selectedText={translate(`${TOPICS_TRANSLATION_KEY}.${selectedTopic}`)}
                            width="250"
                            onClick={onClickApplyTopic}
                            options={preparedTopics}
                            btnType="trial"
                            isLoading={topicsFetching}
                            buttonWidth="220"
                            minWidth="195"
                            noHover
                            renderDropdownBtn
                        />
                    </StyledDropdownContainer>

                    {/*//@ts-ignore*/}
                    <SiteTendsExcel getExcelTableRowHref={getExcelTableRowHref} />
                </StyledToolbar>
            )}
            <StyledScrollWrapperRightBar ref={ref}>{renderContent()}</StyledScrollWrapperRightBar>
        </StyledContainerWrapperRightBar>
    );
};

export default SiteTrends;
