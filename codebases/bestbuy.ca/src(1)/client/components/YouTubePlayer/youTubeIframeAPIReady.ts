import * as load from "load-script";
import {PlayerStateChange} from "./ytPlayerEvents";

export interface ICustomWindow extends Window {
    YT?: {Player: Player};
    onYouTubeIframeAPIReady?: () => void;
    onPlayerStateChange?: (event: PlayerEvent) => void;
    onPlayerError?: (event: PlayerEvent) => void;
    onPlayerReady?: (event: PlayerEvent) => void;
}

export interface PlayerEvent {
    target: Player;
}
export interface OnStateChangeEvent extends PlayerEvent {
    data: PlayerStateChange;
}
export interface Player {
    getVideoData: () => {title: string};
    loadVideoById: (videoId: string) => {};
    stopVideo: () => {};
}

export const youTubeIframeAPIReady = new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
        reject("DOM not ready");
    }
    const customWindow: ICustomWindow = window;
    if (customWindow.YT && customWindow.YT.Player && customWindow.YT.Player instanceof Function) {
        reject("YT has already been created");
    }
    const protocol = window.location.protocol === "http:" ? "http:" : "https:";
    load(protocol + "//www.youtube.com/iframe_api", (error) => {
        if (error) {
            reject(error);
        }
    });
    customWindow.onYouTubeIframeAPIReady = () => {
        resolve(customWindow.YT);
    };
});
