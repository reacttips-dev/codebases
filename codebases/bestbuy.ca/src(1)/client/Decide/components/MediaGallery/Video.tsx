import * as React from "react";

import YouTubePlayer, {YouTubePlayerHandler, PlayerVars} from "components/YouTubePlayer";
import {PlayerEvent} from "components/YouTubePlayer/youTubeIframeAPIReady";
import {ProductVideo} from "models";

export interface VideoProps
    extends ProductVideo,
        Pick<YouTubePlayerHandler, "onError" | "onEnd" | "onPlay" | "onReady"> {}

const Video: React.FC<VideoProps> = ({onPlay, onEnd, onError, onReady, id, source, thumbnail}) => {
    const onVideoPlay = (event: PlayerEvent) => {
        if (!!onPlay) {
            onPlay(event);
        }
    };

    const onVideoEnd = (event: PlayerEvent) => {
        event.target.seekTo(10);
        event.target.stopVideo();
        if (!!onEnd) {
            onEnd(event);
        }
    };

    const onVideoError = (event: PlayerEvent) => {
        if (!!onError) {
            onError(event);
        }
    };

    const host = location.protocol + "//" + location.hostname;
    const ytopts = {
        playerVars: {
            iv_load_policy: 3,
            color: "red",
            modestbranding: 1,
            enablejsapi: 1,
            origin: host,
            rel: 0,
        } as PlayerVars,
    };

    const ytpHandler: YouTubePlayerHandler = {
        onError: onVideoError,
        onEnd: onVideoEnd,
        onPlay: onVideoPlay,
        onReady,
    };

    return (
        <div key={id} data-automation="media-gallery-youtube-player">
            <YouTubePlayer videoId={id} options={ytopts} ytpHandler={ytpHandler} />
        </div>
    );
};

Video.displayName = "Video";

export default Video;
