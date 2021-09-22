import { isGetStartedUser } from 'owa-session-store/lib/utils/isGetStartedUser';
import { initializeGetStartedTasksLazy } from 'owa-getstarted';
import './orchestrators/addCalendarEventOrchestrator';
import './orchestrators/addStorageAccountOrchestrator';
import './orchestrators/openEmailSignatureOrchestrator';
import './orchestrators/openTimeZoneSettingOrchestrator';
import './orchestrators/sendAnEmailOrchestrator';
import './orchestrators/showPersonalizationModalOrchestrator';
import './orchestrators/loadSignatureEditorWizardOrchestrator';

if (isGetStartedUser()) {
    initializeGetStartedTasksLazy.importAndExecute();
}
