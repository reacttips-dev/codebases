import XMLHttpRequestPolyfilleEvents from './XMLHttpRequestPolyfilleEvents';

export default class XMLHttpRequestPolyfill extends XMLHttpRequestPolyfilleEvents {
    private aborted: boolean = false;
    private request?: Request;
    private responseHeaders?: Headers;

    public abort() {
        this.aborted = true;
    }
    public getAllResponseHeaders(): string {
        let result = '';
        if (this.responseHeaders) {
            this.responseHeaders.forEach((value, name) => {
                result += `${name}: ${value}`;
            });
        }
        return result;
    }
    public getResponseHeader(header: string): string | null {
        if (this.responseHeaders && this.responseHeaders.has(header)) {
            return this.responseHeaders.get(header);
        }
        return null;
    }
    public msCachingEnabled(): boolean {
        throw Error('not implemented');
    }
    public open(method: string, url: string, async?: boolean, user?: string, password?: string) {
        this.request = new Request(url, {
            method,
        });
        this.readyState = this.OPENED;
        this.onreadystatechange(new Event('readystatechange'));
    }
    public overrideMimeType(mime: string): void {
        throw Error('not implemented');
    }
    public setRequestHeader(header: string, value: string): void {
        if (!this.request) {
            throw Error();
        }

        this.request.headers.append(header, value);
    }
    public send(data?: any): void {
        if (!this.request) {
            throw Error();
        }

        if (data) {
            this.request = new Request(this.request, {
                body: data,
            });
        }

        this.readyState = this.LOADING;
        this.onreadystatechange(new Event('readystatechange'));

        fetch(this.request)
            .then(response => {
                if (this.aborted) {
                    return '';
                }

                this.readyState = this.HEADERS_RECEIVED;
                this.onreadystatechange(new Event('readystatechange'));

                this.status = response.status;
                this.statusText = response.statusText;
                this.responseHeaders = response.headers;
                return response.text();
            })
            .then(text => {
                if (this.aborted) {
                    return;
                }

                this.responseText = text;
                this.readyState = this.DONE;
                this.onreadystatechange(new Event('readystatechange'));
            });
    }
}
