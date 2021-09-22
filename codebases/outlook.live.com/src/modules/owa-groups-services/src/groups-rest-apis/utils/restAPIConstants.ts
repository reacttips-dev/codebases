export enum Version {
    Beta = '/api/beta/',
    V1 = '/api/V1.0/',
    V2 = '/api/V2.0/',
}

export enum FolderType {
    Mail = 'MailFolders/inbox/',
}

export enum ObjectType {
    Groups = 'groups/',
    AddMembers = '/addmembers',
    Members = 'members/',
    MailFolders = 'mailfolders',
    ChildFolders = 'childfolders',
    MessageRules = 'messagerules/',
}

export enum UserType {
    Me = 'me/',
}

export enum OData {
    Count = '@odata.count',
}
