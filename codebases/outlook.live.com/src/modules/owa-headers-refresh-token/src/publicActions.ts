import { action } from 'satcheljs';

/**
 * triggers initialization of account
 */

export const triggerReInitializeAccount = action(
    'triggerReInitializeAccount',
    (userIdentity: string) => ({ userIdentity })
);
