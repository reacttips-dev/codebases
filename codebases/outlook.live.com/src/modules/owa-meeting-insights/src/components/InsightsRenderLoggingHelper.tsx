import * as React from 'react';
import { observer } from 'mobx-react-lite';
import type { InsightsDataFetchSource } from 'owa-meeting-insights-types-and-flights';
import { tryEndInsightsPerfDatapoint } from '../helpers/perfInstrumentationHelpers';
import { lazyLogInsightsCacheHitMissRate } from '../index';
import getInsightsTraceId from '../selectors/getInsightsTraceId';
import { PerformanceDatapoint, logUsage } from 'owa-analytics';

export interface InsightsRenderLoggingHelperProps {
    eventId: string;
    source: InsightsDataFetchSource;
    hasInsightsToShow: boolean;
}

const perfDatapointName = 'RelatedContentFilesAndEmailsRenderingLatency';

const InsightsRenderLoggingHelper: React.FunctionComponent<InsightsRenderLoggingHelperProps> = props => {
    const { eventId, source, hasInsightsToShow } = props;

    const cachedInsightsTraceId = getInsightsTraceId(eventId, source);
    const renderedInsightsTraceId = React.useRef(cachedInsightsTraceId);

    const insightsPerfDatapoint = React.useRef(
        new PerformanceDatapoint(perfDatapointName, {
            isCore: true,
            excludeFromKusto: true,
        })
    );

    React.useEffect(() => {
        // Log insights cache hit / miss on component mount
        lazyLogInsightsCacheHitMissRate.importAndExecute(
            insightsPerfDatapoint.current,
            eventId,
            source
        );

        return () => {
            if (insightsPerfDatapoint.current) {
                // Force invalidate(end and not log) the perf datapoint if user closes RP before Insights show up
                insightsPerfDatapoint.current.invalidate();
            }
        };
    }, []);

    const tryEndPerfDatapoint = () => {
        const hasInsightsPerfDatapointEnded = tryEndInsightsPerfDatapoint(
            insightsPerfDatapoint.current,
            eventId,
            source
        );

        if (hasInsightsPerfDatapointEnded) {
            insightsPerfDatapoint.current = null;
        }
    };

    React.useEffect(() => {
        if (cachedInsightsTraceId) {
            if (
                !renderedInsightsTraceId.current ||
                cachedInsightsTraceId == renderedInsightsTraceId.current
            ) {
                // Render from cache or render from service call
                tryEndPerfDatapoint();
            } else {
                // New insights for this event
                // Force invalidate (if valid), recreate, and log
                if (insightsPerfDatapoint.current) {
                    insightsPerfDatapoint.current.invalidate();
                }
                insightsPerfDatapoint.current = new PerformanceDatapoint(perfDatapointName, {
                    isCore: true,
                    excludeFromKusto: true,
                });
                tryEndPerfDatapoint();
            }

            renderedInsightsTraceId.current = cachedInsightsTraceId;
        }
    }, [cachedInsightsTraceId]);

    const prevHasInsights = React.useRef<boolean>(hasInsightsToShow);

    React.useEffect(() => {
        // Checking prevHasInsights is null to make sure datapoint is only logged once
        if (prevHasInsights.current !== null) {
            const hasInsightsToShowChanged = prevHasInsights.current != hasInsightsToShow;

            if (hasInsightsToShowChanged) {
                logUsage('InsightsFlickered', {
                    dataFetchSource: source,
                });

                // Nullify prevHasInsights.current to ensure datapoint is logged only once in a component's life cycle
                prevHasInsights.current = null;
            }
        }
    }, [hasInsightsToShow]);

    return null;
};

export default observer(InsightsRenderLoggingHelper);
