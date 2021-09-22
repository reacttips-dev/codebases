import { youTubeIframeAPIReady, ICustomWindow, PlayerEvent } from "./youTubeIframeAPIReady";
import { PlayerStateChange, ytPlayerStateChange, ytPlayerError, ytPlayerReady } from "./ytPlayerEvents";
import { PlayerOptions } from ".";

export async function youTubePlayerReady(youTubePlayerId: string,
                                         videoId: string,
                                         opts: PlayerOptions,
                                         onPlayerStateChange: PlayerStateChange,
                                         onError: (event: PlayerEvent) => void,
                                         onReady: (event: PlayerEvent) => void,
                                         onPlayerError: (event: PlayerEvent) => void) {

  const options = opts;
  if (typeof youTubePlayerId === "string" && !document.getElementById(youTubePlayerId)) {
    throw new Error('Element "' + youTubePlayerId + '" does not exist.');
  } else {
    ytPlayerStateChange(onPlayerStateChange);
    ytPlayerError(onError);
    ytPlayerReady(onReady, videoId);
    const customWindow: ICustomWindow = window;
    options.events = {
      onReady: customWindow.onPlayerReady,
      onStateChange: customWindow.onPlayerStateChange,
      onError: customWindow.onPlayerError,
    };

    try {
      const YT: { Player: Player } = await youTubeIframeAPIReady;
      const player: Player = new YT.Player(youTubePlayerId, options);
    } catch (error) {
      if (onPlayerError) {
        onPlayerError(error);
      }
    }
  }
}
