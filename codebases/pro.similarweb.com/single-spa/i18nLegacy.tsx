import toString from "lodash/toString";
import { isNil } from "lodash";

export const getI18n = (dictionary) => {
    // eslint:disable-next-line:no-bitwise
    const debug = !!~document.cookie.indexOf("locale_debug=1");
    return {
        /**
         * main i18n function
         * @param key
         * i18n key
         * @param data
         * interpolation data map: map keys that appear as %key% in the target string, will be interpolated.
         * interpolation data value can be a string, or a function (for deferred values)
         * @returns {string}
         */
        t(key, data) {
            key = key && key.toLowerCase();
            let s = (debug ? "[" + key + "] " : "") + (dictionary[key] || "");
            if (data && s && s.indexOf("%") > -1) {
                for (const key in data) {
                    if (!data.hasOwnProperty(key)) {
                        continue;
                    }

                    const value = data[key];
                    let text = "";
                    if (isNil(value)) {
                        text = "";
                    } else if (typeof value === "function") {
                        text = value();
                    } else {
                        text = toString(value);
                    }
                    s = s.replace(new RegExp("%" + key + "%", "g"), text);
                }
            }
            return s;
        },
    };
};
