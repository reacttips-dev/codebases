import addItemCategoriesAsyncApiMethod from './categories/addItemCategoriesAsyncApiMethod';
import addEnhancedLocationsAsyncApiMethod from './location/addEnhancedLocationsAsyncApiMethod';
import addFileAttachmentAsyncApiMethod from './attachments/addFileAttachmentAsyncApiMethod';
import addItemAttachmentAsyncApiMethod from './attachments/addItemAttachmentAsyncApiMethod';
import addFileAttachmentFromBase64AsyncApiMethod from './attachments/addFileAttachmentFromBase64AsyncApiMethod';
import addMasterCategoriesAsyncApiMethod from './categories/addMasterCategoriesAsyncApiMethod';
import addNotificationMessageAsyncApiMethod from './notification/addNotificationMessageAsyncApiMethod';
import addRecipientsAsyncApiMethod from './recipients/addRecipientsAsyncApiMethod';
import appendOnSendAsyncApiMethod from './appendOnSend/appendOnSendAsyncApiMethod';
import setSessionDataAsyncApiMethod from './state/setSessionDataAsyncApiMethod';
import clearSessionDataAsyncApiMethod from './state/clearSessionDataAsyncApiMethod';
import removeSessionDataAsyncApiMethod from './state/removeSessionDataAsyncApiMethod';
import getAllSessionDataAsyncApiMethod from './state/getAllSessionDataAsyncApiMethod';
import getSessionDataAsyncApiMethod from './state/getSessionDataAsyncApiMethod';
import bodyPrependAsyncApiMethod from './body/bodyPrependAsyncApiMethod';
import closeApiMethod from './close/closeApiMethod';
import closeAppApiMethod from './close/closeAppApiMethod';
import displayAppointmentFormApiMethod from './display/displayAppointmentFormApiMethod';
import displayAppointmentFormAsyncApiMethod from './display/displayAppointmentFormAsyncApiMethod';
import displayMessageFormApiMethod from './display/displayMessageFormApiMethod';
import displayMessageFormAsyncApiMethod from './display/displayMessageFormAsyncApiMethod';
import displayNewAppointmentFormApiMethod from './display/displayNewAppointmentFormApiMethod';
import displayNewAppointmentFormAsyncApiMethod from './display/displayNewAppointmentFormAsyncApiMethod';
import displayNewMessageFormApiMethod from './display/displayNewMessageFormApiMethod';
import displayNewMessageFormAsyncApiMethod from './display/displayNewMessageFormAsyncApiMethod';
import displayReplyAllFormApiMethod from './display/displayReplyAllFormApiMethod';
import displayReplyAllFormAsyncApiMethod from './display/displayReplyAllFormAsyncApiMethod';
import displayReplyFormApiMethod from './display/displayReplyFormApiMethod';
import displayReplyFormAsyncApiMethod from './display/displayReplyFormAsyncApiMethod';
import eventCompletedApiMethod from './eventCompleted/eventCompletedApiMethod';
import ewsRequestApiMethod from './ews/ewsRequestApiMethod';
import getAccessTokenApiMethod from './sso/getAccessTokenApiMethod';
import getAllNotificationMessagesAsyncApiMethod from './notification/getAllNotificationMessagesAsyncApiMethod';
import getAttachmentContentAsyncApiMethod from './attachments/getAttachmentContentAsyncApiMethod';
import getAttachmentsAsyncApiMethod from './attachments/getAttachmentsAsyncApiMethod';
import getBodyAsyncApiMethod from './body/getBodyAsyncApiMethod';
import getBodyTypeAsyncApiMethod from './body/getBodyTypeAsyncApiMethod';
import getCallbackTokenApiMethod from './token/getCallbackTokenApiMethod';
import getItemCategoriesAsyncApiMethod from './categories/getItemCategoriesAsyncApiMethod';
import getEnhancedLocationsAsyncApiMethod from './location/getEnhancedLocationsAsyncApiMethod';
import getFromAsyncApiMethod from './from/getFromAsyncApiMethod';
import getInitialDataApiMethod from './getInitialData/getInitialDataApiMethod';
import getInitializationContextApiMethod from './getInitialData/getInitializationContextApiMethod';
import getInternetHeadersAsyncApiMethod from './internetHeaders/getInternetHeadersAsyncApiMethod';
import getAllInternetHeadersAsyncApiMethod from './internetHeaders/getAllInternetHeadersAsyncApiMethod';
import getItemIdAsyncApiMethod from './itemId/getItemIdAsyncApiMethod';
import getLocationAsyncApiMethod from './location/getLocationAsyncApiMethod';
import getMasterCategoryListAsyncApiMethod from './categories/getMasterCategoryListAsyncApiMethod';
import getRecipientsAsyncApiMethod from './recipients/getRecipientsAsyncApiMethod';
import getRecurrenceAsyncApiMethod from './recurrence/getRecurrenceAsyncApiMethod';
import getSelectedDataAsyncApiMethod from './selectedData/getSelectedDataAsyncApiMethod';
import getSharedPropertiesAsyncApiMethod from './sharedProperties/getSharedPropertiesApiMethod';
import getSubjectAsyncApiMethod from './subject/getSubjectAsyncApiMethod';
import getTimeAsyncApiMethod from './time/getTimeAsyncApiMethod';
import getUserIdentityTokenApiMethod from './token/getUserIdentityTokenApiMethod';
import loadCustomPropertiesApiMethod from './customProperties/loadCustomPropertiesApiMethod';
import messageParentApiMethod from './dialog/messageParentApiMethod';
import registerConsentAsyncApiMethod from './consent/registerConsentAsyncApiMethod';
import removeAttachmentAsyncApiMethod from './attachments/removeAttachmentAsyncApiMethod';
import removeItemCategoriesAsyncApiMethod from './categories/removeItemCategoriesAsyncApiMethod';
import removeEnhancedLocationsAsyncApiMethod from './location/removeEnhancedLocationsAsyncApiMethod';
import removeInternetHeadersAsyncApiMethod from './internetHeaders/removeInternetHeadersAsyncApiMethod';
import removeMasterCategoriesAsyncApiMethod from './categories/removeMasterCategoriesAsyncApiMethod';
import removeNotificationMessageAsyncApiMethod from './notification/removeNotificationMessageAsyncApiMethod';
import replaceNotificationMessageAsyncApiMethod from './notification/replaceNotificationMessageAsyncApiMethod';
import saveAsyncApiMethod from './save/saveAsyncApiMethod';
import saveCustomPropertiesApiMethod from './customProperties/saveCustomPropertiesApiMethod';
import saveSettingsRequestApiMethod from './settings/saveSettingsRequestApiMethod';
import setBodyAsyncApiMethod from './body/setBodyAsyncApiMethod';
import setBodySelectedDataAsyncApiMethod from './selectedData/setBodySelectedDataAsyncApiMethod';
import setInternetHeadersAsyncApiMethod from './internetHeaders/setInternetHeadersAsyncApiMethod';
import setLocationAsyncApiMethod from './location/setLocationAsyncApiMethod';
import setRecipientsAsyncApiMethod from './recipients/setRecipientsAsyncApiMethod';
import setRecurrenceAsyncApiMethod from './recurrence/setRecurrenceAsyncApiMethod';
import setSelectedDataAsyncApiMethod from './selectedData/setSelectedDataAsyncApiMethod';
import setSubjectAsyncApiMethod from './subject/setSubjectAsyncApiMethod';
import setTimeAsyncApiMethod from './time/setTimeAsyncApiMethod';
import getComposeTypeAsyncApiMethod from './signature/getComposeTypeAsyncApiMethod';
import setSignatureAsyncApiMethod from './signature/setSignatureAsyncApiMethod';
import disableClientSignatureAsyncApiMethod from './signature/disableClientSignatureAsyncApiMethod';
import isClientSignatureEnabledAsyncApiMethod from './signature/isClientSignatureEnabledAsyncApiMethod';
import RequestedCapabilities from 'owa-service/lib/contract/RequestedCapabilities';
import type { ApiMethodCallback } from './ApiMethod';
import { OutlookMethodDispId } from './OutlookMethodDispId';
import sendMessageApiMethod from './dialog/sendMessageApiMethod';

