import type Extension from 'owa-service/lib/contract/Extension';
import type IAddin from './interfaces/IAddin';
import type IAddinCommand from './interfaces/IAddinCommand';
import type { ObservableMap } from 'mobx';

class Addin implements IAddin {
    /**
     * The id of the addin
     *
     * @type {string}
     */
    public Id: string;

    /**
     * The display name
     *
     * @type {string}
     */
    public DisplayName: string;

    /**
     * The url of icon
     *
     * @type {string}
     */
    public IconUrl: string;

    /**
     * The url of high resolution icon
     *
     * @type {string}
     */
    public HighResolutionIconUrl: string;

    /* tslint:disable:variable-name */
    constructor(extension: Extension, public AddinCommands: ObservableMap<string, IAddinCommand>) {
        if (!this.AddinCommands) {
            throw new Error('AddinCommands cannot be null while constructing an addin');
        }
        this.DisplayName = extension.DisplayName;
        this.IconUrl = extension.IconUrl;
        this.HighResolutionIconUrl = extension.HighResolutionIconUrl;
        this.Id = extension.Id;
    }
    /* tslint:enable:variable-name */
}

export default Addin;
