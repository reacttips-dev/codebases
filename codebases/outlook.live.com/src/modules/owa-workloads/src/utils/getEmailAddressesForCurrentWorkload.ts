import OwaWorkload from '../store/schema/OwaWorkload';
import getOwaWorkload from '../selectors/getOwaWorkload';

export default function getEmailAddressesForCurrentWorkload(): string[] {
    let currentWorkload = getOwaWorkload();
    switch (currentWorkload) {
        case OwaWorkload.Mail:
        case OwaWorkload.PhotoHub:
        case OwaWorkload.OfficeSidebar:
        case OwaWorkload.All:
        case OwaWorkload.None:
            return ['outlookweberrors@microsoft.com'];
        case OwaWorkload.Calendar:
            return [
                'outlookweberrors@microsoft.com',
                'calendarreactfeedback@service.microsoft.com',
            ];
        case OwaWorkload.People:
            return ['outlookweberrors@microsoft.com', 'Opfeedbackoc@service.microsoft.com'];
        case OwaWorkload.Spaces:
            return ['spacesteam@service.microsoft.com'];
        case OwaWorkload.Eventify:
            return ['eventifyfeedback@microsoft.com'];
        case OwaWorkload.OrgExplorer:
            return ['orgxfeedback@microsoft.com'];
        default:
            return ['outlookweberrors@microsoft.com'];
    }
}
