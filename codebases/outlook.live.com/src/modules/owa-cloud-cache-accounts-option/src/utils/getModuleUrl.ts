import WebSessionType from 'owa-service/lib/contract/WebSessionType';
import getRootVdirName from 'owa-url/lib/getRootVdirName';

export function getModuleUrl(sessionType: WebSessionType): string {
    return (
        window.location.origin +
        '/' +
        getRootVdirName() +
        getPathWithIndex(sessionType) +
        '?bO=5&nlp=1&isc=' +
        sessionType
    );
}

export function getModuleUrlForNewAccount(sessionType: WebSessionType): string {
    return getModuleUrl(WebSessionType.GMail) + '&nojit=2';
}

function getPathWithIndex(sessionType: WebSessionType): string {
    switch (sessionType) {
        case WebSessionType.ExoConsumer:
            return '/0/';
        case WebSessionType.GMail:
            return '/1/';
        default:
            return '';
    }
}
