export default function isMeetingResponse(itemClass: string) {
    return itemClass.match(/^ipm\.schedule\.meeting\.resp/i);
}
