export default function isMeetingRequest(itemClass: string) {
    return itemClass.match(/^ipm\.schedule\.meeting\.request/i);
}
