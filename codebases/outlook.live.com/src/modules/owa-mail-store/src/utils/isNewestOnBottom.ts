import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

export default function isNewestOnBottom(): boolean {
    const userConfiguration = getUserConfiguration();
    const sortOrderFromOptions = userConfiguration.UserOptions
        ? userConfiguration.UserOptions.ConversationSortOrderReact
        : 'ChronologicalNewestOnBottom';

    return sortOrderFromOptions == 'ChronologicalNewestOnBottom';
}
