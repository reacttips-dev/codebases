import { lazyIdpResponseHandler } from 'owa-link-account';
import { format } from 'owa-localize';

export interface QRCodeUrlParams {
    client_id: string;
    target_client_id: string;
    redirect_uri: string;
    cobrand_id: string;
    authorization_uri: string;
    scope?: string;
    mkt?: string;
    response_type?: string;
    qrCode?: boolean;
    slice?: string;
    dc?: string;
}

export function getPopupWindowProps(): string {
    let props: any = {
        resizable: 0,
        scrollbars: 0,
        width: 550,
        height: 600,
    };
    let documentElement = document.documentElement;
    let height = screen.height || window.innerHeight || documentElement.clientHeight;
    props.top = (height - props.height) / 2;
    let width = screen.width || window.innerWidth || documentElement.clientWidth;
    props.left = (width - props.width) / 2;

    return Object.keys(props)
        .map(key => `${key}=${props[key]}`)
        .join(',');
}

export function getQRCodeUrl(params: QRCodeUrlParams): string {
    let queryParams = Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join('&');

    return format('{0}?{1}', params.authorization_uri, queryParams);
}

export function initReponseHandler() {
    if (typeof window !== 'undefined' && typeof window.Owa !== 'undefined') {
        window.Owa.lazyIdpResponseHandler = lazyIdpResponseHandler;
    }
}
