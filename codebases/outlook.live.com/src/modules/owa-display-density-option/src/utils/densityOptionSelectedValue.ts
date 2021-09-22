import type DisplayDensityMode from 'owa-service/lib/contract/DisplayDensityMode';

export default function densityOptionSelectedValue(densityOptionSelected: DisplayDensityMode) {
    switch (densityOptionSelected) {
        case 'Simple':
            return 0x1;
        case 'Compact':
            return 0x2;
        case 'Full':
        default:
            return 0x0;
    }
}
