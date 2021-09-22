import WebappError from "../../client/errors/WebappError";
import { Logger } from "./";

let appLogger: Logger;

export const setLogger = (logger: Logger) => {
    appLogger = logger;
};

export default () => {

    if (!appLogger) {
        throw new WebappError("Logger has not been initialized");
    }

    return appLogger;
};
