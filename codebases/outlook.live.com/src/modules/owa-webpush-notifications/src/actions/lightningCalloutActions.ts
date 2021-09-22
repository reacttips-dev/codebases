import { action } from 'satcheljs';

export const completeWebPushLightningCallout = action(
    'completeWebPushLightningCallout',
    (enabled: boolean) => ({ enabled })
);
