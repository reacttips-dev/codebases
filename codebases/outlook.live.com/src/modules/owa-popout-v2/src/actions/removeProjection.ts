import { action } from 'satcheljs';

const removeProjection = action('Popout_RemoveProjection', (window: Window) => ({
    window,
}));

export default removeProjection;
