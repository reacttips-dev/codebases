import type IAddinCommand from './schema/interfaces/IAddinCommand';
import type RunningInstance from './schema/RunningInstance';

export default function createRunningInstance(
    controlId: string,
    addinCommand: IAddinCommand,
    hostItemIndex: string
): RunningInstance {
    return { controlId, addinCommand, hostItemIndex };
}
