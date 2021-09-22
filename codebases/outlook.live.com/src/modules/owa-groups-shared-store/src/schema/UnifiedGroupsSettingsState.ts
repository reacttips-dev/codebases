export enum GroupAccessType {
    Private,
    Public,
}

export interface Classification {
    Name?: string;
    Description?: string;
}

export interface NamingPolicySettings {
    DisplayNameDecorationPrefix?: string;
    DisplayNameDecorationSuffix?: string;
    AliasDecorationPrefix?: string;
    AliasDecorationSuffix?: string;
}

export default interface UnifiedGroupsSettingsState {
    supportedClassifications: Classification[];
    defaultClassification: string;
    namingPolicySettings: NamingPolicySettings;
    groupsGuidelinesLink: string;
    orgAllowAddGuests?: boolean;
    defaultGroupAccessType?: GroupAccessType;
    groupCreationEnabled?: boolean;
    isSensitivityLabelsEnabled?: boolean;
}
