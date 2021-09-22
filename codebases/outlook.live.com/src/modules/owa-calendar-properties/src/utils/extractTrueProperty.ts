const CHANNEL_CALENDAR_APPEND_STRING = '_CHANNELTEAMSTYPE_';

export function extractTrueProperty(customizedTeamsProperty: string): string {
    return customizedTeamsProperty.split(CHANNEL_CALENDAR_APPEND_STRING)[0];
}

export function joinFolderIdAndChannelId(folderId: string, channelId: string): string {
    const folderIdAndChannelId = [folderId, channelId];
    return folderIdAndChannelId.join(CHANNEL_CALENDAR_APPEND_STRING);
}
