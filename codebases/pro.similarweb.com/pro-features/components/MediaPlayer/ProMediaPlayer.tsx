import React, { CSSProperties, FunctionComponent } from "react";
import ReactPlayer from "react-player";

export interface IProMediaPlayerProps {
    url: string | string[] | MediaStream;
    config?: object;
    videoConfig?: {
        autoPlay?: boolean;
        withControls?: boolean;
        willLoop?: boolean;
        width?: string;
        height?: string;
        customStyles?: CSSProperties;
        wrapperClassName?: string;
        onReady?: VoidFunction;
    };
    onReady?: () => void;
    videoParams?: object;
}

export const ProMediaPlayer: FunctionComponent<IProMediaPlayerProps> = ({
    url,
    config,
    videoConfig: { withControls = true },
    videoConfig,
}) => {
    return (
        <ReactPlayer
            className={`pro-media-player ${videoConfig.wrapperClassName || ""}`}
            url={url}
            playing={videoConfig.autoPlay}
            controls={withControls}
            loop={videoConfig.willLoop}
            width={videoConfig.width}
            height={videoConfig.height}
            style={videoConfig.customStyles}
            onReady={videoConfig.onReady}
            config={config}
        />
    );
};
