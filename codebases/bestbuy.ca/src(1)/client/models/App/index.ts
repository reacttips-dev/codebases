import {IBrowser as ResponsiveState} from "redux-responsive";
import {GlobalContentState, Region} from "models";

export interface App {
    environment: Environment;
    screenSize: ResponsiveState;
    globalContent: GlobalContentState;
    location: AppLocation;
}

export interface AppLocation {
    // App location should be determined from Akamai. However as tech debt, country is determined through call to LocationService. Story to address this is UB-28467
    regionCode: Region;
    country?: string;
}

export enum AppMode {
    iphone = "iphone",
    android = "android",
    delegate = "delegate",
}

export interface Environment {
    userAgent: string;
    nodeEnv: string;
    appEnv: string;
    versionNumber: string;
    muiUserAgent: string;
    standalone: boolean;
    appMode?: AppMode;
}

export interface Breakpoint {
    name: "extraSmall" | "small" | "medium" | "large" | "extraLarge";
    maxWidth: number;
    minWidth: number;
}
