import { useTrack } from "components/WithTrack/src/useTrack";
import * as PropTypes from "prop-types";
import React, { FC } from "react";
import { track, trackWithGuid } from "./context";

export { track, trackWithGuid };

export interface IWithTrackProps {
    children(trackFn: track, trackWithGuidFn: trackWithGuid): JSX.Element;
}

const WithTrack: FC<IWithTrackProps> = ({ children }) => {
    const [track, trackWithGuid] = useTrack();

    return children(track, trackWithGuid);
};
WithTrack.propTypes = {
    children: PropTypes.func.isRequired,
};

export default WithTrack;
