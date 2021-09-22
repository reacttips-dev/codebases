let isChannelInitialized;

export function setIsNotificationChannelInitialized() {
    isChannelInitialized = true;
}

export function isNotificationChannelInitialized(): boolean {
    return isChannelInitialized;
}
