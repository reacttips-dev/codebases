import ModifiedQueryInformationalView from './ModifiedQueryInformationalView';
import { observer } from 'mobx-react-lite';
import { isFeatureEnabled } from 'owa-feature-flags';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';
import { SearchInlineFeedback, UserVoiceSearchTeam } from 'owa-search-diagnostics-view';
import * as React from 'react';

export interface SearchHeaderFirstRowContentProps {
    className: string;
    showModifiedQueryInformation?: boolean;
}

const SearchHeaderFirstRowContent = observer(function SearchHeaderFirstRowContent(
    props: SearchHeaderFirstRowContentProps
) {
    const { className, showModifiedQueryInformation = true } = props;
    const { currentSearchQueryId, latestRenderedQFTraceId } = getScenarioStore(
        SearchScenarioId.Mail
    );

    const traceId = currentSearchQueryId || latestRenderedQFTraceId;

    return (
        <>
            {isFeatureEnabled('sea-contextFeedback') && (
                <SearchInlineFeedback
                    cssClass={className}
                    currentSearchQueryId={traceId}
                    userVoiceTeam={UserVoiceSearchTeam.MailSearch}
                />
            )}
            {showModifiedQueryInformation && (
                <ModifiedQueryInformationalView className={className} />
            )}
        </>
    );
});
export default SearchHeaderFirstRowContent;
