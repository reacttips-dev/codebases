import React, { useContext } from "react";

import { TimelineContext } from "../_utils/timeline";
import PlaybackButtons from "./TimelineEditor/PlaybackButtons";

const ArtBoardsMiddleFooter = () => {
  const { shouldRenderTimeline } = useContext(TimelineContext);

  return shouldRenderTimeline ? <PlaybackButtons></PlaybackButtons> : null;
};

ArtBoardsMiddleFooter.propTypes = {};

export default ArtBoardsMiddleFooter;
