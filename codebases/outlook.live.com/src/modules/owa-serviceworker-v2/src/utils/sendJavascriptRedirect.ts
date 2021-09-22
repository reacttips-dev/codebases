import * as trace from './trace';

const redirectContentTypeHeader: Headers = new Headers();
redirectContentTypeHeader.append('Content-Type', 'text/html');
const javascriptRedirectInit: ResponseInit = { status: 200, headers: redirectContentTypeHeader };

export default function sendJavascriptRedirect(uri: string): Promise<Response> {
    trace.log(`Redirecting to ${uri}`);
    return Promise.resolve(
        new Response(
            `<!DOCTYPE html><html><head><script type='text/javascript'>window.location.replace('${encodeURI(
                uri
            )}' + window.location.hash);</script></head><body></body></html>`,
            javascriptRedirectInit
        )
    );
}
