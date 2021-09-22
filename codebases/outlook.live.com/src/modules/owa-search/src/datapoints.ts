export type ButtonNames =
    | 'ContactCard'
    | 'ShareFile'
    | 'DownloadFile'
    | 'CopyFileLink'
    | 'JoinOnlineMeeting';

export default {
    Search_QuickActionClicked: {
        name: 'Search_QuickActionClicked',
        customData: (kind: ButtonNames, scenarioId: string, suggestionIndex: number) => [
            kind,
            scenarioId,
            suggestionIndex,
        ],
    },
};
