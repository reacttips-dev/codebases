import * as PropTypes from "prop-types";
import React, { FC, useMemo } from "react";
import { track, trackWithGuid } from "./context";
import { TrackContext } from "./context";
import { TrackProviderLegacy } from "./TrackProviderLegacy";

interface ITrackProviderProps {
    track: track;
    trackWithGuid: trackWithGuid;
}

const TrackProvider: FC<ITrackProviderProps> = ({ track, trackWithGuid, children }) => {
    const value = useMemo(() => ({ track, trackWithGuid }), [track, trackWithGuid]);
    return (
        <TrackProviderLegacy track={track} trackWithGuid={trackWithGuid}>
            <TrackContext.Provider value={value}>{children}</TrackContext.Provider>
        </TrackProviderLegacy>
    );
};
TrackProvider.propTypes = {
    track: PropTypes.func.isRequired,
    trackWithGuid: PropTypes.func.isRequired,
};

export default TrackProvider;
