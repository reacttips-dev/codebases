import { hasQueryStringParameter, getQueryStringParameter } from 'owa-querystring';

export default function getQueryStringParameters(
    windowObject: Window,
    params: string[],
    extraParameters?: string[]
): string {
    let testParameters = ['branch', 'swver'];
    if (extraParameters) {
        testParameters = testParameters.concat(extraParameters);
    }

    testParameters.some(el => {
        if (hasQueryStringParameter(el, windowObject.location)) {
            params.push(`${el}=${getQueryStringParameter(el, windowObject.location)}`);
            return true;
        }

        return false;
    });
    return params.join('&');
}
