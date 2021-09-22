export default function extractFlightsFromSettings(settings: any): string[] {
    if (!settings) {
        return [];
    }

    let flights = [];
    [
        'addin',
        'an',
        'auth',
        'cal',
        'cmp',
        'doc',
        'eventify',
        'fms',
        'fwk',
        'getstarted',
        'grp',
        'gsx',
        'help',
        'honeybee',
        'inline',
        'iris',
        'lightning',
        'lpc',
        'mc',
        'notes',
        'nps',
        'outlookSpaces',
        'spaces',
        'peo',
        'people',
        'mc',
        'platform',
        'rp',
        'sea',
        'sxs',
        'todo',
        'tra',
        'tri',
        'sig',
        'mon',
        'usv',
        'woven',
    ].forEach(prefix => {
        Object.keys(settings[prefix] || {}).forEach(key => {
            if (settings[prefix][key] === true) {
                flights.push(`${prefix}-${key}`);
            }
        });
    });

    return flights;
}
