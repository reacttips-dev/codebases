import React from "react";
import * as styles from "./styles";
import {
    BENCHMARK_COMPETITORS_COLORS,
    BENCHMARK_COMPETITORS_MAX_COUNT,
    BENCHMARK_PROSPECT_COLOR,
} from "../../constants";
import EditableCompetitor from "../EditableCompetitor/EditableCompetitorContainer";
import AddCompetitorContainer from "../EditableCompetitor/AddCompetitorContainer";
import WebsiteDomain from "pages/workspace/sales/components/WebsiteDomain/WebsiteDomain";
import {
    BenchmarkResultType,
    BenchmarkType,
} from "pages/workspace/sales/sub-modules/benchmarks/types/benchmarks";
import { BenchmarkCompetitorType } from "pages/workspace/sales/sub-modules/benchmarks/types/competitors";
import { BaseWebsiteType } from "pages/workspace/sales/sub-modules/benchmarks/types/common";

type BenchmarkCompetitorsListProps = {
    metric: BenchmarkType["metric"];
    country: BenchmarkResultType["country"];
    competitors: BenchmarkCompetitorType[];
    selectedWebsite: BaseWebsiteType & { value: number };
    similarWebsites: unknown[];
    updating?: boolean;
    onUpdateCompetitor(newCompetitor: BaseWebsiteType, prevDomain: string): void;
    onRemoveCompetitor(domain: BaseWebsiteType["domain"]): void;
    onAddCompetitor(newCompetitor: BaseWebsiteType): void;
    opportunityMode: string;
    greaterIsBetter: boolean;
    metricFormatter(metric: number): string;
};

const BenchmarkCompetitorsList = ({
    selectedWebsite,
    similarWebsites,
    onUpdateCompetitor,
    onRemoveCompetitor,
    onAddCompetitor,
    metric,
    country,
    competitors,
    updating = false,
    opportunityMode,
    greaterIsBetter,
    metricFormatter,
}: BenchmarkCompetitorsListProps) => {
    const searchExcludeList = competitors.reduce(
        (excludeList, competitor) => {
            return excludeList.concat({ name: competitor.domain });
        },
        [{ name: selectedWebsite.domain }],
    );
    return (
        <>
            <styles.StyledProspectItem>
                <WebsiteDomain
                    domain={selectedWebsite.domain}
                    favicon={selectedWebsite.favicon}
                    badgeColor={BENCHMARK_PROSPECT_COLOR}
                />
            </styles.StyledProspectItem>
            {competitors.map((c, i, array) => (
                <EditableCompetitor
                    opportunityMode={opportunityMode}
                    greaterIsBetter={greaterIsBetter}
                    website={c}
                    clickable={!updating}
                    key={`${c.domain}-${i}`}
                    onClose={onRemoveCompetitor}
                    onChange={onUpdateCompetitor}
                    similarWebsites={similarWebsites}
                    searchExcludeList={searchExcludeList}
                    color={BENCHMARK_COMPETITORS_COLORS[i]}
                    closable={array.length > 1 && !updating}
                    country={country}
                    metric={metric}
                    metricFormatter={metricFormatter}
                />
            ))}
            {competitors.length < BENCHMARK_COMPETITORS_MAX_COUNT && (
                <AddCompetitorContainer
                    updating={updating}
                    selectedWebsite={selectedWebsite}
                    similarWebsites={similarWebsites}
                    searchExcludeList={searchExcludeList}
                    onAddCompetitor={onAddCompetitor}
                    country={country}
                    metric={metric}
                    metricFormatter={metricFormatter}
                />
            )}
        </>
    );
};

export default BenchmarkCompetitorsList;
