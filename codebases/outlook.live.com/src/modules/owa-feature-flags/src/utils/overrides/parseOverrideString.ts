export default function parseOverrideString(override: string): { [index: string]: boolean } {
    let overrides = {};

    override.split(',').forEach(override => {
        // default on, case where there is no qualifier
        let enabled = true;

        // if there is a qualifier, then remove it and set enabled bit based on it
        if (override.indexOf('-') === 0) {
            enabled = false;
            override = override.slice(1, override.length);
        }

        overrides[override.toLowerCase()] = enabled;
    });

    return overrides;
}
