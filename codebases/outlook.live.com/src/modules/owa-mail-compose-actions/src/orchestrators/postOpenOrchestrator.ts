import { orchestrator, mutatorAction } from 'satcheljs';
import {
    ComposeViewState,
    ComposeLifecycleEvent,
    PostOpenTask,
    PostOpenTaskType,
    InitAttachmentsTask,
    InsertSignatureTask,
    SaveAndUpgradeTask,
    AddInfoBarTask,
    SendTask,
    CloseConflictComposeTask,
    getStore,
} from 'owa-mail-compose-store';
import onComposeLifecycleEvent from 'owa-mail-compose-store/lib/actions/onComposeLifecycleEvent';
import trySendMessage from '../actions/trySendMessage';
import upgradeCompose from '../actions/upgradeCompose';
import loadComplianceConfig from 'owa-mail-protection/lib/actions/loadComplianceConfig';
import loadItemLabelBeforeCompose from '../utils/loadItemLabelBeforeCompose';
import initAttachments from '../actions/initAttachments';
import preload from '../utils/preload';
import loadComposeInfoBars from '../utils/loadComposeInfoBars';
import insertSignature from '../utils/insertSignature';
import notifyOpxReady from '../utils/notifyOpxReady';
import closeConflictCompose from '../utils/closeConflictCompose';
import { isFeatureEnabled } from 'owa-feature-flags';
import resolveCLPSmimeConflict from '../utils/resolveCLPSmimeConflict';
import * as trace from 'owa-trace';

const taskHandlerMap: Record<
    PostOpenTaskType,
    (viewState: ComposeViewState, task: PostOpenTask, targetWindow: Window) => void | Promise<void>
> = {
    // Ideally we can directly put most functions as value here, but that will make spyOn in test case not working.
    // So we add one more wrapper for each function here.
    [PostOpenTaskType.CloseConflictCompose]: (viewState, task) =>
        closeConflictCompose(task as CloseConflictComposeTask),
    [PostOpenTaskType.Preload]: viewState => preload(viewState),
    [PostOpenTaskType.InsertSignature]: (viewState, task) =>
        insertSignature(viewState, task as InsertSignatureTask),
    [PostOpenTaskType.InitAttachments]: (viewState, task) =>
        initAttachments(viewState, task as InitAttachmentsTask),
    [PostOpenTaskType.SaveAndUpgrade]: (viewState, task) =>
        upgradeCompose(viewState, task as SaveAndUpgradeTask),
    [PostOpenTaskType.LoadComplianceConfig]: () => loadComplianceConfig(),
    [PostOpenTaskType.LoadItemLabel]: viewState => loadItemLabelBeforeCompose(viewState),
    [PostOpenTaskType.AddInfoBar]: (viewState, task) =>
        loadComposeInfoBars(viewState, task as AddInfoBarTask),
    // TODO: 78271 [Projection] Support Addin popout and send in projection
    [PostOpenTaskType.Send]: (viewState, task, targetWindow) =>
        trySendMessage(
            viewState,
            targetWindow,
            (task as SendTask).bypassClientSideValidation
        ).catch(e => {}),
    [PostOpenTaskType.OpxNotifyReady]: () => notifyOpxReady(),
    [PostOpenTaskType.ResolveCLPSmimeConflict]: viewState => resolveCLPSmimeConflict(viewState),
};

const setPostOpenTaskExecuted = mutatorAction('setPostOpenTaskExecuted', (task: PostOpenTask) => {
    task.executed = true;
});

export function postOpenOrchestrator(actionMessage: {
    viewState: ComposeViewState;
    event: ComposeLifecycleEvent;
}) {
    const { viewState, event } = actionMessage;

    if (event == ComposeLifecycleEvent.Opened) {
        if (isFeatureEnabled('mail-popout-projection')) {
            // We run post open tasks when compose form is mounted to avoid the conflict when open compose directly in popout window
            // However, CloseConflictCompose task is special, if we don't execut it, it is possible that compose form can't be opened
            // when we open another compose in conversation reading if there is already compose there. This becomes a deadlock.
            // To fix this, we need to run this task here.
            const task = viewState.postOpenTasks.filter(
                task => task.type == PostOpenTaskType.CloseConflictCompose
            )[0];
            if (task) {
                runPostOpenTask(viewState, task);
            }
        } else {
            // It is ok to use global window when projection is not enabled
            runPostOpenTasks(viewState, window);
        }
    }
}

export async function runPostOpenTasks(viewState: ComposeViewState, targetWindow?: Window) {
    const validTasks = viewState.postOpenTasks.filter(task => !task.executed);
    const store = getStore();
    for (let i = 0; i < validTasks.length; i++) {
        // Stop executing task if compose is closed
        if (!store.viewStates.has(viewState.composeId)) {
            break;
        }

        const task = validTasks[i];
        try {
            await runPostOpenTask(viewState, task, targetWindow);
        } catch (e) {
            trace.errorThatWillCauseAlert(`Error running compose post open task: ${task.type}`, e);
        }
    }
}

function runPostOpenTask(viewState: ComposeViewState, task: PostOpenTask, targetWindow?: Window) {
    setPostOpenTaskExecuted(task);
    return taskHandlerMap[task.type](viewState, task, targetWindow);
}

export default orchestrator(onComposeLifecycleEvent, postOpenOrchestrator);
