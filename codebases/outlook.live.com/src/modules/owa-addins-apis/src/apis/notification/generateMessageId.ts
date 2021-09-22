export default function generateMessageId(
    hostItemIndex: string,
    extensionId: string,
    key: string
): string {
    return `Addin_${hostItemIndex}_${extensionId}_${key}`;
}
