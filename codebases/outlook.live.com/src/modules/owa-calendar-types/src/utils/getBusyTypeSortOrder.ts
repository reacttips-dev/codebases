import type BusyType from 'owa-service/lib/contract/BusyType';

/** Maps BusyType to sorting order. */
export default (freeBusyType: BusyType) => {
    switch (freeBusyType) {
        case 'OOF':
            return 0;
        case 'Busy':
            return 1;
        case 'Tentative':
            return 2;
        case 'WorkingElsewhere':
            return 3;
        case 'Free':
            return 4;
        default:
            return 5;
    }
};
