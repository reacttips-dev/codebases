import {
    AddinCommand,
    setUilessExtendedAddinCommand,
    IExtendedAddinCommand,
    IAddinCommandTelemetry,
} from 'owa-addins-store';
import { ExtendedAddinCommand, AddinCommandTelemetry } from 'owa-addins-schema';

export default function executeUiless(addinCommand: AddinCommand, hostItemIndex: string) {
    const extendedAddinCommand = new ExtendedAddinCommand(
        addinCommand,
        new AddinCommandTelemetry() as IAddinCommandTelemetry
    ) as IExtendedAddinCommand;
    const controlId = extendedAddinCommand.controlId;
    setUilessExtendedAddinCommand(controlId, extendedAddinCommand, hostItemIndex);
}
