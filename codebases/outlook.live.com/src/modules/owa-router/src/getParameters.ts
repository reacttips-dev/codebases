export interface NamedParameters {
    [K: string]: string;
}

export interface Parameters {
    all: string[];
    named: NamedParameters;
}

export default function getParameters(route: string, args: any[]): Parameters {
    const allParameterValues: string[] = [];

    for (let i = 0; i < args.length; ++i) {
        allParameterValues.push(decodeURIComponent(args[i]));
    }

    let i = 0;
    const segments = route.split('/');
    const parameters: NamedParameters = {};
    for (const pathSegment of segments) {
        if (pathSegment.length > 0 && pathSegment.charAt(0) == ':') {
            parameters[pathSegment.substr(1)] = allParameterValues[i++];
        }
    }

    return {
        all: allParameterValues,
        named: parameters,
    };
}
