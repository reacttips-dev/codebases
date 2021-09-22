export default function getGDriveItemIdFromShareUrl(shareUrl: string): string {
    const index = shareUrl.indexOf('/d/');
    return shareUrl.substring(index + 3, shareUrl.indexOf('/', index + 3));
}
