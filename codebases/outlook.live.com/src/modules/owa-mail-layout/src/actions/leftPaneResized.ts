import { action } from 'satcheljs';
export const leftPaneResized = action('leftPaneResized', (leftPaneWidth: number) => ({
    leftPaneWidth,
}));
