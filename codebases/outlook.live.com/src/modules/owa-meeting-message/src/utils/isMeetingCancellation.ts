export default function isMeetingCancellation(itemClass: string) {
    return itemClass.match(/^ipm\.schedule\.meeting\.canceled/i);
}
