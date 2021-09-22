import type { BootResult } from './interfaces/BootResult';
import type BootError from './interfaces/BootError';
import type ErrorDiagnostics from './interfaces/ErrorDiagnostics';
import { getClientId, getSessionId, getClientVersion } from 'owa-config';
import { getQueryStringParameter, getQueryStringParameters, stringify } from 'owa-querystring';

const blueColor = '#0078D4';
const greyColor = '#333';
const fewerDetailsString = 'Fewer Details';
const semiboldFont =
    "'Segoe UI WestEuropean', 'Segoe UI Semibold', 'Segoe WP Semibold', 'Segoe UI', 'Segoe WP', Tahoma, Arial, sans-serif'";

export default function handleErrorLocally(
    bootResult: BootResult,
    error: BootError,
    errorDiagnostics: ErrorDiagnostics
) {
    const container = createDiv({
        position: 'absolute',
        left: '340px',
        top: '40px',
    });

    // grab the logo from the loading screen. We will reuse this svg
    const logo = document.getElementById('loadingLogo');
    if (logo) {
        logo.remove();
        applyStyles(logo, {
            position: 'initial',
            width: '56px',
            height: '56px',
        });
        container.appendChild(logo);
    }

    // dismiss the loading screen so we can show the error page
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.remove();
    }

    addDiv(
        container,
        { fontSize: '40px', color: blueColor, 'margin-top': '28px' },
        'Something went wrong.'
    );
    addDiv(
        container,
        {
            fontSize: '16px',
            'font-family': semiboldFont,
            margin: '20px 0',
            'font-weight': '600',
            color: greyColor,
        },
        'Please try again later.'
    );

    const span = document.createElement('span');
    applyStyles(span, {
        margin: '0 4px',
        'font-size': '14px',
        'line-height': '19px',
    });
    span.innerText = 'Refresh the page';
    const refresh = document.createElement('button');
    applyStyles(refresh, {
        color: 'white',
        'background-color': blueColor,
        cursor: 'pointer',
        padding: '0 16px',
        'min-width': '80px',
        'border-radius': '2px',
        'min-height': '32px',
        border: '1px solid ' + blueColor,
        'font-weight': '600',
        'font-family': semiboldFont,
        'line-height': '19px',
    });
    refresh.appendChild(span);
    container.appendChild(refresh);

    const detailsDiv = addDiv(
        container,
        {
            fontSize: '14px',
            color: blueColor,
            cursor: 'pointer',
            'font-family': semiboldFont,
            'line-height': '19px',
            'font-weight': '600',
            margin: '20px 0',
        },
        fewerDetailsString
    );

    const details: string[] = [
        `UTC Date: ${new Date().toISOString()}`,
        'BootResult: ' + bootResult,
        'Client Id: ' + getClientId(),
        'Session Id: ' + getSessionId(),
        'Client Version: ' + getClientVersion(),
        'Native Host Version:' + getQueryStringParameter('nativeVersion'),
        'Native Hx Version: ' + getQueryStringParameter('hxVersion'),
    ].concat(
        Object.keys(errorDiagnostics)
            .filter(k => errorDiagnostics[k])
            .map(k => k + ': ' + errorDiagnostics[k])
    );

    if (process.env.__HX_Version__) {
        details.push('Client Hx Version: ' + process.env.__HX_Version__);
    }

    const errorContainer = document.createElement('pre');
    errorContainer.innerText = details.join('\n');
    applyStyles(errorContainer, {
        color: greyColor,
        'user-select': 'all',
    });

    container.appendChild(errorContainer);

    // Add click listeners
    detailsDiv.addEventListener('click', () => {
        const isFewerDetails = detailsDiv.innerText == fewerDetailsString;
        detailsDiv.innerText = isFewerDetails ? 'More Details' : fewerDetailsString;
        errorContainer.style.display = isFewerDetails ? 'none' : '';
    });
    const location = window.location;
    refresh.addEventListener('click', () => {
        // add native query string parameter to ensure we get the correct index page
        const params = getQueryStringParameters(location);
        params.native = '';
        location.search = `?${stringify(params)}`;
    });

    document.getElementById('app')!.appendChild(container);
}

function addDiv(container: HTMLDivElement, styles: { [style: string]: string }, text?: string) {
    const div = createDiv(styles);
    if (text) {
        div.innerText = text;
    }
    container.appendChild(div);
    return div;
}

function createDiv(styles: { [style: string]: string }) {
    const div = document.createElement('div')!;
    applyStyles(div, styles);
    return div;
}

function applyStyles(elem: HTMLElement, styles: { [style: string]: string }) {
    for (const s of Object.keys(styles)) {
        elem.style[s] = styles[s];
    }
}
