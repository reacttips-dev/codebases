import { initStrings, prefetchCdnResources } from '@1js/search-hostapp-owa';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { onAnswersLocalizationCompleted } from '../actions/internalActions';
import { getCurrentCulture } from 'owa-localize';
import { lazySubstrateSearchInitOperation, SubstrateSearchScenario } from 'owa-search-service';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';
import isAnswerFeatureEnabled from './isAnswerFeatureEnabled';
import { isFeatureEnabled } from 'owa-feature-flags';

export default function initializeAndWarmupAnswers(scenarioId?: SearchScenarioId) {
    if (getUserConfiguration()?.SessionSettings?.IsExplicitLogon) {
        return;
    }

    handleAnswersLocalization();

    searchAnswers3SWarmup(scenarioId);

    // Prefetching SearchAnswer cdn resources beforehand
    prefetchCdnResources();
}

export function searchAnswers3SWarmup(scenarioId?: SearchScenarioId) {
    if (!isAnswerFeatureEnabled()) {
        return;
    }
    const store = getScenarioStore(scenarioId || SearchScenarioId.Mail);
    lazySubstrateSearchInitOperation.import().then(substrateSearchInitOperation => {
        substrateSearchInitOperation(
            store.nextSearchQueryId,
            SubstrateSearchScenario.Mail,
            isFeatureEnabled('sea-calendarAnswer-v2')
                ? 'CalendarInsightsFlight'
                : '' /* value for X-Client-Flights header */,
            2
        );
    });
}

export async function handleAnswersLocalization() {
    const culture: string = getCurrentCulture();
    const loadStringsModule = () =>
        import(
            /* webpackChunkName: "SearchStrings" */ '@1js/search-hostapp-owa/dist/amd/lib/strings'
        );

    await initStrings(loadStringsModule, culture);
    onAnswersLocalizationCompleted();
}
