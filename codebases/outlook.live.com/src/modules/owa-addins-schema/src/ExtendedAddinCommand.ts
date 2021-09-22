import {
    IExtendedAddinCommand,
    IAddinCommandTelemetry,
    IAddinCommand,
    getNextControlId,
    isAutoRunAddinCommand,
} from 'owa-addins-store';

export default class ExtendedAddinCommand implements IExtendedAddinCommand {
    public addinCommand: IAddinCommand;
    public addinCommandTelemetry: IAddinCommandTelemetry;
    public controlId: string;

    constructor(addinCommand: IAddinCommand, addinCommandTelemetry: IAddinCommandTelemetry) {
        this.addinCommand = addinCommand;
        this.addinCommandTelemetry = addinCommandTelemetry;
        this.controlId = isAutoRunAddinCommand(addinCommand) ? null : getNextControlId();
    }
}
