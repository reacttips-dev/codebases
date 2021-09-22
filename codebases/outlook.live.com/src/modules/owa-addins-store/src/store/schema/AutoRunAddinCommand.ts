import type IAutoRunAddinCommand from './interfaces/IAutoRunAddinCommand';
import type LaunchEventType from 'owa-service/lib/contract/LaunchEventType';
import type Extension from 'owa-service/lib/contract/Extension';
import { ExtensibilityModeEnum } from 'owa-addins-types';
import type Control from 'owa-service/lib/contract/Control';

/**
 *
 * @class AutoRunAddinCommand
 * @implements {IAutoRunAddinCommand}
 */

class AutoRunAddinCommand implements IAutoRunAddinCommand {
    constructor(
        public event: LaunchEventType,
        public control: Control,
        public extension: Extension,
        public mode: ExtensibilityModeEnum
    ) {}

    getLaunchEventType(): LaunchEventType {
        return this.event;
    }

    getControl(): Control {
        return this.control;
    }

    get_EntryPoint(): string {
        switch (this.mode) {
            case ExtensibilityModeEnum.LaunchEvent:
                return this.extension.ExtensionPointCollection.LaunchEvent.SourceLocation;
            default:
                return null;
        }
    }

    get_Label(): string {
        return this.control.Label;
    }

    get_ExtensionDisplayName(): string {
        return this.extension.DisplayName;
    }

    get_Id(): string {
        return this.extension.Id;
    }

    get_Size16Icon() {
        return this.extension.IconUrl;
    }
}

export default AutoRunAddinCommand;
