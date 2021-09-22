import type { FocusedViewFilter } from 'owa-graph-schema';
import type { default as OwsFocusedViewFilter } from 'owa-service/lib/contract/FocusedViewFilter';
import { assertNever } from 'owa-assert';

export function convertToOwsFocusedViewFilter(input: FocusedViewFilter): OwsFocusedViewFilter {
    switch (input) {
        case 'None':
            return -1;
        case 'Focused':
            return 0;
        case 'Other':
            return 1;
        default:
            return assertNever(input);
    }
}
