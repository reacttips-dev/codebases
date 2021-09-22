import type IconIndexType from 'owa-service/lib/contract/IconIndexType';
import PropertyIcons from './PropertyIcons';

function getNoteClassPropertyIconMap(): {} {
    const propertyIconMap: { [iconIndex: string]: PropertyIcons } = {};
    propertyIconMap['MailReplied'.toString()] = PropertyIcons.MailListViewReplied;
    propertyIconMap['MailForwarded'.toString()] = PropertyIcons.MailListViewForwarded;
    propertyIconMap['MailIrm'.toString()] = PropertyIcons.MailListViewIRM;
    propertyIconMap['MailIrmReplied'.toString()] = PropertyIcons.MailListViewIRMReplied;
    propertyIconMap['MailIrmForwarded'.toString()] = PropertyIcons.MailListViewIRMForwarded;
    return propertyIconMap;
}

export let noteClassPropertyIconMap = getNoteClassPropertyIconMap();

function getNoteIrmClassPropertyIconMap(): {} {
    const propertyIconMap: { [iconIndex: string]: PropertyIcons } = {};
    propertyIconMap['MailReplied'.toString()] = PropertyIcons.MailListViewIRMReplied;
    propertyIconMap['MailForwarded'.toString()] = PropertyIcons.MailListViewIRMForwarded;
    propertyIconMap['Default'.toString()] = PropertyIcons.MailListViewIRM;
    propertyIconMap['MailIrmReplied'.toString()] = PropertyIcons.MailListViewIRMReplied;
    propertyIconMap['MailIrmForwarded'.toString()] = PropertyIcons.MailListViewIRMForwarded;
    return propertyIconMap;
}

function getNoteVoiceMailClassPropertyIconMap(): {} {
    const propertyIconMap: { [iconIndex: string]: PropertyIcons } = {};
    propertyIconMap['MailReplied'.toString()] = PropertyIcons.MailListViewVoiceMailReplied;
    propertyIconMap['MailForwarded'.toString()] = PropertyIcons.MailListViewVoiceMailForwarded;
    propertyIconMap['Default'.toString()] = PropertyIcons.MailListViewVoiceMailItem;
    return propertyIconMap;
}

function getNoteRpmsgVoiceMailClassPropertyIconMap(): {} {
    const propertyIconMap: { [iconIndex: string]: PropertyIcons } = {};
    propertyIconMap['MailReplied'.toString()] = PropertyIcons.MailListViewVoiceMailIRM;
    propertyIconMap['Default'.toString()] = PropertyIcons.MailListViewVoiceMailIRM;
    return propertyIconMap;
}

