import type OwsOptionsBase from '../OwsOptionsBase';

// The shape is defined on the server, and should be kept in sync
// In the server-ows-api project: src/Microsoft.OWS.UserSettings/Models/OutlookOptions/OptionsTypes/SxSOptions.cs
interface SxSOptions extends OwsOptionsBase {
    hideReadingPane: boolean;
    defaultEditCommand: EditOptionsCommand;
}

export enum EditOptionsCommand {
    EditInBrowser = 0,
    EditInDesktop = 1,
    EditAndReply = 2,
}

export default SxSOptions;
