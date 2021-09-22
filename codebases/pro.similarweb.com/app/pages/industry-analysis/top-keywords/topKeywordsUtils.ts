export const getChannelValue = (channel, channelText) => {
    if (!channel) {
        return null;
    }
    if (channel === channelText || !channelText) {
        return channel;
    }
    return `${channel} ${channelText}`;
};
