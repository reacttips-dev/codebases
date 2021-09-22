import GifSearchMethod, { getSearchFormValue } from '../store/schema/GifSearchMethod';
import { logUsage } from 'owa-analytics';
import { HttpReadyState, HttpStatusCode } from 'owa-http-status-codes';
import { format } from 'owa-localize';
import { trace } from 'owa-trace';

interface BingGifSearchResponse {
    value: BingGifValue[];
}

export interface BingGifValue {
    name: string;
    contentUrl: string;
    thumbnail: BingGifThumbnail;
}

export interface BingGifThumbnail {
    height: number;
    width: number;
}

export const QPS_LIMIT_HTTP_STATUS_CODE = 429;
const BING_SEARCH_GIF_URL =
    'https://www.bing.com/api/v6/images/search?mkt={0}&q={1}&appid=D41D8CD98F00B204E9800998ECF8427E61385B59&safesearch=strict&license=Conversation&imageType=AnimatedGif&FORM={2}';

/**
 * Get Gif search results
 */
export default function getGifSearchResults(
    searchTerm: string,
    market: string,
    searchMethod: GifSearchMethod
): Promise<BingGifValue[]> {
    return new Promise((resolve, reject) => {
        let url = format(
            BING_SEARCH_GIF_URL,
            market,
            encodeURIComponent(searchTerm),
            getSearchFormValue(searchMethod)
        );
        let request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onreadystatechange = function () {
            if (request.readyState === HttpReadyState.Done) {
                let response: BingGifSearchResponse = null;
                if (request.status === HttpStatusCode.OK) {
                    try {
                        response = JSON.parse(request.response) as BingGifSearchResponse;

                        // Only allow images served over https://
                        let httpsResults = getHttpsGifs(response.value);
                        resolve(httpsResults);
                    } catch (ex) {
                        trace.warn('Unable to parse gif search response');
                        resolve(null);
                    }
                } else {
                    if (request.status == QPS_LIMIT_HTTP_STATUS_CODE) {
                        logQPSExceeded();
                    }

                    resolve(null);
                }
            }
        };
        request.send();
        logUsage('ExpressionPicker_GifSearchPerformed');
    });
}

export function getHttpsGifs(results: BingGifValue[]): BingGifValue[] {
    let httpsResults: BingGifValue[] = [];
    results.forEach(value => {
        if (value.contentUrl.slice(0, 6) == 'https:') {
            httpsResults.push(value);
        }
    });

    return httpsResults;
}

export function logQPSExceeded() {
    logUsage('ExpressionPicker_QPSExeeded');
}
