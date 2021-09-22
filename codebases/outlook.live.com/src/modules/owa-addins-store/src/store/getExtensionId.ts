import getAddinCommandForControl from './getAddinCommandForControl';
import type IAddinCommand from './schema/interfaces/IAddinCommand';

export default function getExtensionId(controlId: string): string {
    const addinCommand: IAddinCommand = getAddinCommandForControl(controlId);
    return addinCommand && addinCommand.extension.Id;
}
