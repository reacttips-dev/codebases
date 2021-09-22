import * as ControlTypeChecker from '../../utils/ControlTypeChecker';
import type Control from 'owa-service/lib/contract/Control';
import type Extension from 'owa-service/lib/contract/Extension';
import type Group from 'owa-service/lib/contract/Group';
import type IAddinCommand from './interfaces/IAddinCommand';
import type Tab from 'owa-service/lib/contract/Tab';
import { assertNever } from 'owa-assert';

/**
 * (The Addin Command object)
 *
 * @class AddinCommand
 * @implements {IAddinCommand}
 */
class AddinCommand implements IAddinCommand {
    /**
     * The sub commmands if it is a menu commmand
     *
     * @type {AddinCommand[]}
     */
    public subCommands: AddinCommand[];

    /**
     * The valude indicating whether the addin command can be executed.
     *
     * @type {boolean}
     */
    public get isActionable(): boolean {
        return !!(<any>this.control).Action;
    }

    /**
     * The valude indicating whether the addin command can show context menu.
     *
     * @type {boolean}
     */
    public get isMenu(): boolean {
        return !!(<any>this.control).MenuItems;
    }

    /**
     * Creates an instance of AddinCommand.
     *
     * @param {IControl} control (The associated Control)
     * @param {ITab} tabInfo (The Tab it is in)
     * @param {IGroup} groupInfo (The Group it is in)
     * @param {IExtension} Extension (the associated Extensin object)
     */
    constructor(
        public control: Control,
        public tabInfo: Tab,
        public groupInfo: Group,
        public extension: Extension
    ) {
        if (ControlTypeChecker.isMenuControl(control)) {
            const controlObject: any = control;
            this.subCommands = [];
            for (const item of controlObject.MenuItems) {
                this.subCommands.push(
                    new AddinCommand(item as Control, tabInfo, groupInfo, extension)
                );
            }
        }
    }

    /**
     * (Gets the Addin Command's EntryPoint)
     *
     * @returns {string} (The entrypoint Url)
     */
    get_EntryPoint(): string {
        if (ControlTypeChecker.isTaskPaneAction(this.control)) {
            const controlAny: any = this.control;
            const action: any = controlAny.Action;
            return action.SourceLocation;
        } else if (ControlTypeChecker.isExecuteFunctionAction(this.control)) {
            return this.extension.ExtensionPointCollection.FunctionFile;
        } else {
            assertNever(this.control as never);
            return '';
        }
    }

    /**
     * Gets a uniqueId for the addin.
     *
     * @returns {string} (A unique Id for the addin)
     */
    get_Id(): string {
        return this.extension.Id + this.control.Id;
    }

    /**
     * Gets the label for the addin.
     *
     * @returns {string} (The label of the addin command)
     */
    get_Label(): string {
        return this.control.Label;
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
     * Gets the size 16px Icon for the addin.
     */
    get_Size16Icon(): string {
        if (this.control && this.control.Icon) {
            return this.control.Icon.Size16Url;
        }
        return null;
    }

    /**
     * Gets Control for the addin.
     */
    getControl(): Control {
        return this.control;
    }
}

export default AddinCommand;
