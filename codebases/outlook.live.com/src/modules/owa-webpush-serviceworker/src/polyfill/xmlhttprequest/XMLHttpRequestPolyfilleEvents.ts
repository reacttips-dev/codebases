import XMLHttpRequestPolyfillBase from './XMLHttpRequestPolyfillBase';

export type EventListenerTypes = keyof XMLHttpRequestEventMap;
export type EventListener = (
    this: XMLHttpRequest,
    ev: XMLHttpRequestEventMap[EventListenerTypes]
) => any;
export type EventListenerOptions = boolean | AddEventListenerOptions;

export default class XMLHttpRequestPolyfilleEvents extends XMLHttpRequestPolyfillBase {
    private events = {
        abort: [] as EventListener[],
        error: [] as EventListener[],
        load: [] as EventListener[],
        loadend: [] as EventListener[],
        loadstart: [] as EventListener[],
        progress: [] as EventListener[],
        readystatechange: [] as EventListener[],
        timeout: [] as EventListener[],
    };

    public get onabort() {
        return this.dispatchEvent.bind(this);
    }
    public set onabort(listener: (this: XMLHttpRequest, ev: Event) => any) {
        this.addEventListener('abort', listener as any);
    }
    public get onerror() {
        return this.dispatchEvent.bind(this);
    }
    public set onerror(listener: (this: XMLHttpRequest, ev: ProgressEvent) => any) {
        this.addEventListener('error', listener as any);
    }
    public get onload() {
        return this.dispatchEvent.bind(this);
    }
    public set onload(listener: (this: XMLHttpRequest, ev: Event) => any) {
        this.addEventListener('load', listener as any);
    }
    public get onloadend() {
        return this.dispatchEvent.bind(this);
    }
    public set onloadend(listener: (this: XMLHttpRequest, ev: ProgressEvent) => any) {
        this.addEventListener('loadend', listener as any);
    }
    public get onloadstart() {
        return this.dispatchEvent.bind(this);
    }
    public set onloadstart(listener: (this: XMLHttpRequest, ev: Event) => any) {
        this.addEventListener('loadstart', listener as any);
    }
    public get onprogress() {
        return this.dispatchEvent.bind(this);
    }
    public set onprogress(listener: (this: XMLHttpRequest, ev: ProgressEvent) => any) {
        this.addEventListener('progress', listener as any);
    }
    public get onreadystatechange() {
        return this.dispatchEvent.bind(this);
    }
    public set onreadystatechange(listener: (this: XMLHttpRequest, ev: Event) => any) {
        this.addEventListener('readystatechange', listener as any);
    }
    public set ontimeout(listener: (this: XMLHttpRequest, ev: Event) => any) {
        this.addEventListener('timeout', listener as any);
    }

    public addEventListener(
        type: EventListenerTypes,
        listener: EventListener,
        options?: EventListenerOptions
    ): void {
        switch (type) {
            case 'readystatechange':
                this.events.readystatechange.push(listener.bind(this));
                break;
            case 'abort':
                this.events.abort.push(listener.bind(this));
                break;
            case 'error':
                this.events.error.push(listener.bind(this));
                break;
            case 'load':
                this.events.load.push(listener.bind(this));
                break;
            case 'loadend':
                this.events.loadend.push(listener.bind(this));
                break;
            case 'loadstart':
                this.events.loadstart.push(listener.bind(this));
                break;
            case 'progress':
                this.events.progress.push(listener.bind(this));
                break;
            case 'timeout':
                this.events.timeout.push(listener.bind(this));
                break;
            default:
                const never: never = type;
                throw Error(`Listener type ${never} is not supported.`);
        }
    }

    public dispatchEvent(evt: Event): boolean {
        const type = evt.type as EventListenerTypes;
        const eventQueue = this.events[type];
        for (const listener of eventQueue) {
            listener.call(this, evt);
        }
        return true;
    }

    public removeEventListener(
        type: EventListenerTypes,
        listener: EventListener,
        options?: EventListenerOptions
    ): void {
        switch (type) {
            case 'readystatechange':
                this.events.readystatechange = this.events.readystatechange.filter(
                    e => e !== listener
                );
                break;
            case 'abort':
                this.events.abort = this.events.abort.filter(e => e !== listener);
                break;
            case 'error':
                this.events.error = this.events.error.filter(e => e !== listener);
                break;
            case 'load':
                this.events.load = this.events.load.filter(e => e !== listener);
                break;
            case 'loadend':
                this.events.loadend = this.events.loadend.filter(e => e !== listener);
                break;
            case 'loadstart':
                this.events.loadstart = this.events.loadstart.filter(e => e !== listener);
                break;
            case 'progress':
                this.events.progress = this.events.progress.filter(e => e !== listener);
                break;
            case 'timeout':
                this.events.timeout = this.events.timeout.filter(e => e !== listener);
                break;
            default:
                const never: never = type;
                throw Error(`Listener type ${never} is not supported.`);
        }
    }
}
