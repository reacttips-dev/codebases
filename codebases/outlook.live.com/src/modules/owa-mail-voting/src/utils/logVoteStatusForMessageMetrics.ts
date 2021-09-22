import { logUsage } from 'owa-analytics';

export default function logVoteStatusForMessageMetrics(hasUserVoted: boolean) {
    logUsage('VotingOpportunityOnMessage', {
        hasUserVoted,
    });
}
