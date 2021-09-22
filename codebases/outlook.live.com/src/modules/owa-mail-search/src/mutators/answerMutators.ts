import {
    onAnswersLocalizationCompleted,
    onAnswerAvailable,
    startAnswerSearch,
} from '../actions/internalActions';
import { getStore } from '../store/store';
import { mutator } from 'satcheljs';
import { logUsage } from 'owa-analytics';
import { onLocaleChanged } from 'owa-localize';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';
import isAnswerFeatureEnabled from '../utils/isAnswerFeatureEnabled';

mutator(startAnswerSearch, () => {
    if (!isAnswerFeatureEnabled()) {
        return;
    }
    getStore().isAnswerAvailable = false;
    const { currentSearchQueryId } = getScenarioStore(SearchScenarioId.Mail);
    logUsage('Search_Answers_InitializationStarted', {
        logicalId: currentSearchQueryId,
    });
});

mutator(onAnswersLocalizationCompleted, () => {
    getStore().isAnswerLocalizationCompleted = true;
});

mutator(onAnswerAvailable, () => {
    getStore().isAnswerAvailable = true;
    logUsage('Search_Answers_AnswerAvailable');
});

mutator(onLocaleChanged, () => {
    getStore().isAnswerLocalizationCompleted = false;
});
