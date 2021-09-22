import { calculateBootType } from './calculateBootType';

interface EnvDiagnostics {
    fe?: string; // Web Service FE Server
    be?: string; // Web Service BE Server
    wsver?: string; // Web Service Version
    te?: string; // Through Edge
    bt?: string; // Boot Type
    dag?: string; // The Dag name
    fost?: string; // The forest name
}

// This is only called in the index.html case
let diagnostics: EnvDiagnostics = {};
export function updateDiagnosticsOnReponse(response: Response) {
    updateField('fe', response, 'X-FEServer');
    updateField('be', response, 'X-BEServer');
    updateField('wsver', response, 'X-OWA-Version');
    updateField('fost', response, 'x-owa-forest', val =>
        val.toLowerCase().indexOf('prod') == 0
            ? 'NAMPRD01'
            : val.substr(0, val.indexOf('.')).toUpperCase()
    );
    updateField('dag', response, 'x-owa-dag', val => val.toUpperCase());

    if (!diagnostics.te && response && response.headers) {
        diagnostics.te = response.headers.get('X-MSEdge-Ref') ? '1' : '0';
    }
}

function updateField(
    key: keyof EnvDiagnostics,
    response: Response,
    header: string,
    postProcess?: (value: string) => string
) {
    if (!diagnostics[key]) {
        const value = response?.headers?.get?.(header);
        if (value) {
            diagnostics[key] = postProcess ? postProcess(value) : value;
        } else {
            diagnostics[key] = 'Unknown';
        }
    }
}

export function getBackend() {
    return diagnostics.be;
}

export function getFrontend() {
    return diagnostics.fe;
}

export function getThroughEdge() {
    return diagnostics.te;
}

export function getServerVersion() {
    return diagnostics.wsver;
}

export function getDag() {
    return diagnostics.dag;
}

export function getForest() {
    return diagnostics.fost;
}

export async function getBootType() {
    let bootType = diagnostics.bt;
    if (!bootType && window.performance && window.performance.timing) {
        bootType = diagnostics.bt = await calculateBootType(window.performance.timing.fetchStart);
    }
    return bootType;
}
