/**
 * Contains the Outlook MethodDispIds
 * Please keep in sync with Microsoft.Owa.ExtensibilityNext.ViewModels.OutlookDispid
 */
export enum OutlookMethodDispId {
    GetInitialData = 1,

    GetUserIdentityToken = 2,

    EwsRequest = 5,

    LoadCustomProperties = 3,

    SaveCustomProperties = 4,

    DisplayNewAppointmentForm = 7,

    DisplayMessageForm = 8,

    DisplayAppointmentForm = 9,

    DisplayReplyForm = 10,

    DisplayReplyAllForm = 11,

    GetCallbackToken = 12,

    SetBodySelectedDataAsync = 13,

    GetBodyTypeAsync = 14,

    GetRecipientsAsync = 15,

    AddFileAttachmentAsync = 16,

    SetSubjectAsync = 17,

    GetSubjectAsync = 18,

    AddItemAttachmentAsync = 19,

    RemoveAttachmentAsync = 20,

    SetRecipientsAsync = 21,

    AddRecipientsAsync = 22,

    BodyPrependAsync = 23,

    GetTimeAsync = 24,

    SetTimeAsync = 25,

    GetLocationAsync = 26,

    SetLocationAsync = 27,

    GetSelectedDataAsync = 28,

    SetSelectedDataAsync = 29,

    DisplayReplyFormWithAttachments = 30,

    DisplayReplyAllFormWithAttachments = 31,

    SaveAsync = 32,

    AddNotificationMessageAsync = 33,

    GetAllNotificationMessagesAsync = 34,

    ReplaceNotificationMessageAsync = 35,

    RemoveNotificationMessageAsync = 36,

    GetBodyAsync = 37,

    SetBodyAsync = 38,

    RegisterConsentAsync = 40,

    Close = 41,

    CloseApp = 42,

    DisplayNewMessageForm = 44,

    EventCompleted = 94,

    CloseContainer = 97,

    GetAccessTokenAsync = 98,

    GetInitializationContextAsync = 99,

    AppendOnSendAsync = 100,

    GetRecurrenceAsync = 103,

    SetRecurrenceAsync = 104,

    GetFromAsync = 107,

    GetSharedPropertiesAsync = 108,

    MESSAGE_PARENT_DISPID = 144,

    SEND_MESSAGE_DIALOG_DISPID = 145,

    GetAttachmentsAsync = 149,

    AddBase64FileAttachmentAsync = 148,

    GetAttachmentContentAsync = 150,

    GetInternetHeadersAsync = 151,

    SetInternetHeadersAsync = 152,

    RemoveInternetHeadersAsync = 153,

    GetEnhancedLocationsAsync = 154,

    AddEnhancedLocationsAsync = 155,

    RemoveEnhancedLocationsAsync = 156,

    GetCategoriesAsync = 157,

    AddCategoriesAsync = 158,

    RemoveCategoriesAsync = 159,

    GetMasterCategoriesAsync = 160,

    AddMasterCategoriesAsync = 161,

    RemoveMasterCategoriesAsync = 162,

    GetItemIdAsync = 164,

    GetAllInternetHeadersAsync = 168,

    SaveSettingsRequest = 404,

    SetSignatureAsync = 173,

    GetComposeTypeAsync = 174,

    IsClientSignatureEnabledAsync = 175,

    DisableClientSignatureAsync = 176,

    displayNewAppointmentFormAsync = 177,

    displayNewMessageFormAsync = 178,

    displayMessageFormAsync = 179,

    displayAppointmentFormAsync = 180,

    displayReplyFormWithAttachmentsAsync = 181,

    displayReplyAllFormWithAttachmentsAsync = 182,

    displayReplyFormAsync = 183,

    displayReplyAllFormAsync = 184,

    setSessionDataAsync = 185,

    getSessionDataAsync = 186,

    getAllSessionDataAsync = 187,

    clearSessionDataAsync = 188,

    removeSessionDataAsync = 189,
}
