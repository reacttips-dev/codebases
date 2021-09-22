import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

export default function isReplyAllTheDefaultResponse(): boolean {
    const userConfiguration = getUserConfiguration();
    return userConfiguration.UserOptions
        ? userConfiguration.UserOptions.IsReplyAllTheDefaultResponse
        : true;
}
