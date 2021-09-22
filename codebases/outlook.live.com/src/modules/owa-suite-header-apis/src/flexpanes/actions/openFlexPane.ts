import { action } from 'satcheljs';

export const openFlexPane = action('openFlexPane', (flexPaneId: string) => ({
    flexPaneId,
}));

export default openFlexPane;
