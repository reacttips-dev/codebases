import React from "react";

export interface ITrackContext {
    track: track;
    trackWithGuid: trackWithGuid;
}

export type track = (category: string, action: string, name: string, value?: string) => void;
export type trackWithGuid = (guid: string, action: string, replacements?: any) => void;

// tslint:disable-next-line:no-console
const warn = () => console.warn("It seems like you don't have a TrackProvider up in the tree");

const defaultTrackingContext = {
    track: warn,
    trackWithGuid: warn,
};

export const TrackContext = React.createContext<ITrackContext>(defaultTrackingContext);
