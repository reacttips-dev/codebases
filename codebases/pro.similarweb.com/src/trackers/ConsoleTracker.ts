import swLog from "@similarweb/sw-log";
import {ITrack} from "./ITrack";

/**
 * a Dummy tracker that only writes to console
 * for debug purposes
 */
export class ConsoleTracker implements ITrack {

    public static LOG_STYLE = "color:blue";

    constructor(private name: string) {
    }

    public trackEvent(...args) {
        this.log(`trackEvent(${args.join(",")})`);
    }

    public trackPageView(urlParams) {
        this.log(`trackPageView(): ${JSON.stringify(urlParams)}`);
    }

    public healthCheck() {
        this.log("healthCheck()");
    }

    public runCustomAction(action: string, ...args) {
        this.log(`runAction(${action})`, ...args);
    }

    public getBuffer() {
        return null;
    }

    private log(...args) {
        switch (args.length) {
            case 1:
                swLog.info(`%c${this.name}: ${args[0]}`, ConsoleTracker.LOG_STYLE);
                break;
            default:
                swLog.info(`%c${this.name}: ${args[0]}`, ConsoleTracker.LOG_STYLE, ...args.slice(1));
                break;
        }
    }
}



// WEBPACK FOOTER //
// ./src/trackers/ConsoleTracker.ts