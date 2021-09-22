import { action } from 'satcheljs';

export const closeFlexPane = action('closeFlexPane', (flexPaneId: string) => ({
    flexPaneId,
}));

export default closeFlexPane;
