// decode XML strings for French accents, and other encoded HTML/XML entities.
import * as React from "react";
import { unescape } from "lodash-es";

export default (input) => {
    return <span dangerouslySetInnerHTML={{ __html: input }} ></span>;
};

export function decodeHTMLEntities(str) {
    if (str && typeof str === "string") {
        // strip script/html tags
        str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, "");
        str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, "");
        str = str.replace(/&#(\d+);/g, (match, encodedCharCode) => {
            return String.fromCharCode(encodedCharCode);
        });
        str = unescape(str);
    }

    return str;
}
