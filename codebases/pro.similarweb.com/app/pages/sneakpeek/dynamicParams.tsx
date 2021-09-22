interface IParam {
    id: string;
    children: string;
    value: string;
}

interface IParamObject {
    type: IParam;
    value: string;
    description: string;
}

export const SINGLE_STRING = {
    id: "string",
    children: "String",
    value: "string",
};
export const MULTI_STRING = {
    id: "list<string>",
    children: "List Of Strings",
    value: "list<string>",
};
export const NUMBER = {
    id: "number",
    children: "Number",
    value: "number",
};
export const MULTI_NUMBER = {
    id: "list<number>",
    children: "List Of Numbers",
    value: "list<number>",
};
export const BOOLEAN = {
    id: "bool",
    children: "Boolean",
    value: "bool",
};

export const SUPPORTED_SQL_TYPES = [SINGLE_STRING, MULTI_STRING, NUMBER, MULTI_NUMBER, BOOLEAN];

export function getParamSQLValue(param) {
    switch (param.type.id) {
        case SINGLE_STRING.id:
            return `'${param.value}'`;
        case MULTI_STRING.id:
            return param.value
                .split(/\s*,\s*/g)
                .map((val) => `'${val}'`)
                .join(",");
        case NUMBER.id:
            return parseFloat(param.value);
        case MULTI_NUMBER.id:
            return param.value
                .split(/\s*,\s*/g)
                .map((val) => parseFloat(val))
                .join(",");
        case BOOLEAN.id:
            return JSON.parse(param.value);
    }
}

export function getDynamicParams(sql: string) {
    const dynamicParamRegex = /(@\w+)/g;
    let dynamicParams: any = new Set();
    let nextMatch: any;
    while ((nextMatch = dynamicParamRegex.exec(sql))) {
        const [, paramName] = nextMatch;
        dynamicParams.add(paramName);
    }
    return Array.from(dynamicParams);
}

export function serializeParamsToServer(dynamicParams) {
    return Object.entries<IParamObject>(dynamicParams).reduce((all, [paramName, paramObject]) => {
        return {
            ...all,
            [paramName]: {
                value: getParamSQLValue(paramObject),
                type: paramObject.type.id,
                description: paramObject.description,
            },
        };
    }, {});
}

export const getNewDefaultParamObject = () => ({
    type: {
        ...SINGLE_STRING,
    },
    value: "",
    description: "",
});
