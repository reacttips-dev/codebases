import {productionStackEnv} from "../../constants/Environment";

export type CmsEnvironment = "development" | "production";

export const getCmsEnvironment = (environment: string): CmsEnvironment => {
    return productionStackEnv.indexOf(environment) === -1 ? "development" : "production";
};
