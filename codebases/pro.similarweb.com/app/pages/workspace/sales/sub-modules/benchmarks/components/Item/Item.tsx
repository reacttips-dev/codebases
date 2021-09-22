import React from "react";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { Collapsible } from "@similarweb/ui-components/dist/collapsible";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import BenchmarkItemContext from "../../contexts/BenchmarkItemContext";
import { BaseWebsiteType } from "../../types/common";
import { BenchmarksVisualizationType } from "../../constants";
import { BenchmarkItemContextType } from "../../types/contexts";
import { BenchmarkResultGrowthType, BenchmarkResultType } from "../../types/benchmarks";
import BenchmarkItemHead from "../BenchmarkItemHead/BenchmarkItemHead";
import BenchmarksTabContext from "../../contexts/BenchmarksTabContext";
import { RankingAxisTooltipGlobalStyles } from "../RankingAxisTooltip/styles";
import createBenchmarkItemService from "../../services/benchmark-item/benchmarkItemServiceFactory";
import VisualisationSwitch from "../VisualisationSwitch/VisualisationSwitch";
import RankingAxisContainer from "../RankingAxis/RankingAxisContainer";
import ViewDetailsButton from "../ViewDetailsButton/ViewDetailsButton";
import BarChartVisualisation from "../BarChartVisualisation/BarChartVisualisation";
import TableVisualisation from "../TableVisualisation/TableVisualisation";
import LeaderboardVisualisation from "../LeaderboardVisualisation/LeaderboardVisualisation";
import OpportunityModeSelectorContainer from "../OpportunityModeSelector/OpportunityModeSelectorContainer";
import createOpportunityModeService from "../../services/opportunity-mode/opportunityModeServiceFactory";
import EmailSendButtonContainer from "../EmailSendButton/EmailSendButtonContainer";
import {
    StyledInnerContent,
    StyledItemContainer,
    StyledItemDetails,
    StyledItemVisualisation,
} from "./styles";

type ItemProps = {
    benchmarkResult: BenchmarkResultType;
    initiallyExpanded?: boolean;
    isLoading: boolean;
    numberOfCountries: number;
    numberOfSimilarSites: number;
    benchmarksMode: number;
    onDetailsClick?(formattedOpportunity: string): void;
    onAddCompetitor(website: BaseWebsiteType): void;
    onRemoveCompetitor(domain: BaseWebsiteType["domain"]): void;
    onUpdateCompetitor(website: BaseWebsiteType, prevDomain: BaseWebsiteType["domain"]): void;
};

const Item = (props: ItemProps) => {
    const {
        isLoading,
        benchmarkResult,
        initiallyExpanded = false,
        numberOfCountries,
        numberOfSimilarSites,
        onAddCompetitor,
        onRemoveCompetitor,
        onUpdateCompetitor,
        onDetailsClick,
    } = props;

    const { lastSendEmailBenchmarkDate } = benchmarkResult;
    const { benchmarksModeService } = React.useContext(BenchmarksTabContext);
    const [expanded, setExpanded] = React.useState(initiallyExpanded);
    const [isMouseEntered, setIsMouseEntered] = React.useState(false);
    const [selectedVisualisation, selectVisualisation] = React.useState(
        BenchmarksVisualizationType.LEADERBOARD,
    );

    const [selectedOpportunityMode, setSelectedOpportunityMode] = React.useState(
        benchmarksModeService.getInitialOpportunityMode(benchmarkResult),
    );
    const opportunityModeService = createOpportunityModeService(
        benchmarkResult,
        selectedOpportunityMode,
    );

    const benchmarkItemService = React.useMemo(() => {
        return createBenchmarkItemService(
            benchmarkResult,
            opportunityModeService,
            numberOfCountries,
            numberOfSimilarSites,
        );
    }, [benchmarkResult, selectedOpportunityMode, numberOfCountries, numberOfSimilarSites]);

    const itemContextValue: BenchmarkItemContextType = {
        isLoading,
        benchmarkResult,
        selectedVisualisation,
        onAddCompetitor,
        onRemoveCompetitor,
        onUpdateCompetitor,
        benchmarkItemService,
    };

    const handleMouseEnter = () => {
        setIsMouseEntered(true);
    };

    const handleMouseLeave = () => {
        setIsMouseEntered(false);
    };

    const handleDetailsClick = () => {
        setExpanded(true);

        if (typeof onDetailsClick === "function") {
            onDetailsClick(benchmarkItemService.formattedOpportunity);
        }
    };

    const renderVisualisation = () => {
        const {
            benchmark,
            prospect: { value },
        } = benchmarkResult;
        if (selectedVisualisation === BenchmarksVisualizationType.CHART) {
            return (
                <BarChartVisualisation
                    greaterIsBetter={benchmark.greaterIsBetter}
                    selectedOpportunityMode={selectedOpportunityMode}
                    prospectValue={value}
                />
            );
        }

        if (selectedVisualisation === BenchmarksVisualizationType.TABLE) {
            return (
                <TableVisualisation
                    greaterIsBetter={benchmark.greaterIsBetter}
                    selectedOpportunityMode={selectedOpportunityMode}
                    prospectValue={value}
                />
            );
        }

        return <LeaderboardVisualisation />;
    };

    React.useEffect(() => {
        if (selectedVisualisation !== BenchmarksVisualizationType.LEADERBOARD) {
            return;
        }

        const opportunityMode = benchmarksModeService.getInitialOpportunityMode(benchmarkResult);

        if (selectedOpportunityMode !== opportunityMode) {
            setSelectedOpportunityMode(opportunityMode);
        }
    }, [benchmarkResult]);

    return (
        <BenchmarkItemContext.Provider value={itemContextValue}>
            <StyledItemContainer
                expanded={expanded}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                data-automation={`benchmark-item-${benchmarkResult.benchmark.metric}`}
            >
                <BenchmarkItemHead
                    metric={benchmarkResult.benchmark.metric}
                    date={benchmarkResult.dataDate}
                    prevDate={(benchmarkResult as BenchmarkResultGrowthType).prevDate}
                    countryCode={benchmarkResult.country}
                />
                <StyledItemDetails expanded={expanded}>
                    <RankingAxisTooltipGlobalStyles />
                    <RankingAxisContainer isActive={isMouseEntered || expanded} />
                    {!expanded && <ViewDetailsButton onClick={handleDetailsClick} />}
                </StyledItemDetails>
                <Collapsible isActive={expanded} className="Benchmarks-collapsible">
                    <StyledInnerContent>
                        <FlexRow alignItems="center" justifyContent="space-between">
                            <FlexRow alignItems="center">
                                <VisualisationSwitch
                                    onSelect={selectVisualisation}
                                    selected={selectedVisualisation}
                                />
                                {selectedVisualisation !==
                                    BenchmarksVisualizationType.LEADERBOARD && (
                                    <OpportunityModeSelectorContainer
                                        selectedMode={selectedOpportunityMode}
                                        onModeSelect={setSelectedOpportunityMode}
                                        isDisabled={opportunityModeService.isDisabled}
                                    />
                                )}
                            </FlexRow>
                            <IconButton
                                type="flat"
                                iconSize="sm"
                                iconName="chev-up"
                                onClick={() => setExpanded(false)}
                            />
                        </FlexRow>
                        <StyledItemVisualisation>{renderVisualisation()}</StyledItemVisualisation>
                    </StyledInnerContent>
                    <EmailSendButtonContainer emailSentDate={lastSendEmailBenchmarkDate} />
                </Collapsible>
            </StyledItemContainer>
        </BenchmarkItemContext.Provider>
    );
};

export default Item;
