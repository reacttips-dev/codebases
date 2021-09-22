import WebappError from "../../client/errors/WebappError";
import {Level, Logger} from "../logging/";

export default class ConsoleLogger implements Logger {
    constructor(public level: Level) {}

    public info(message: string) {
        if (this.level <= Level.Info) {
            this.log("info", message);
        }
    }

    public warn(message: string) {
        if (this.level <= Level.Warn) {
            this.log("warn", message);
        }
    }

    public error(error: Error | WebappError | string) {
        if (this.level <= Level.Error) {
            this.log("error", error);
        }
    }

    public trace(message: any) {
        if (this.level <= Level.Info) {
            this.log("trace", message);
        }
    }

    private log(tag: string, message: any) {
        if (message instanceof Error) {
            return console.log(`[${tag}] ${message.stack}`);
        }

        console.log(`[${tag}] ${message}`);
    }
}
