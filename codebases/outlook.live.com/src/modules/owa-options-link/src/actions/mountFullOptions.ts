import { action } from 'satcheljs';

export default action(
    'mountFullOptions',
    (category?: string, subcategory?: string, option?: string) => ({
        category,
        subcategory,
        option,
    })
);
