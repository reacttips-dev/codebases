import {isObject, guardType} from "utils/typeGuards";
import {linkEventParser} from "./linkEvent";
import {SingleButtonProps, SingleButtonTypes} from "components/SingleButton";

export const singleButtonParser = (data: unknown): SingleButtonProps | null => {
    if (!isObject(data)) {
        return null;
    }
    const linkEvent = linkEventParser(data.event);
    return linkEvent
        ? {
              ...(guardType(data.className, "string") && {className: data.className}),
              ...(guardType(data.buttonType, "string") && {buttonType: data.buttonType as SingleButtonTypes}),
              ...(guardType(data.darkTheme, "boolean") && {darkTheme: data.darkTheme}),
              event: linkEvent,
          }
        : null;
};

export default singleButtonParser;