function getItemClassToPropertyIconsMap(): {} {
    const itemClassToPropertyIconsMap: { [id: string]: {} } = {};
    itemClassToPropertyIconsMap['ipm.note'] = noteClassPropertyIconMap;
    itemClassToPropertyIconsMap['ipm.note.irm'] = getNoteIrmClassPropertyIconMap();
    itemClassToPropertyIconsMap[
        'ipm.note.microsoft.exchange.voice.um.ca'
    ] = getNoteVoiceMailClassPropertyIconMap();
    itemClassToPropertyIconsMap[
        'ipm.note.microsoft.exchange.voice.um'
    ] = getNoteVoiceMailClassPropertyIconMap();
    itemClassToPropertyIconsMap[
        'ipm.note.microsoft.voicemail.um.ca'
    ] = getNoteVoiceMailClassPropertyIconMap();
    itemClassToPropertyIconsMap[
        'ipm.note.microsoft.voicemail.um'
    ] = getNoteVoiceMailClassPropertyIconMap();
    itemClassToPropertyIconsMap[
        'ipm.note.rpmsg.microsoft.voicemail.um.ca'
    ] = getNoteRpmsgVoiceMailClassPropertyIconMap();
    itemClassToPropertyIconsMap[
        'ipm.note.rpmsg.microsoft.voicemail.um'
    ] = getNoteRpmsgVoiceMailClassPropertyIconMap();

    let propertyIconMap: { [iconIndex: string]: PropertyIcons } = {};
    propertyIconMap['Default'.toString()] = PropertyIcons.MailListViewFaxItem;

    itemClassToPropertyIconsMap['ipm.note.microsoft.exchange.fax.ca'] = propertyIconMap;
    itemClassToPropertyIconsMap['ipm.note.microsoft.exchange.fax.um.ca'] = propertyIconMap;
    itemClassToPropertyIconsMap['ipm.note.microsoft.fax.ca'] = propertyIconMap;

    propertyIconMap = {};
    propertyIconMap['Default'.toString()] = PropertyIcons.MailListViewAppointmentItem;
    itemClassToPropertyIconsMap['ipm.appointment'] = propertyIconMap;
    itemClassToPropertyIconsMap['ipm.schedule.meeting.request'] = propertyIconMap;

    propertyIconMap = {};
    propertyIconMap['AppointmentMeetCancel'.toString()] =
        PropertyIcons.MailListViewAppointmentCanceled;
    propertyIconMap['Default'.toString()] = PropertyIcons.MailListViewAppointmentCanceled;
    itemClassToPropertyIconsMap['ipm.schedule.meeting.canceled'] = propertyIconMap;

    propertyIconMap = {};
    propertyIconMap['Default'.toString()] = PropertyIcons.MailListViewContactItem;
    itemClassToPropertyIconsMap['ipm.contact'] = propertyIconMap;
    itemClassToPropertyIconsMap['ipm.distlist'] = propertyIconMap;

    propertyIconMap = {};
    propertyIconMap['TaskRecur'.toString()] = PropertyIcons.MailListViewTaskReocurItem;
    propertyIconMap['TaskItem'.toString()] = PropertyIcons.MailListViewTaskItem;
    propertyIconMap['TaskOwned'.toString()] = PropertyIcons.MailListViewTaskItem;
    propertyIconMap['TaskDelegated'.toString()] = PropertyIcons.MailListViewTaskItem;
    propertyIconMap['Default'.toString()] = PropertyIcons.MailListViewTaskItem;
    itemClassToPropertyIconsMap['ipm.task'] = propertyIconMap;

    propertyIconMap = {};
    propertyIconMap['Default'.toString()] = PropertyIcons.MailListViewJournalItem;
    itemClassToPropertyIconsMap['ipm.activity'] = propertyIconMap;

    propertyIconMap = {};
    propertyIconMap['Default'.toString()] = PropertyIcons.MailListViewPostItem;
    itemClassToPropertyIconsMap['ipm.post'] = propertyIconMap;

    propertyIconMap = {};
    propertyIconMap['Default'.toString()] = PropertyIcons.MailListViewNoteItem;
    itemClassToPropertyIconsMap['ipm.stickynote'] = propertyIconMap;

    propertyIconMap = {};
    propertyIconMap['Default'.toString()] = PropertyIcons.MailListViewNonDelivery;
    itemClassToPropertyIconsMap['report.ipm.note.ndr'] = propertyIconMap;
    itemClassToPropertyIconsMap['report.ipm.ndr'] = propertyIconMap;
    itemClassToPropertyIconsMap['report.ipm.note.mobile.sms.ndr'] = propertyIconMap;
    itemClassToPropertyIconsMap['report.ipm.schedule.meeting.resp.neg.ndr'] = propertyIconMap;
    itemClassToPropertyIconsMap['report.ipm.schedule.meeting.resp.pos.ndr'] = propertyIconMap;
    itemClassToPropertyIconsMap['report.ipm.schedule.meeting.resp.tent.ndr'] = propertyIconMap;
    itemClassToPropertyIconsMap['report.ipm.taskrequest.ndr'] = propertyIconMap;
    itemClassToPropertyIconsMap['report.ipm.oof.ndr'] = propertyIconMap;
    itemClassToPropertyIconsMap['report.report.ipm.note.ipnnrn.ndr'] = propertyIconMap;
    itemClassToPropertyIconsMap['report.ipm.note.smime.ndr'] = propertyIconMap;
    itemClassToPropertyIconsMap['report.ipm.note.smime.multipartsigned.ndr'] = propertyIconMap;

    propertyIconMap = {};
    propertyIconMap['Default'.toString()] = PropertyIcons.MailListViewDelivery;
    itemClassToPropertyIconsMap['report.ipm.note.dr'] = propertyIconMap;
    itemClassToPropertyIconsMap['report.ipm.dr'] = propertyIconMap;
    itemClassToPropertyIconsMap['report.ipm.schedule.meeting.request.dr'] = propertyIconMap;
    itemClassToPropertyIconsMap['report.ipm.note.smime.dr'] = propertyIconMap;
    itemClassToPropertyIconsMap['report.ipm.note.smime.multipartsigned.dr'] = propertyIconMap;

    propertyIconMap = {};
    propertyIconMap['Default'.toString()] = PropertyIcons.MailListViewApprovalRequest;
    itemClassToPropertyIconsMap['ipm.note.microsoft.approval.request'] = propertyIconMap;

    propertyIconMap = {};
    propertyIconMap['Default'.toString()] = PropertyIcons.MailListViewResponseApprove;
    itemClassToPropertyIconsMap['ipm.note.microsoft.approval.reply.approve'] = propertyIconMap;

    propertyIconMap = {};
    propertyIconMap['Default'.toString()] = PropertyIcons.MailListViewResponseReject;
    itemClassToPropertyIconsMap['ipm.note.microsoft.approval.reply.reject'] = propertyIconMap;

    propertyIconMap = {};
    propertyIconMap['Default'.toString()] = PropertyIcons.MailListViewOutOfOffice;
    itemClassToPropertyIconsMap['ipm.note.rules.ooftemplate.microsoft'] = propertyIconMap;

    propertyIconMap = {};
    propertyIconMap['Default'.toString()] = PropertyIcons.MailListViewReadReport;
    itemClassToPropertyIconsMap['report.ipm.note.ipnrn'] = propertyIconMap;

    propertyIconMap = {};
    propertyIconMap['Default'.toString()] = PropertyIcons.MailListViewReminderMessage;
    itemClassToPropertyIconsMap['ipm.note.reminder.event'] = propertyIconMap;

    return itemClassToPropertyIconsMap;
}

