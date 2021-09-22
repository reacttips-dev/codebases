import { isSingleLineListView } from '../index';
import { getDensityModeString } from 'owa-fabric-theme';

// These values should correspond to heights of each row according to what is in ListItemSharedStyles.scss
export default function getMinimumRowHeight(isCondensedRow: boolean) {
    const isSingleLineViewOff = !isSingleLineListView();
    const densityMode = getDensityModeString();
    if (isSingleLineViewOff) {
        if (isCondensedRow) {
            switch (densityMode) {
                case 'full':
                    return 43;
                case 'medium':
                    return 39;
                case 'compact':
                    return 35;
            }
        } else {
            switch (densityMode) {
                case 'full':
                    return 82;
                case 'medium':
                    return 78;
                case 'compact':
                    return 72;
            }
        }
    } else {
        switch (densityMode) {
            case 'full':
                return 40;
            case 'medium':
                return 36;
            case 'compact':
                return 32;
        }
    }
    // A case should always be hit so this should never be reached
    return 80;
}
