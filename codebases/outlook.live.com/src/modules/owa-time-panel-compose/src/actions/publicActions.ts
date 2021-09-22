import { action } from 'satcheljs';
import type { CreateCollabSpaceOnInitProps } from 'owa-calendar-helpers-types';

export const popOutComposeForm = action(
    'popOutComposeForm',
    (createCollabSpaceOnInitProps?: CreateCollabSpaceOnInitProps) => ({
        createCollabSpaceOnInitProps,
    })
);

export const closeComposeFormInTimePanel = action('closeComposeFormInTimePanel');