const itemClassToPropertyIconsMap = getItemClassToPropertyIconsMap();

function getPrefixToPropertyIconMap(): {} {
    const prefixToPropertyIconMap: { [id: string]: {} } = {};

    let propertyIconMap: { [iconIndex: string]: PropertyIcons } = {};
    propertyIconMap['AppointmentMeetYes'.toString()] =
        PropertyIcons.MailListViewAppointmentAccepted;
    propertyIconMap['Default'.toString()] = PropertyIcons.MailListViewAppointmentAccepted;
    prefixToPropertyIconMap['ipm.schedule.meeting.resp.pos'] = propertyIconMap;

    propertyIconMap = {};
    propertyIconMap['AppointmentMeetMaybe'.toString()] =
        PropertyIcons.MailListViewAppointmentTentative;
    propertyIconMap['Default'.toString()] = PropertyIcons.MailListViewAppointmentTentative;
    prefixToPropertyIconMap['ipm.schedule.meeting.resp.tent'] = propertyIconMap;

    propertyIconMap = {};
    propertyIconMap['AppointmentMeetNo'.toString()] = PropertyIcons.MailListViewAppointmentDeclined;
    propertyIconMap['Default'.toString()] = PropertyIcons.MailListViewAppointmentDeclined;
    prefixToPropertyIconMap['ipm.schedule.meeting.resp.neg'] = propertyIconMap;
    return prefixToPropertyIconMap;
}

const itemClassPrefixToPropertyIconMap = getPrefixToPropertyIconMap();

// Full match
function lookupPropertyIconByFullMatchInMap(
    itemClassToPropertyIconMap: {},
    itemClass: string,
    iconIndex: IconIndexType
): PropertyIcons {
    const iconMap = itemClassToPropertyIconMap[itemClass];

    if (iconMap?.[iconIndex]) {
        return iconMap[iconIndex.toString()];
    }
    return PropertyIcons.None;
}

// Prefix match
function lookupPropertyIconByMatchingPrefix(
    itemClass: string,
    iconIndex: IconIndexType
): PropertyIcons {
    const propertyIcon: PropertyIcons = lookupPropertyIconByFullMatchInMap(
        itemClassPrefixToPropertyIconMap,
        itemClass,
        iconIndex
    );
    if (propertyIcon == PropertyIcons.None) {
        Object.keys(itemClassPrefixToPropertyIconMap).forEach(map => {
            if (itemClass.indexOf(map) == 0) {
                // if we find the prefix class entry
                if (map[iconIndex.toString()]) {
                    return map[iconIndex.toString()];
                }
            }
        });
    }

    return propertyIcon;
}

export default function getPropertyIconPerItemClass(
    itemClass: string,
    iconIndex: IconIndexType
): PropertyIcons {
    if (!iconIndex) {
        iconIndex = 'Default';
    }

    if (!itemClass) {
        return PropertyIcons.None;
    }

    itemClass = itemClass.toLowerCase();

    // 1. Try to find an exact match for the given item class and icon index
    let icon: PropertyIcons = lookupPropertyIconByFullMatchInMap(
        itemClassToPropertyIconsMap,
        itemClass,
        iconIndex
    );

    // 2. if that didn't find a match, try the same item class but replace icon index with default
    if (icon == PropertyIcons.None) {
        icon = lookupPropertyIconByFullMatchInMap(
            itemClassToPropertyIconsMap,
            itemClass,
            'Default'
        );
    }

    // 3. do the prefix match
    if (icon === PropertyIcons.None) {
        icon = lookupPropertyIconByMatchingPrefix(itemClass, iconIndex);
    }

    // 4. do the prefix match with default icon index
    if (icon === PropertyIcons.None) {
        icon = lookupPropertyIconByMatchingPrefix(itemClass, 'Default');
    }

    return icon;
}
