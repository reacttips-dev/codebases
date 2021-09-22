import { action } from 'satcheljs';

export default action('ON_COMMIT_THEME_CHANGE', (themeId: string) => {
    return {
        themeId,
    };
});
