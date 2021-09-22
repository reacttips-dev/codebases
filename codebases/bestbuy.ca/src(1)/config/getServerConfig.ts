import WebappError from "../client/errors/WebappError";
import { ServerConfig, ServerConfigLoader } from "./";

let appConfigLoader: ServerConfigLoader;

export const setServerConfigLoader = (configLoader: ServerConfigLoader) => {
    appConfigLoader = configLoader;
};

export default (): Promise<ServerConfig> => {
    if (!appConfigLoader) {
        throw new WebappError("Server Config Loader has not been initialized");
    }

    return appConfigLoader.loadConfigs();
};
