import WebappError from "../client/errors/WebappError";
import { ClientConfig, ClientConfigLoader } from "./";

let appConfigLoader: ClientConfigLoader;

export const setClientConfigLoader = (configLoader: ClientConfigLoader) => {
    appConfigLoader = configLoader;
};

export default (): Promise<ClientConfig> => {
    if (!appConfigLoader) {
        throw new WebappError("Client Config Loader has not been initialized");
    }

    return appConfigLoader.loadConfigs();
};
