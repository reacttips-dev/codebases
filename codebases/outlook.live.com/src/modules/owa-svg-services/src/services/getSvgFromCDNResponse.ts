/**
 * This function creates a XMLHttpRequest to the CDN.
 * IconId  -> The SVG icon we want to get.
 *
 * Returns the response from the server.
 */
export function getSvgFromCDNResponse(svgUrl: string): Promise<string> {
    if (svgUrl == null || svgUrl == '') {
        return Promise.resolve('');
    }

    let request = new Request(svgUrl);
    request.headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.headers.append('Accept', 'application/x-www-form-urlencoded; charset=UTF-8');

    return fetch(request).then(function (response: any) {
        return response.text();
    });
}
export default getSvgFromCDNResponse;
