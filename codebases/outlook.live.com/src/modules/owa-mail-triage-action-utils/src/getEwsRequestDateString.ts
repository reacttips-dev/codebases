/**
 * Converts timestamp to EWS request date string
 */
export default function getEwsRequestDateString(timeStamp: string): string {
    return timeStamp ? new Date(timeStamp).toISOString() : null;
}
