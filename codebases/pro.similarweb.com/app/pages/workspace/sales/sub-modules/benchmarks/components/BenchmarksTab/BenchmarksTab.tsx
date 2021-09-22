import React, { useContext, useEffect, useState } from "react";
import { StyledBenchmarksTabContainer } from "./styles";
import { usePrevious } from "components/hooks/usePrevious";
import { BenchmarksSettingsType } from "../../types/settings";
import { flagHasChanged } from "pages/workspace/sales/helpers";
import { BenchmarksQuotaType } from "../../types/benchmarks";
import BenchmarksToolbar from "../BenchmarksToolbar/BenchmarksToolbarContainer";
import TabContentContainer from "../TabContent/TabContentContainer";
import RightSidebarContext from "pages/sales-intelligence/sub-modules/right-sidebar/contexts/RightSidebarContext";
import GeneratorStarterQuota from "../GeneratorStarterQuota/GeneratorStarterQuota";
import GeneratorUltimateContainer from "../GeneratorUltimate/GeneratorUltimateContainer";
import GeneratorProspectQuotaContainer from "../GeneratorProspectQuota/GeneratorProspectQuotaContainer";
import { useSalesSettingsHelper } from "pages/sales-intelligence/services/salesSettingsHelper";
import { openUnlockModalV2 } from "services/ModalService";
import useUnlockModal from "custom-hooks/useUnlockModal";

type BenchmarksTabProps = {
    quota: BenchmarksQuotaType;
    quotaFetching: boolean;
    settings: BenchmarksSettingsType;
    settingsFetching: boolean;
    settingUpdating: boolean;
    competitorsUpdating: boolean;
    benchmarksFetching: boolean;
    benchmarksAreEmpty: boolean;
    fetchSettings(): void;
    fetchTopics(): void;
    fetchBenchmarksQuota(): void;
    setDomainToken(token: string): void;
    fetchBenchmarks(domain: string): void;
    fetchCompetitors(domain: string): void;
    fetchCountryShares(domain: string): void;
    emptyStateMessages?: { mainMessage: string; subMessage: string };
};

const BenchmarksTab = ({
    quota,
    settings,
    fetchSettings,
    quotaFetching,
    settingsFetching,
    benchmarksFetching,
    fetchBenchmarks,
    fetchBenchmarksQuota,
    competitorsUpdating,
    settingUpdating,
    setDomainToken,
    benchmarksAreEmpty,
    fetchCompetitors,
    fetchCountryShares,
    emptyStateMessages,
}: BenchmarksTabProps) => {
    const { website } = useContext(RightSidebarContext);
    const [prevDomainName, setPrevDomainName] = useState("");
    const settingsHelper = useSalesSettingsHelper();

    const prevSettingsFetching = usePrevious(settingsFetching);
    const settingsFetched = flagHasChanged(prevSettingsFetching, settingsFetching);

    const prevSettingUpdating = usePrevious(settingUpdating);
    const settingsUpdated = flagHasChanged(prevSettingUpdating, settingUpdating);

    const prevQuotaFetching = usePrevious(quotaFetching);
    const quotaFetched = flagHasChanged(prevQuotaFetching, quotaFetching);

    const prevCompetitorsUpdating = usePrevious(competitorsUpdating);
    const competitorsUpdated = flagHasChanged(prevCompetitorsUpdating, competitorsUpdating);

    const openUnlockModal = useUnlockModal("InsightsGeneratorFeature", "InsightsGeneratorFeature");

    const [insightsShown, setInsightsShown] = useState(false);

    const handleUpgradeClick = () => {
        if (settingsHelper.hasSolution2()) {
            openUnlockModalV2("InsightsGeneratorFeature");
        } else {
            openUnlockModal();
        }
    };

    const handleContinue = () => {
        setDomainToken("");
        setInsightsShown(true);

        if (website) {
            fetchBenchmarks(website.domain);
        }
    };

    const content = (
        <>
            {settings.topic && website && <BenchmarksToolbar selectedWebsite={website} />}
            <TabContentContainer
                isLoading={settingsFetching || benchmarksFetching || competitorsUpdating}
                emptyStateMessages={emptyStateMessages}
            />
        </>
    );

    const renderTabContent = () => {
        if (quotaFetching) {
            return null;
        }

        if (!quota || quota.isFeatureLocked) {
            return <GeneratorStarterQuota onUpgradeClick={handleUpgradeClick} />;
        }

        if (quota.isUltimateAccess) {
            return (
                <GeneratorUltimateContainer quota={quota} hasResults={!benchmarksAreEmpty}>
                    {content}
                </GeneratorUltimateContainer>
            );
        }

        return (
            <GeneratorProspectQuotaContainer
                quota={quota}
                hasResults={!benchmarksAreEmpty}
                onContinue={handleContinue}
                onUpgrade={handleUpgradeClick}
            >
                {content}
            </GeneratorProspectQuotaContainer>
        );
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    useEffect(() => {
        if (website !== null && prevDomainName !== website.domain) {
            setPrevDomainName(website.domain);
            fetchBenchmarksQuota();
            fetchCountryShares(website.domain);
            fetchCompetitors(website.domain);
            setInsightsShown(false);
        }
    }, [website]);

    useEffect(() => {
        if (settingsUpdated && (quota?.isUltimateAccess || insightsShown)) {
            fetchBenchmarks(website.domain);
        }
    }, [settingsUpdated]);

    useEffect(() => {
        if (quotaFetched && (quota?.isUltimateAccess || insightsShown)) {
            fetchBenchmarks(website.domain);
        }
    }, [quotaFetched]);

    useEffect(() => {
        if (competitorsUpdated) {
            fetchBenchmarks(website.domain);
        }
    }, [competitorsUpdated]);

    return <StyledBenchmarksTabContainer>{renderTabContent()}</StyledBenchmarksTabContainer>;
};

export default BenchmarksTab;
