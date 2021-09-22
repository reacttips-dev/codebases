import { orchestrator } from 'satcheljs';
import { default as loadSignatureEditorWizard } from 'owa-mail-compose-actions/lib/actions/loadSignatureEditorWizard';
import { lazyLoadSignatureEditorWizard } from 'owa-getstarted-signature';

orchestrator(loadSignatureEditorWizard, message => {
    lazyLoadSignatureEditorWizard.importAndExecute(message.target, message.viewState);
});
