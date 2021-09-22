import { getStore } from '../store/store';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { SearchApp } from '@1js/search-hostapp-owa';
import type { SearchTableQuery } from 'owa-mail-list-search';
import { TableQueryType } from 'owa-mail-list-store';
import type TableQuery from 'owa-mail-list-store/lib/store/schema/TableQuery';
import { ErrorBoundary, ErrorComponentType } from 'owa-error-boundary';
import { TraceErrorObject, errorThatWillCauseAlert } from 'owa-trace';
import { logUsage } from 'owa-analytics';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';

export interface AnswerContainerProps {
    tableQuery: TableQuery;
    isRenderingInMailListEmptyState?: boolean;
}

export default observer(function AnswersContainer(props: AnswerContainerProps) {
    const searchTableQuery = props.tableQuery as SearchTableQuery;
    const query = searchTableQuery.queryString;
    const isAnswerAvailable = getStore().isAnswerAvailable;
    if (query && props.tableQuery.type === TableQueryType.Search && isAnswerAvailable) {
        const { currentSearchQueryId } = getScenarioStore(SearchScenarioId.Mail);

        if (props.isRenderingInMailListEmptyState) {
            logUsage('Search_SearchAnswerInMailListEmptyStateRendered', {
                logicalId: currentSearchQueryId,
            });
        }
        logUsage('Search_Answers_AnswerRenderingStart', {
            logicalId: currentSearchQueryId,
        });

        const reportAnswerComponentError = (
            error: TraceErrorObject,
            errorInfo: React.ErrorInfo
        ) => {
            error.diagnosticInfo = errorInfo.componentStack;
            errorThatWillCauseAlert(`[Answers] Wrapper Component error: ${error.message}`, error);
        };

        return (
            <ErrorBoundary
                onError={reportAnswerComponentError}
                suppressErrorReport={true}
                type={ErrorComponentType.None}>
                <div
                    id={'AnswersContainer'}
                    style={{
                        width: '100%',
                    }}>
                    <SearchApp query={query} />
                </div>
            </ErrorBoundary>
        );
    } else {
        return null;
    }
});
