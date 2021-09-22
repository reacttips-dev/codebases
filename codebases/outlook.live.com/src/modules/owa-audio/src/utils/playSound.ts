import playSoundIE from './playSoundIE';
import playSoundModern from './playSoundModern';

export default function playSound(url: string) {
    if (!(<any>window).AudioContext) {
        playSoundIE(url);
    } else {
        playSoundModern(url);
    }
}
