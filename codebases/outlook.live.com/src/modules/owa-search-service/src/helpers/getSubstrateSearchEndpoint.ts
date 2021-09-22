export type SubstrateSearchEndpoint =
    | 'suggestions'
    | 'events'
    | 'init'
    | 'query'
    | 'searchHistory'
    | 'feedback';

export default function getSubstrateSearchEndpoint(
    endpoint: SubstrateSearchEndpoint,
    version?: number
) {
    const versionPath = version === 2 ? 'v2' : 'v1';
    return `search/api/${versionPath}/${endpoint}`;
}
