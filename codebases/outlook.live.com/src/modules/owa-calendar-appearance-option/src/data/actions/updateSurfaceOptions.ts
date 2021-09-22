import { action } from 'satcheljs';

/**
 * Orchestrator corresponding to this action is defined in owa-calendar-options-store under owa-calendar.
 * To reflect the settings in calendar surface without refreshing the page we dispatch this action
 * and in calendar this orchestrator listening to it which initializes the surface options with updated userConfiguration
 */
export default action('updateSurfaceOptions');
