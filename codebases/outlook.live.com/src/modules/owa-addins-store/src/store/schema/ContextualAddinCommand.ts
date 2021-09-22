import type ActivationRule from 'owa-service/lib/contract/ActivationRule';
import type DetectedEntity from 'owa-service/lib/contract/DetectedEntity';
import type Extension from 'owa-service/lib/contract/Extension';
import type IAddinCommand from './interfaces/IAddinCommand';
import type IContextualAddinCommand from './interfaces/IContextualAddinCommand';
import type Control from 'owa-service/lib/contract/Control';

/**
 * (The Contextual AddinCommand object)
 *
 * @class ContextualAddinCommand
 * @implements {IContextualAddinCommand}
 */
class ContextualAddinCommand implements IContextualAddinCommand, IAddinCommand {
    /**
     * Creates an instance of DetectedEntity.
     *
     * @param {IDetectedEntity} DetectedEntity (the associated Detected Entity Extension Point)
     * @param {IExtension} Extension (the associated Extensin object)
     */
    constructor(public detectedEntity: DetectedEntity, public extension: Extension) {}

    /**
     * (Gets the Contextual Addin's EntryPoint)
     *
     * @returns {string} (The entrypoint Url)
     */
    get_EntryPoint(): string {
        return this.detectedEntity.SourceLocation;
    }

    /**
     * Gets a uniqueId for the addin.
     *
     * @returns {string} (A unique Id for the addin)
     */
    get_Id(): string {
        return this.extension.Id;
    }

    /**
     * Gets the label for the addin.
     *
     * @returns {string} (The label of the addin command)
     */
    get_Label(): string {
        return this.detectedEntity.Label;
    }

    /**
     * Gets Extension DisplayName for addin.
     *
     * @returns {string} (Extension DisplayName for the addin)
     */
    get_ExtensionDisplayName(): string {
        return this.extension.DisplayName;
    }

    /**
     * Gets Activation Rules for addin
     *
     * @returns {ActivationRule} (ActivationRule for the addin)
     */
    get_ActivationRule(): ActivationRule {
        return this.detectedEntity.Rule;
    }

    /**
     * Gets the size 16px Icon for the addin.
     */
    get_Size16Icon(): string {
        return this.extension.IconUrl;
    }

    /**
     * Gets Control for the addin.
     */
    getControl(): Control {
        return null;
    }
}

export default ContextualAddinCommand;
