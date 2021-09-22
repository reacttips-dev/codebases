import {
    ITrackContext,
    track,
    TrackContext,
    trackWithGuid,
} from "components/WithTrack/src/context";
import { useContext } from "react";

export const useTrack = (): [track, trackWithGuid] => {
    const { track, trackWithGuid } = useContext<ITrackContext>(TrackContext);
    return [track, trackWithGuid];
};
