import { action } from 'satcheljs';
import type { ComposeViewState } from 'owa-mail-compose-store';

export default action(
    'loadSignatureEditorWizard',
    (target: React.RefObject<HTMLDivElement>, viewState: ComposeViewState) => ({
        target,
        viewState,
    })
);
