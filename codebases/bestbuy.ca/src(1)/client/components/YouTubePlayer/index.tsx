import * as React from "react";
import {PlayerStateChange} from "./ytPlayerEvents";
import {youTubePlayerReady} from "./youTubePlayerReady";
import * as styles from "./style.css";
import {PlayerEvent, Player} from "./youTubeIframeAPIReady";

export interface Props {
    options: {playerVars: PlayerVars};
    videoId: string;
    ytpHandler: YouTubePlayerHandler;
}

export interface State {
    videoTitle: string;
    player?: Player;
}

// Player Options here: https://developers.google.com/youtube/player_parameters
export interface PlayerVars {
    color?: string; // color of progress bar
    rel?: number; // option to show related videos
    iv_load_policy?: number; // option to show annotations or not
    modestbranding?: number; // option to show YouTube logo
    enablejsapi?: number; // option to control player via iframe or JS
    origin?: string; // option to provide extra security for iframe API
}

export interface PlayerOptions {
    videoId?: string;
    playerVars?: PlayerVars;
    events?: Events;
}

export interface Events {
    onReady?: (event: PlayerEvent) => void;
    onStateChange?: (event: PlayerEvent) => void;
    onError?: (event: PlayerEvent) => void;
}

export class YouTubePlayer extends React.Component<Props, State> {
    private playerOpts: PlayerOptions = {
        ...this.props.options,
        videoId: this.props.videoId,
    };

    private container: any = React.createRef<HTMLDivElement>();

    constructor(props: Props) {
        super(props);
        this.state = {videoTitle: ""};
    }

    public render() {
        return (
            <div className="x-youtube-video">
                <div id="youtubeplayer" className={styles.videoContainer}>
                    <div ref={this.container} />
                </div>
                <div className={styles.videoTitle}>{this.state.videoTitle}</div>
            </div>
        );
    }

    public componentDidUpdate(prevProps) {
        // only update chart if the data has changed
        if (prevProps.videoId !== this.props.videoId) {
            if (this.state.player) {
                this.state.player.loadVideoById(this.props.videoId);
                this.state.player.stopVideo();
            }
        }
    }

    public componentDidMount() {
        this.createPlayer();
    }

    private createPlayer() {
        const onPlayerStateChange: PlayerStateChange = {
            onEnd: this.props.ytpHandler.onEnd,
            onPlay: this.props.ytpHandler.onPlay,
        };
        youTubePlayerReady(
            this.container.current,
            this.props.videoId,
            this.playerOpts,
            onPlayerStateChange,
            this.props.ytpHandler.onError,
            this.onReady,
            this.props.ytpHandler.onPlayerError,
        );
    }

    private onReady = (event: PlayerEvent) => {
        this.setState({
            videoTitle: event.target.getVideoData().title,
            player: event.target,
        });
        if (this.props.ytpHandler.onReady) {
            this.props.ytpHandler.onReady(event);
        }
    };
}

export default YouTubePlayer;

export interface YouTubePlayerHandler {
    onPlayerError?: (event: PlayerEvent) => void;
    onError?: (event: PlayerEvent) => void;
    onEnd?: (event: PlayerEvent) => void;
    onPlay?: (event: PlayerEvent) => void;
    onPause?: (event: PlayerEvent) => void;
    onReady?: (event: PlayerEvent) => void;
}
