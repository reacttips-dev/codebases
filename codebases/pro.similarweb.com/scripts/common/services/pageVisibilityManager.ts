import swLog from "@similarweb/sw-log";

export interface IPageVisibilityManager {
    registerCallback: (cb: (isVisible: boolean) => void) => number;
}

export default class PageVisibilityManager implements IPageVisibilityManager {
    private registeredCallbacks: { [key: number]: (isVisible: boolean) => void };
    private hidden: string;
    private visibilityChange: string;

    constructor() {
        // support for older browsers
        if (typeof document.hidden !== "undefined") {
            this.hidden = "hidden";
            this.visibilityChange = "visibilitychange";
        } else if ("msHidden" in window) {
            this.hidden = "msHidden";
            this.visibilityChange = "msvisibilitychange";
        } else if ("webkitHidden" in window) {
            this.hidden = "webkitHidden";
            this.visibilityChange = "webkitvisibilitychange";
        }

        this.registeredCallbacks = [];

        // log to the console if the browser doesn't support addEventListener or the visibility API
        if (
            typeof document.addEventListener === "undefined" ||
            typeof this.hidden === "undefined"
        ) {
            swLog.log("Browser does not support the visibility API");
        } else {
            // register the event listener
            document.addEventListener(
                this.visibilityChange,
                this.handleVisibilityChange.bind(this),
                { capture: true },
            );
        }
    }

    public registerCallback(cb): number {
        const registrationKey = Date.now();
        this.registeredCallbacks[registrationKey] = cb;
        swLog.log(`Visibility callback registered: ${registrationKey}`);
        return registrationKey;
    }

    public unregisterCallback(registrationKey: number): void {
        if (this.registeredCallbacks.hasOwnProperty(registrationKey)) {
            delete this.registeredCallbacks[registrationKey];
            swLog.log(`Visibility callback unregistered: ${registrationKey}`);
            return;
        }

        swLog.log(`Visibility callback not found: ${registrationKey}`);
    }

    private handleVisibilityChange(): void {
        if (document[this.hidden]) {
            // hidden
            swLog.log("Page visibility - hidden");
            Object.values(this.registeredCallbacks).forEach((cb) => cb(false));
        } else {
            // visible
            swLog.log("Page visibility - visible");
            Object.values(this.registeredCallbacks).forEach((cb) => cb(true));
        }
    }
}
