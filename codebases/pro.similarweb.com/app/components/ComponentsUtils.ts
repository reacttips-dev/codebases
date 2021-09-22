import swLog from "@similarweb/sw-log";

interface IDocument extends Document {
    onmousewheel: string;
}

declare const document: IDocument;
export class ComponentsUtils {
    public static getSupportForPassiveEvents(): boolean {
        let supportsPassive = false;
        try {
            (document as any).addEventListener(
                "test",
                null,
                {
                    get passive() {
                        supportsPassive = true;
                        return true;
                    },
                },
                { capture: true },
            );
        } catch (e) {}
        return supportsPassive;
    }

    public static cssPropertyValueSupported(prop: string, value: string): boolean {
        const d = document.createElement("div");
        d.style[prop] = value;
        return d.style[prop] === value;
    }

    public static cssPropertyValuesSupported(prop: string, values: string[]): boolean {
        return values.some((value) => this.cssPropertyValueSupported(prop, value));
    }

    public static whichBrowser(browser: string): boolean {
        const isBrowsers = {
            chrome: navigator.userAgent.indexOf("Chrome") > -1,
            explorer: navigator.userAgent.indexOf("MSIE") > -1,
            firefox: navigator.userAgent.indexOf("Firefox") > -1,
            safari: navigator.userAgent.indexOf("Safari") > -1,
            opera: navigator.userAgent.toLowerCase().indexOf("op") > -1,
        };
        if (isBrowsers.chrome && isBrowsers.safari) {
            isBrowsers.safari = false;
        }
        if (isBrowsers.chrome && isBrowsers.opera) {
            isBrowsers.chrome = false;
        }

        return isBrowsers[browser.toLowerCase()];
    }
    /**
     * * ensure component has been rendered completely (http://stackoverflow.com/questions/26556436/react-after-render-code)
     * @param callback
     * @param delta
     */
    public static ensureRenderCompleted(callback, delta = 0) {
        setTimeout(() => {
            window.requestAnimationFrame(callback);
        }, delta);
    }

    public static getWheelEventType(): string {
        return "onwheel" in document.createElement("div")
            ? "wheel" // Modern browsers support "wheel"
            : document.onmousewheel !== undefined
            ? "mousewheel" // Webkit and IE support at least "mousewheel"
            : "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox
    }

    public static createDomRoot(name) {
        const rootId = `${name}_${String(Math.random()).slice(2)}`;
        const root = document.createElement("div");
        root.id = rootId;
        try {
            document.body.appendChild(root);
        } catch (e) {
            swLog.exception("cannot append root element", e);
        }
        return root;
    }

    public static deleteDomRoot(element) {
        document.body.removeChild(element);
    }

    public static addPassiveWheelListener(handler) {
        const body: any = document.body;
        const _supportsPassive: boolean = this.getSupportForPassiveEvents();
        const _wheelEventType: string = ComponentsUtils.getWheelEventType();
        const eventOptions = _supportsPassive ? { passive: true } : false;
        body.addEventListener(_wheelEventType, handler, { ...eventOptions, capture: true });
    }

    public static removePassiveWheelListener(handler) {
        const body: any = document.body;
        const _wheelEventType: string = ComponentsUtils.getWheelEventType();

        body.removeEventListener(_wheelEventType, handler, { capture: true });
    }

    public static parseURLQueryString(url) {
        const urlParams = {};
        url.replace(new RegExp("([^?=&]+)(=([^&]*))?", "g"), function ($0, $1, $2, $3) {
            urlParams[$1] = decodeURIComponent($3);
        });
        return urlParams;
    }
}
