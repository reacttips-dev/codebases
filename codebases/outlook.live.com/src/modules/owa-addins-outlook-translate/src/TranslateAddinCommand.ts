import ConsentStateType from 'owa-service/lib/contract/ConsentStateType';
import type Control from 'owa-service/lib/contract/Control';
import type Extension from 'owa-service/lib/contract/Extension';
import type ExtensionPoint from 'owa-service/lib/contract/ExtensionPoint';
import type ExtensionPointCollection from 'owa-service/lib/contract/ExtensionPointCollection';
import type Group from 'owa-service/lib/contract/Group';
import type IconUrls from 'owa-service/lib/contract/IconUrls';
import RequestedCapabilities from 'owa-service/lib/contract/RequestedCapabilities';
import type Tab from 'owa-service/lib/contract/Tab';
import TabType from 'owa-service/lib/contract/TabType';
import { AddinCommand } from 'owa-addins-store';
import {
    translatorAddinId,
    addinCommandId,
    endpointUrl,
    appDomainRoot,
    appDomain,
    manifestVersion,
    iconUrl,
    addinDisplayName,
    addinDescription,
    providerName,
    highResolutionIconUrl,
} from './constants';

/**
 * AddinCommand for Translate
 * Id: '131a8b55-bd40-4fec-b2e6-d68bf5929976',
 */
class TranslateAddinCommand extends AddinCommand {
    public subCommands: AddinCommand[];
    control: null;
    tabInfo: null;
    groupInfo: null;
    extension: Extension = {
        AppDomains: [appDomainRoot, appDomain],
        Id: translatorAddinId,
        Version: manifestVersion,
        Type: 'Default',
        TypeString: 'Default',
        Origin: 'Default',
        OriginString: 'Default',
        IconUrl: iconUrl,
        DisplayName: addinDisplayName,
        ConsentState: ConsentStateType.NotResponded,
        Description: addinDescription,
        ProviderName: providerName,
        HighResolutionIconUrl: highResolutionIconUrl,
        AppStatus: '',
        LicenseType: 0,
        Settings: '{}',
        RequestedCapabilities: RequestedCapabilities.ReadItem,
        DisableEntityHighlighting: false,
        Enabled: true,
        LicenseStatus: 0,
        IsMandatory: false,
        ExtensionPointCollection: this.get_ExtensionPointCollection(),
    };
    addinId: String;
    commandId: String;
    endpoint: String;
    get isActionable() {
        return true;
    }
    get isMenu() {
        return false;
    }

    constructor() {
        super({}, {}, {}, {}); //super params: control, tabInfo, groupInfo, Extension
        this.addinId = translatorAddinId;
        this.commandId = addinCommandId;
        this.endpoint = appDomain;
    }

    get_EntryPoint() {
        return this.endpoint.toString();
    }

    get_Label() {
        return this.extension.DisplayName;
    }

    get_ExtensionDisplayName() {
        return this.extension.DisplayName;
    }

    get_Id() {
        return this.extension.Id;
    }

    get_Size16Icon() {
        return this.extension.IconUrl;
    }

    get_Version() {
        return this.extension.Version;
    }

    get_ExtensionPointCollection(): ExtensionPointCollection {
        const extensionPointCollection: ExtensionPointCollection = {
            FunctionFile: endpointUrl,
            MessageReadCommandSurface: this.get_ExtensionPoint(),
            MessageComposeCommandSurface: null,
            AppointmentOrganizerCommandSurface: null,
            AppointmentAttendeeCommandSurface: null,
            Events: null,
            DetectedEntity: null,
            CustomPane: null,
            __type: 'MessageReadCommandSurface',
        };
        return extensionPointCollection;
    }

    get_ExtensionPoint(): ExtensionPoint {
        const extensionPoint: ExtensionPoint = {
            Tabs: [this.get_Tab()],
            __type: '',
        };
        return extensionPoint;
    }

    get_Tab(): Tab {
        const tab: Tab = {
            Type: TabType.OfficeTab,
            Id: 'TabDefault',
            Groups: [this.get_Group()],
            Label: addinDisplayName,
            __type: null,
        };
        return tab;
    }

    get_Group(): Group {
        const group: Group = {
            Id: 'ScreamGroup',
            Label: addinDisplayName,
            Controls: [this.get_TaskPaneControl()],
            __type: null,
        };
        return group;
    }

    get_IconUrls(): IconUrls {
        const iconUrls: IconUrls = {
            Size16Url:
                'https://ogma.osi.office.net/outlooktranslatorapp/Images/TranslateIcon16x16.png',
            Size32Url:
                'https://ogma.osi.office.net/outlooktranslatorapp/Images/TranslateIcon32x32.png',
            Size80Url:
                'https://ogma.osi.office.net/outlooktranslatorapp/Images/TranslateIcon80x80.png',
            Size20Url: null,
            Size24Url: null,
            Size40Url: null,
            Size48Url: null,
            Size64Url:
                'https://ogma.osi.office.net/outlooktranslatorapp/Images/TranslateIcon64x64.png',
            __type: null,
        };
        return iconUrls;
    }

    get_TaskPaneControl(): Control {
        const control: any = this.get_Control();
        control.Action = {
            SourceLocation: endpointUrl,
            __type: 'TaskPaneButton',
        };
        return control;
    }

    get_Control(): Control {
        const control: Control = {
            Label: addinDisplayName,
            Supertip: {
                Title: 'Translate Item',
                Description: addinDescription,
            },
            Icon: this.get_IconUrls(),
            Id: addinCommandId,
            __type: 'ShowTaskpane',
        };
        return control;
    }
}

export default TranslateAddinCommand;
