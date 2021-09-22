import WebSessionType from 'owa-service/lib/contract/WebSessionType';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

export function getUserTypeString(): string {
    return getTypeStringFromType();
}

function getTypeStringFromType(): string {
    const userType = getUserConfiguration().SessionSettings?.WebSessionType;
    if (userType === WebSessionType.ExoConsumer) {
        return 'outlookCom';
    }
    if (userType === WebSessionType.GMail) {
        return 'gmail';
    }
    if (userType == WebSessionType.Business) {
        return 'office365';
    }

    return 'unknown';
}