export interface ApiMethodDelegate {
    (
        hostItemIndex: string,
        controlId: string,
        data: any,
        createErrorResultToLog: ApiMethodCallback
    ): void;
}

export class ApiMethodInfo {
    apiMethodDelegate: ApiMethodDelegate;
    apiPermissionRequired: RequestedCapabilities;
    constructor(delegateValue: ApiMethodDelegate, permissionData: RequestedCapabilities) {
        this.apiMethodDelegate = delegateValue;
        this.apiPermissionRequired = permissionData;
    }
}

export const apiMethods: { [key: number]: ApiMethodInfo } = {
    //http://msitresearch/View.aspx?File=%2f%2fdepot%2fdevmain%2foutlookmac%2fsrc%2folkwebextensibility%2fsources%2fOutlookOSFOM.cp%2323&SDPort=OFFDEPOT1:4000
    [OutlookMethodDispId.GetInitialData]: new ApiMethodInfo(
        getInitialDataApiMethod,
        RequestedCapabilities.Restricted
    ),
    //https://docs.microsoft.com/en-us/office/dev/add-ins/reference/objectmodel/preview-requirement-set/office.context.mailbox#methods
    [OutlookMethodDispId.EwsRequest]: new ApiMethodInfo(
        ewsRequestApiMethod,
        RequestedCapabilities.ReadWriteMailbox
    ),
    //https://docs.microsoft.com/en-us/javascript/api/outlook/office.Recipients?view=outlook-js-preview#getasync-options--callback-
    [OutlookMethodDispId.GetRecipientsAsync]: new ApiMethodInfo(
        getRecipientsAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://docs.microsoft.com/en-us/javascript/api/outlook/office.Subject?view=outlook-js-preview#getasync-options--callback-
    [OutlookMethodDispId.GetSubjectAsync]: new ApiMethodInfo(
        getSubjectAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://docs.microsoft.com/en-us/javascript/api/outlook/office.Subject?view=outlook-js-preview#getasync-options--callback-
    [OutlookMethodDispId.SetSubjectAsync]: new ApiMethodInfo(
        setSubjectAsyncApiMethod,
        RequestedCapabilities.ReadWriteItem
    ),
    //https://docs.microsoft.com/en-us/javascript/api/outlook/office.Recipients?view=outlook-js-preview#getasync-options--callback-
    [OutlookMethodDispId.SetRecipientsAsync]: new ApiMethodInfo(
        setRecipientsAsyncApiMethod,
        RequestedCapabilities.ReadWriteItem
    ),
    //https://docs.microsoft.com/en-us/javascript/api/outlook/office.Recipients?view=outlook-js-preview#getasync-options--callback-
    [OutlookMethodDispId.AddRecipientsAsync]: new ApiMethodInfo(
        addRecipientsAsyncApiMethod,
        RequestedCapabilities.ReadWriteItem
    ),
    //Permission level not found
    [OutlookMethodDispId.SaveSettingsRequest]: new ApiMethodInfo(
        saveSettingsRequestApiMethod,
        RequestedCapabilities.Restricted
    ),
    //https://docs.microsoft.com/en-us/javascript/api/office/office.auth?view=word-js-preview#getaccesstokenasync-options--callback-
    [OutlookMethodDispId.GetAccessTokenAsync]: new ApiMethodInfo(
        getAccessTokenApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://docs.microsoft.com/en-us/office/dev/add-ins/reference/objectmodel/requirement-set-1.6/office.context.mailbox#methods
    [OutlookMethodDispId.GetCallbackToken]: new ApiMethodInfo(
        getCallbackTokenApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://docs.microsoft.com/en-us/office/dev/add-ins/reference/objectmodel/preview-requirement-set/office.context.mailbox#methods
    [OutlookMethodDispId.GetUserIdentityToken]: new ApiMethodInfo(
        getUserIdentityTokenApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //Permission level not found
    [OutlookMethodDispId.MESSAGE_PARENT_DISPID]: new ApiMethodInfo(
        messageParentApiMethod,
        RequestedCapabilities.Restricted
    ),
    //Permission level not found
    [OutlookMethodDispId.SEND_MESSAGE_DIALOG_DISPID]: new ApiMethodInfo(
        sendMessageApiMethod,
        RequestedCapabilities.Restricted
    ),

    //https://docs.microsoft.com/en-us/javascript/api/outlook/office.body?view=outlook-js-preview
    [OutlookMethodDispId.SetBodyAsync]: new ApiMethodInfo(
        setBodyAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://outlookweb.visualstudio.com/Outlook%20Web/_git/client-web/pullrequest/38325?_a=files&path=%2Fpackages%2Flibraries%2Faddins%2Fcirculardeps%2Fowa-addins-apis%2Flib%2Fapis%2Fbody%2FgetBodyAsyncApiMethod.ts&fullScreen=true
    [OutlookMethodDispId.GetBodyAsync]: new ApiMethodInfo(
        getBodyAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://outlookweb.visualstudio.com/Outlook%20Web/_git/client-web/pullrequest/38325?_a=files&path=%2Fpackages%2Flibraries%2Faddins%2Fcirculardeps%2Fowa-addins-apis%2Flib%2Fapis%2Fbody%2FgetBodyTypeAsyncApiMethod.ts&fullScreen=true
    [OutlookMethodDispId.GetBodyTypeAsync]: new ApiMethodInfo(
        getBodyTypeAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://outlookweb.visualstudio.com/Outlook%20Web/_git/client-web/pullrequest/38325?_a=files&path=%2Fpackages%2Flibraries%2Faddins%2Fcirculardeps%2Fowa-addins-apis%2Flib%2Fapis%2Fbody%2FbodyPrependAsyncApiMethod.ts&fullScreen=true
    [OutlookMethodDispId.BodyPrependAsync]: new ApiMethodInfo(
        bodyPrependAsyncApiMethod,
        RequestedCapabilities.ReadWriteItem
    ),
    //https://docs.microsoft.com/en-us/office/dev/add-ins/reference/objectmodel/requirement-set-1.5/office.context.mailbox.item
    [OutlookMethodDispId.Close]: new ApiMethodInfo(
        closeApiMethod,
        RequestedCapabilities.Restricted
    ),
    //Permission level not found
    [OutlookMethodDispId.CloseApp]: new ApiMethodInfo(
        closeAppApiMethod,
        RequestedCapabilities.Restricted
    ),
    //http://msitresearch/View.aspx?File=%2f%2fdepot%2fdevmain%2foutlookmac%2fsrc%2folkwebextensibility%2fsources%2fOutlookOSFOM.cp%2323&SDPort=OFFDEPOT1:4000
    [OutlookMethodDispId.CloseContainer]: new ApiMethodInfo(
        closeAppApiMethod,
        RequestedCapabilities.Restricted
    ),
    //https://docs.microsoft.com/en-us/office/dev/add-ins/reference/objectmodel/requirement-set-1.5/office.context.mailbox
    [OutlookMethodDispId.DisplayMessageForm]: new ApiMethodInfo(
        displayMessageFormApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://docs.microsoft.com/en-us/office/dev/add-ins/reference/objectmodel/requirement-set-1.5/office.context.mailbox
    [OutlookMethodDispId.displayMessageFormAsync]: new ApiMethodInfo(
        displayMessageFormAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://docs.microsoft.com/en-us/office/dev/add-ins/reference/objectmodel/requirement-set-1.5/office.context.mailbox.item
    [OutlookMethodDispId.DisplayReplyAllForm]: new ApiMethodInfo(
        displayReplyAllFormApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://docs.microsoft.com/en-us/office/dev/add-ins/reference/objectmodel/requirement-set-1.5/office.context.mailbox.item
    [OutlookMethodDispId.displayReplyAllFormAsync]: new ApiMethodInfo(
        displayReplyAllFormAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //http://msitresearch/View.aspx?File=%2f%2fdepot%2fdevmain%2foutlookmac%2fsrc%2folkwebextensibility%2fsources%2fOutlookOSFOM.cp%2323&SDPort=OFFDEPOT1:4000
    [OutlookMethodDispId.DisplayReplyAllFormWithAttachments]: new ApiMethodInfo(
        displayReplyAllFormApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //http://msitresearch/View.aspx?File=%2f%2fdepot%2fdevmain%2foutlookmac%2fsrc%2folkwebextensibility%2fsources%2fOutlookOSFOM.cp%2323&SDPort=OFFDEPOT1:4000
    [OutlookMethodDispId.displayReplyAllFormWithAttachmentsAsync]: new ApiMethodInfo(
        displayReplyAllFormAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://docs.microsoft.com/en-us/office/dev/add-ins/reference/objectmodel/requirement-set-1.5/office.context.mailbox.item
    [OutlookMethodDispId.DisplayReplyForm]: new ApiMethodInfo(
        displayReplyFormApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://docs.microsoft.com/en-us/office/dev/add-ins/reference/objectmodel/requirement-set-1.5/office.context.mailbox.item
    [OutlookMethodDispId.displayReplyFormAsync]: new ApiMethodInfo(
        displayReplyFormAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //http://msitresearch/View.aspx?File=%2f%2fdepot%2fdevmain%2foutlookmac%2fsrc%2folkwebextensibility%2fsources%2fOutlookOSFOM.cp%2323&SDPort=OFFDEPOT1:4000
    [OutlookMethodDispId.DisplayReplyFormWithAttachments]: new ApiMethodInfo(
        displayReplyFormApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //http://msitresearch/View.aspx?File=%2f%2fdepot%2fdevmain%2foutlookmac%2fsrc%2folkwebextensibility%2fsources%2fOutlookOSFOM.cp%2323&SDPort=OFFDEPOT1:4000
    [OutlookMethodDispId.displayReplyFormWithAttachmentsAsync]: new ApiMethodInfo(
        displayReplyFormAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://docs.microsoft.com/en-us/office/dev/add-ins/reference/objectmodel/requirement-set-1.5/office.context.mailbox
    [OutlookMethodDispId.DisplayAppointmentForm]: new ApiMethodInfo(
        displayAppointmentFormApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://docs.microsoft.com/en-us/office/dev/add-ins/reference/objectmodel/requirement-set-1.5/office.context.mailbox
    [OutlookMethodDispId.displayAppointmentFormAsync]: new ApiMethodInfo(
        displayAppointmentFormAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://docs.microsoft.com/en-us/office/dev/add-ins/reference/objectmodel/requirement-set-1.5/office.context.mailbox
    [OutlookMethodDispId.DisplayNewAppointmentForm]: new ApiMethodInfo(
        displayNewAppointmentFormApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://docs.microsoft.com/en-us/office/dev/add-ins/reference/objectmodel/requirement-set-1.5/office.context.mailbox
    [OutlookMethodDispId.displayNewAppointmentFormAsync]: new ApiMethodInfo(
        displayNewAppointmentFormAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://docs.microsoft.com/en-us/office/dev/add-ins/reference/objectmodel/requirement-set-1.6/office.context.mailbox#methods
    [OutlookMethodDispId.DisplayNewMessageForm]: new ApiMethodInfo(
        displayNewMessageFormApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://docs.microsoft.com/en-us/office/dev/add-ins/reference/objectmodel/requirement-set-1.6/office.context.mailbox#methods
    [OutlookMethodDispId.displayNewMessageFormAsync]: new ApiMethodInfo(
        displayNewMessageFormAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://docs.microsoft.com/en-us/javascript/api/office/office.addincommands.event?view=word-js-preview
    [OutlookMethodDispId.EventCompleted]: new ApiMethodInfo(
        eventCompletedApiMethod,
        RequestedCapabilities.Restricted
    ),
    //https://docs.microsoft.com/en-us/office/dev/add-ins/reference/objectmodel/requirement-set-1.5/office.context.mailbox.item
    [OutlookMethodDispId.GetSelectedDataAsync]: new ApiMethodInfo(
        getSelectedDataAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://docs.microsoft.com/en-us/office/dev/add-ins/reference/objectmodel/requirement-set-1.5/office.context.mailbox.item
    [OutlookMethodDispId.SetSelectedDataAsync]: new ApiMethodInfo(
        setSelectedDataAsyncApiMethod,
        RequestedCapabilities.ReadWriteItem
    ),
    //Permission level not found
    [OutlookMethodDispId.SetBodySelectedDataAsync]: new ApiMethodInfo(
        setBodySelectedDataAsyncApiMethod,
        RequestedCapabilities.Restricted
    ),
    //https://docs.microsoft.com/en-us/office/dev/add-ins/reference/objectmodel/requirement-set-1.5/office.context.mailbox.item
    [OutlookMethodDispId.SaveAsync]: new ApiMethodInfo(
        saveAsyncApiMethod,
        RequestedCapabilities.ReadWriteItem
    ),
    //https://docs.microsoft.com/en-us/javascript/api/outlook/office.customproperties?view=outlook-js-preview#get-name-
    [OutlookMethodDispId.LoadCustomProperties]: new ApiMethodInfo(
        loadCustomPropertiesApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://docs.microsoft.com/en-us/javascript/api/outlook/office.customproperties?view=outlook-js-preview#get-name-
    [OutlookMethodDispId.SaveCustomProperties]: new ApiMethodInfo(
        saveCustomPropertiesApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://docs.microsoft.com/en-us/javascript/api/outlook/office.notificationmessages?view=outlook-js-preview
    [OutlookMethodDispId.AddNotificationMessageAsync]: new ApiMethodInfo(
        addNotificationMessageAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://docs.microsoft.com/en-us/javascript/api/outlook/office.notificationmessages?view=outlook-js-preview
    [OutlookMethodDispId.GetAllNotificationMessagesAsync]: new ApiMethodInfo(
        getAllNotificationMessagesAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://docs.microsoft.com/en-us/javascript/api/outlook/office.notificationmessages?view=outlook-js-preview
    [OutlookMethodDispId.RemoveNotificationMessageAsync]: new ApiMethodInfo(
        removeNotificationMessageAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://docs.microsoft.com/en-us/javascript/api/outlook/office.notificationmessages?view=outlook-js-preview
    [OutlookMethodDispId.ReplaceNotificationMessageAsync]: new ApiMethodInfo(
        replaceNotificationMessageAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://outlookweb.visualstudio.com/Outlook%20Web/_git/client-web/pullrequest/38325?_a=files&path=%2Fpackages%2Flibraries%2Faddins%2Fcirculardeps%2Fowa-addins-apis%2Flib%2Fapis%2Fattachments%2FaddItemAttachmentAsyncApiMethod.ts&fullScreen=true
    [OutlookMethodDispId.AddItemAttachmentAsync]: new ApiMethodInfo(
        addItemAttachmentAsyncApiMethod,
        RequestedCapabilities.ReadWriteItem
    ),
    //https://outlookweb.visualstudio.com/Outlook%20Web/_git/client-web/pullrequest/38325?_a=files&path=%2Fpackages%2Flibraries%2Faddins%2Fcirculardeps%2Fowa-addins-apis%2Flib%2Fapis%2Fattachments%2FaddFileAttachmentAsyncApiMethod.ts&fullScreen=true
    [OutlookMethodDispId.AddFileAttachmentAsync]: new ApiMethodInfo(
        addFileAttachmentAsyncApiMethod,
        RequestedCapabilities.ReadWriteItem
    ),
    //https://outlookweb.visualstudio.com/Outlook%20Web/_git/client-web/pullrequest/38325?_a=files&path=%2Fpackages%2Flibraries%2Faddins%2Fcirculardeps%2Fowa-addins-apis%2Flib%2Fapis%2Fattachments%2FaddFileAttachmentFromBase64AsyncApiMethod.ts&fullScreen=true
    [OutlookMethodDispId.AddBase64FileAttachmentAsync]: new ApiMethodInfo(
        addFileAttachmentFromBase64AsyncApiMethod,
        RequestedCapabilities.ReadWriteItem
    ),
    //https://outlookweb.visualstudio.com/Outlook%20Web/_git/client-web/pullrequest/38325?_a=files&path=%2Fpackages%2Flibraries%2Faddins%2Fcirculardeps%2Fowa-addins-apis%2Flib%2Fapis%2Fattachments%2FremoveAttachmentAsyncApiMethod.ts&fullScreen=true
    [OutlookMethodDispId.RemoveAttachmentAsync]: new ApiMethodInfo(
        removeAttachmentAsyncApiMethod,
        RequestedCapabilities.ReadWriteItem
    ),
    //https://docs.microsoft.com/en-us/javascript/api/outlook/office.categories?view=outlook-js-preview
    [OutlookMethodDispId.GetCategoriesAsync]: new ApiMethodInfo(
        getItemCategoriesAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://docs.microsoft.com/en-us/javascript/api/outlook/office.categories?view=outlook-js-preview
    [OutlookMethodDispId.AddCategoriesAsync]: new ApiMethodInfo(
        addItemCategoriesAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://docs.microsoft.com/en-us/javascript/api/outlook/office.categories?view=outlook-js-preview
    [OutlookMethodDispId.RemoveCategoriesAsync]: new ApiMethodInfo(
        removeItemCategoriesAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://docs.microsoft.com/en-us/office/dev/add-ins/reference/objectmodel/preview-requirement-set/office.context.mailbox.item
    [OutlookMethodDispId.GetAttachmentContentAsync]: new ApiMethodInfo(
        getAttachmentContentAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://docs.microsoft.com/en-us/office/dev/add-ins/reference/objectmodel/preview-requirement-set/office.context.mailbox.item
    [OutlookMethodDispId.GetAttachmentsAsync]: new ApiMethodInfo(
        getAttachmentsAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //Permission level not found
    [OutlookMethodDispId.RegisterConsentAsync]: new ApiMethodInfo(
        registerConsentAsyncApiMethod,
        RequestedCapabilities.Restricted
    ),
    //http://msitresearch/View.aspx?File=%2f%2fdepot%2fdevmain%2foutlookmac%2fsrc%2folkwebextensibility%2fsources%2fOutlookOSFOM.cp%2323&SDPort=OFFDEPOT1:4000
    [OutlookMethodDispId.GetLocationAsync]: new ApiMethodInfo(
        getLocationAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //http://msitresearch/View.aspx?File=%2f%2fdepot%2fdevmain%2foutlookmac%2fsrc%2folkwebextensibility%2fsources%2fOutlookOSFOM.cp%2323&SDPort=OFFDEPOT1:4000
    [OutlookMethodDispId.SetLocationAsync]: new ApiMethodInfo(
        setLocationAsyncApiMethod,
        RequestedCapabilities.ReadWriteItem
    ),
    //http://msitresearch/View.aspx?File=%2f%2fdepot%2fdevmain%2foutlookmac%2fsrc%2folkwebextensibility%2fsources%2fOutlookOSFOM.cp%2323&SDPort=OFFDEPOT1:4000
    [OutlookMethodDispId.GetTimeAsync]: new ApiMethodInfo(
        getTimeAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //http://msitresearch/View.aspx?File=%2f%2fdepot%2fdevmain%2foutlookmac%2fsrc%2folkwebextensibility%2fsources%2fOutlookOSFOM.cp%2323&SDPort=OFFDEPOT1:4000
    [OutlookMethodDispId.SetTimeAsync]: new ApiMethodInfo(
        setTimeAsyncApiMethod,
        RequestedCapabilities.ReadWriteItem
    ),
    //https://docs.microsoft.com/en-us/office/dev/add-ins/reference/objectmodel/preview-requirement-set/office.context.mailbox.item
    [OutlookMethodDispId.GetInitializationContextAsync]: new ApiMethodInfo(
        getInitializationContextApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://docs.microsoft.com/en-us/office/dev/add-ins/reference/objectmodel/preview-requirement-set/office.context.mailbox.item
    [OutlookMethodDispId.GetFromAsync]: new ApiMethodInfo(
        getFromAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://docs.microsoft.com/en-us/office/dev/add-ins/reference/objectmodel/preview-requirement-set/office.context.mailbox.item
    [OutlookMethodDispId.GetSharedPropertiesAsync]: new ApiMethodInfo(
        getSharedPropertiesAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://docs.microsoft.com/en-us/javascript/api/outlook/office.recurrence?view=outlook-js-preview
    [OutlookMethodDispId.GetRecurrenceAsync]: new ApiMethodInfo(
        getRecurrenceAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //http://msitresearch/View.aspx?File=%2f%2fdepot%2fdevmain%2foutlookmac%2fsrc%2folkwebextensibility%2fsources%2fOutlookOSFOM.cp%2323&SDPort=OFFDEPOT1:4000
    [OutlookMethodDispId.SetRecurrenceAsync]: new ApiMethodInfo(
        setRecurrenceAsyncApiMethod,
        RequestedCapabilities.ReadWriteItem
    ),
    //https://docs.microsoft.com/en-us/javascript/api/outlook/office.internetheaders?view=outlook-js-preview
    [OutlookMethodDispId.GetInternetHeadersAsync]: new ApiMethodInfo(
        getInternetHeadersAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://docs.microsoft.com/en-us/javascript/api/outlook/office.internetheaders?view=outlook-js-preview
    [OutlookMethodDispId.SetInternetHeadersAsync]: new ApiMethodInfo(
        setInternetHeadersAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://docs.microsoft.com/en-us/javascript/api/outlook/office.internetheaders?view=outlook-js-preview
    [OutlookMethodDispId.RemoveInternetHeadersAsync]: new ApiMethodInfo(
        removeInternetHeadersAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    [OutlookMethodDispId.AppendOnSendAsync]: new ApiMethodInfo(
        appendOnSendAsyncApiMethod,
        RequestedCapabilities.ReadWriteItem
    ),
    //https://outlookweb.visualstudio.com/Outlook%20Web/_git/client-web/pullrequest/38325?_a=files&path=%2Fpackages%2Flibraries%2Faddins%2Fcirculardeps%2Fowa-addins-apis%2Flib%2Fapis%2Flocation%2FgetEnhancedLocationsAsyncApiMethod.ts&fullScreen=true
    [OutlookMethodDispId.GetEnhancedLocationsAsync]: new ApiMethodInfo(
        getEnhancedLocationsAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://outlookweb.visualstudio.com/Outlook%20Web/_git/client-web/pullrequest/38325?_a=files&path=%2Fpackages%2Flibraries%2Faddins%2Fcirculardeps%2Fowa-addins-apis%2Flib%2Fapis%2Flocation%2FaddEnhancedLocationsAsyncApiMethod.ts&fullScreen=true
    [OutlookMethodDispId.AddEnhancedLocationsAsync]: new ApiMethodInfo(
        addEnhancedLocationsAsyncApiMethod,
        RequestedCapabilities.ReadWriteItem
    ),
    //https://outlookweb.visualstudio.com/Outlook%20Web/_git/client-web/pullrequest/38325?_a=files&path=%2Fpackages%2Flibraries%2Faddins%2Fcirculardeps%2Fowa-addins-apis%2Flib%2Fapis%2Flocation%2FremoveEnhancedLocationsAsyncApiMethod.ts&fullScreen=true
    [OutlookMethodDispId.RemoveEnhancedLocationsAsync]: new ApiMethodInfo(
        removeEnhancedLocationsAsyncApiMethod,
        RequestedCapabilities.ReadWriteItem
    ),
    //https://docs.microsoft.com/en-us/javascript/api/outlook/office.mastercategories?view=outlook-js-preview
    [OutlookMethodDispId.GetMasterCategoriesAsync]: new ApiMethodInfo(
        getMasterCategoryListAsyncApiMethod,
        RequestedCapabilities.ReadWriteMailbox
    ),
    //https://docs.microsoft.com/en-us/javascript/api/outlook/office.mastercategories?view=outlook-js-preview
    [OutlookMethodDispId.AddMasterCategoriesAsync]: new ApiMethodInfo(
        addMasterCategoriesAsyncApiMethod,
        RequestedCapabilities.ReadWriteMailbox
    ),
    //https://docs.microsoft.com/en-us/javascript/api/outlook/office.mastercategories?view=outlook-js-preview
    [OutlookMethodDispId.RemoveMasterCategoriesAsync]: new ApiMethodInfo(
        removeMasterCategoriesAsyncApiMethod,
        RequestedCapabilities.ReadWriteMailbox
    ),
    //https://docs.microsoft.com/en-us/office/dev/add-ins/reference/objectmodel/preview-requirement-set/office.context.mailbox.item
    [OutlookMethodDispId.GetItemIdAsync]: new ApiMethodInfo(
        getItemIdAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    //https://docs.microsoft.com/en-us/javascript/api/outlook/office.messageread?view=outlook-js-preview#getallinternetheadersasync-options--callback-
    [OutlookMethodDispId.GetAllInternetHeadersAsync]: new ApiMethodInfo(
        getAllInternetHeadersAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    [OutlookMethodDispId.SetSignatureAsync]: new ApiMethodInfo(
        setSignatureAsyncApiMethod,
        RequestedCapabilities.ReadWriteItem
    ),
    [OutlookMethodDispId.GetComposeTypeAsync]: new ApiMethodInfo(
        getComposeTypeAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    [OutlookMethodDispId.IsClientSignatureEnabledAsync]: new ApiMethodInfo(
        isClientSignatureEnabledAsyncApiMethod,
        RequestedCapabilities.ReadItem
    ),
    [OutlookMethodDispId.DisableClientSignatureAsync]: new ApiMethodInfo(
        disableClientSignatureAsyncApiMethod,
        RequestedCapabilities.ReadWriteItem
    ),
    [OutlookMethodDispId.setSessionDataAsync]: new ApiMethodInfo(
        setSessionDataAsyncApiMethod,
        RequestedCapabilities.ReadWriteItem
    ),
    [OutlookMethodDispId.getSessionDataAsync]: new ApiMethodInfo(
        getSessionDataAsyncApiMethod,
        RequestedCapabilities.ReadWriteItem
    ),
    [OutlookMethodDispId.getAllSessionDataAsync]: new ApiMethodInfo(
        getAllSessionDataAsyncApiMethod,
        RequestedCapabilities.ReadWriteItem
    ),
    [OutlookMethodDispId.clearSessionDataAsync]: new ApiMethodInfo(
        clearSessionDataAsyncApiMethod,
        RequestedCapabilities.ReadWriteItem
    ),
    [OutlookMethodDispId.removeSessionDataAsync]: new ApiMethodInfo(
        removeSessionDataAsyncApiMethod,
        RequestedCapabilities.ReadWriteItem
    ),
};
