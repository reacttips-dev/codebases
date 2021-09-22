// Global component registry for instances of the FabricRecipientWell.
import { createComponentRegistry } from 'owa-generic-component-registry';

import type { RecipientWell } from '../components/PeoplePickerTypes';

/**
 * Global store for instances of a recipient well.
 *
 * Used to look up an active recipient well by its ID.
 */
export const {
    useComponentRegistration: useRecipientWellRegistration,
    getInstancesFromRegistry: getRecipientWellInstancesForId,
} = createComponentRegistry<RecipientWell>();
