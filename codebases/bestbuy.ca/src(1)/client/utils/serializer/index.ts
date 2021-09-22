
const serializeMultiSelectFormElement = (multiSelectFormElement: any, isLastElement: boolean) => {
    return (Array.from(multiSelectFormElement.options) as any).filter((option: any) => option.selected)
        .reduce((optionsResult: string, option: any) => {
            return optionsResult += `${encodeURIComponent(multiSelectFormElement.name)}=${encodeURIComponent(option.value)}${isLastElement ? "" : "&"}`;
        }, "");
};

export const serializeForm = (form: HTMLFormElement): string => {
    return (Array.from(form) as any).filter((element: any) => {
        return (element.hasAttribute("value") || element.type === "textarea" || element.type === "select-multiple" || element.type === "select-one") && !!element.name;
    }).reduce((result: string, element: any, index: number, array: any) => {
        const isLastElement = index === array.length - 1;
        if (element.type === "select-multiple") {
            return result += serializeMultiSelectFormElement(element, isLastElement);
        } else {
            return result += `${encodeURIComponent(element.name)}=${encodeURIComponent(element.value)}${isLastElement ? "" : "&"}`;
        }
    }, "");
};

export const serializeObject = (data: any): string => {
    return Object.keys(data).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join("&");
};
