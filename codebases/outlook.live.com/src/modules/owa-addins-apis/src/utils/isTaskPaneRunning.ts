import { getExtensibilityState } from 'owa-addins-store';

export default function isTaskPaneRunning(controlId: string): boolean {
    const { taskPanes } = getExtensibilityState();
    for (let taskPaneAddins of taskPanes.values()) {
        for (let instance of taskPaneAddins.values()) {
            if (instance.controlId === controlId) {
                return true;
            }
        }
    }
    return false;
}
