import { action } from 'satcheljs';
import type { HoverActionKey } from 'owa-outlook-service-options';

let saveHoverSurfaceAction = action(
    'saveHoverSurfaceAction',
    (hoverActionKeys: HoverActionKey[]) => ({ hoverActionKeys: hoverActionKeys })
);

export default saveHoverSurfaceAction;
