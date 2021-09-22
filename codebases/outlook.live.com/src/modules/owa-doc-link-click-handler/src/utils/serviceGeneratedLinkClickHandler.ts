import { PerformanceDatapoint } from 'owa-analytics';
import { getGuid } from 'owa-guid';
import { ORIGINALSRC_ATTTIBUTE_NAME, RESERVED_PARAM } from 'owa-safelinks-evaluator';
import logSharePointLinkClick from './logSharePointLinkClick';
import { lazyIsSharePointServiceGeneratedLink } from 'owa-sharepoint-link-detector';
import forceGetWacInfoOperation from './forceGetWacInfoOperation';

export default function serviceGeneratedLinkClickHandler(
    ev: MouseEvent,
    isSafeLinkWrapped: boolean,
    isSafeLinkVerified: boolean,
    newTabReason: string
) {
    const clickTime = Date.now();
    const perfDatapoint = new PerformanceDatapoint('ServiceGeneratedLinkClickHandler');
    const scenario = !ev ? 'NT' : ev.ctrlKey || ev.button === 1 ? 'NTB' : ev.shiftKey ? 'NW' : 'NT';
    const xdata = `CT=${clickTime}&OR=OWA-${scenario}&CID=${getGuid()}`;
    let windowOpenUrl: string;

    const anchorElement = <HTMLAnchorElement>ev.currentTarget;
    const anchorUrl = DeleteTrackingParameters(new URL(anchorElement.href));
    if (isSafeLinkWrapped) {
        const safelinkUrl = anchorUrl.href;
        const reservedIndex = safelinkUrl.indexOf(RESERVED_PARAM);
        if (reservedIndex === -1) {
            // cannot find the reserved param, don't do anything
            return;
        }

        const xdataEncoded = encodeURIComponent(btoa(xdata));
        const modifiedSafelinkUrl =
            safelinkUrl.substr(0, reservedIndex) + '&xdata=' + xdataEncoded + RESERVED_PARAM;
        windowOpenUrl = modifiedSafelinkUrl;
    } else {
        const queryParameterSeparator = anchorUrl.href.indexOf('?') >= 0 ? '&' : '?';
        const urlWithParameters = anchorUrl.href + queryParameterSeparator + xdata;
        windowOpenUrl = urlWithParameters;
    }

    perfDatapoint.end();
    window.open(windowOpenUrl);
    ev.preventDefault();

    const extraFileInfo: { fileExt: string } = { fileExt: '' };
    forceGetWacInfoOperation(
        isSafeLinkWrapped
            ? anchorElement.getAttribute(ORIGINALSRC_ATTTIBUTE_NAME)
            : anchorUrl.toString(),
        true,
        true,
        extraFileInfo
    ).then(docLinkPreviewInfo => {
        lazyIsSharePointServiceGeneratedLink.import().then(isSharePointServiceGeneratedLink => {
            logSharePointLinkClick(
                !!newTabReason
                    ? newTabReason
                    : ev.altKey
                    ? 'AltKey'
                    : ev.ctrlKey
                    ? 'CtrlKey'
                    : ev.metaKey
                    ? 'MetaKey'
                    : ev.shiftKey
                    ? 'ShiftKey'
                    : 'Default',
                isSafeLinkWrapped,
                isSafeLinkVerified,
                undefined,
                undefined,
                isSafeLinkWrapped
                    ? isSharePointServiceGeneratedLink(
                          anchorElement.getAttribute(ORIGINALSRC_ATTTIBUTE_NAME)
                      )
                    : isSharePointServiceGeneratedLink(anchorUrl.toString()),
                extraFileInfo.fileExt
            );
        });
    });
}

function DeleteTrackingParameters(url: URL): URL {
    const trackingParams: string[] = ['CID', 'OR', 'CT'];
    trackingParams.forEach(p => {
        if (url.searchParams?.get(p)) {
            url.searchParams.delete(p);
        }
    });
    return url;
}
