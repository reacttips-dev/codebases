import { ITrackManagementItem } from "services/track/TrackWithGuidService";

export const serializeTrackManagementData = (trackDictionary) => {
    const serializedDictionary = {};
    if (trackDictionary === undefined || trackDictionary.length === 0) {
        return serializedDictionary;
    }
    trackDictionary.map((trackItem: ITrackManagementItem) => {
        if (serializedDictionary[trackItem.guid] === undefined) {
            serializedDictionary[trackItem.guid] = {};
        }
        serializedDictionary[trackItem.guid][trackItem.action] = trackItem;
    });
    return serializedDictionary;
};
