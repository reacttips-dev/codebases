import { isDeepLink } from 'owa-url';

export default function isPopout(targetWindow: Window) {
    const isProjection: boolean = targetWindow && targetWindow !== window;
    return isDeepLink() || isProjection;
}
