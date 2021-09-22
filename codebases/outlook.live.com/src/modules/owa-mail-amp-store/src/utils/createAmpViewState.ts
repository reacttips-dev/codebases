import type AmpViewState from '../store/schema/AmpViewState';
import type Message from 'owa-service/lib/contract/Message';
import calculateAmpAvailability from './calculateAmpAvailability';

export default function createAmpViewState(message: Message): AmpViewState {
    return {
        preferAmp: true /*if amp is enabled we should always prefer amp*/,
        ampAvailability: calculateAmpAvailability(message),
    };
}
