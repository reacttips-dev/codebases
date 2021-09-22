import { ICustomWindow, PlayerEvent, OnStateChangeEvent } from "./youTubeIframeAPIReady";

const PlayerState = {
  BUFFERING: 3,
  CUED: 5,
  ENDED: 0,
  PAUSED: 2,
  PLAYING: 1,
  UNSTARTED: -1,
};

export interface PlayerStateChange {
  onEnd?: (event: PlayerEvent) => void;
  onPlay?: (event: PlayerEvent) => void;
  onPause?: (event: PlayerEvent) => void;
}

export const ytPlayerStateChange = (onPlayerStateChange: PlayerStateChange) => {
  if (typeof window === "undefined") { return; }
  const customWindow: ICustomWindow = window;
  customWindow.onPlayerStateChange = (event: OnStateChangeEvent) => {
    const onEnd = onPlayerStateChange.onEnd;
    const onPause = onPlayerStateChange.onPause;
    const onPlay = onPlayerStateChange.onPlay;
    switch (event && event.data) {
      case PlayerState.ENDED:
        if (onEnd) {
          onEnd(event);
        }
        break;
      case PlayerState.PLAYING:
        if (onPlay) {
          onPlay(event);
        }
        break;
      case PlayerState.PAUSED:
        if (onPause) {
          onPause(event);
        }
        break;
      default:
    }
  };
};

export const ytPlayerError = (onError: (event: PlayerEvent) => void) => {
  if (typeof window === "undefined") { return; }
  const customWindow: ICustomWindow = window;
  customWindow.onPlayerError = (event: PlayerEvent) => {
    if (event && onError) {
      onError(event);
    }
  };
};

export const ytPlayerReady = (onReady: (event: PlayerEvent) => void, videoId: string) => {
  if (typeof window === "undefined") { return; }
  const customWindow: ICustomWindow = window;
  customWindow.onPlayerReady = (event: PlayerEvent) => {
    if (event && onReady) {
      onReady(event);
    }
  };
};
