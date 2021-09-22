export default function getSearchQueryHasAttachmentsKqlMatches(query: string) {
    const HASATTACHMENTS_REGEX = /hasattachments:\S*/g;
    return query.match(HASATTACHMENTS_REGEX);
}
