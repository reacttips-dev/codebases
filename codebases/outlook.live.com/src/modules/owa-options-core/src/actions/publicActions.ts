import { action } from 'satcheljs';

export const hideFullOptions = action(
    'HIDE_FULL_OPTION',
    (showQuickOptions?: boolean, subcategory?: string) => ({
        showQuickOptions,
        subcategory,
    })
);
