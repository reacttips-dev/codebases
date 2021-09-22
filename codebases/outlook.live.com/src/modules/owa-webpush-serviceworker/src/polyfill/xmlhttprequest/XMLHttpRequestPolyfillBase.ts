export default class XMLHttpRequestPolyfillBase {
    public readonly DONE: number = 4;
    public readonly HEADERS_RECEIVED: number = 2;
    public readonly LOADING: number = 3;
    public readonly OPENED: number = 1;
    public readonly UNSENT: number = 0;

    public readyState: number = this.UNSENT;
    public response: any;
    public responseText: string = '';
    public responseType: XMLHttpRequestResponseType = '';
    public responseURL: string = '';
    public responseXML: Document | null = null;
    public status: number = -1;
    public statusText: string = '';
    public timeout: number = -1;
    public upload: XMLHttpRequestUpload = null as any;
    public withCredentials: boolean = false;
}
