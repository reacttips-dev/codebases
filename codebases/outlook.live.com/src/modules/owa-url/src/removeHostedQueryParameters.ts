// OPX query parameters that need to be removed when constructing URLs
const HOSTED_QUERY_PARAMS = [
    'hostApp',
    'isanonymous',
    'cspoff',
    'frameName',
    'opxInstanceId',
    'hxVersion',
];

export function removeHostedQueryParameters(paramPairs?: Record<string, string>): void {
    if (paramPairs) {
        Object.keys(paramPairs).forEach(key => {
            if (HOSTED_QUERY_PARAMS.includes(key)) {
                delete paramPairs[key];
            }
        });
    }
}
