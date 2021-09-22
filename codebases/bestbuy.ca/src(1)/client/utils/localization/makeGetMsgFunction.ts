/**
 * @param base the common base to be used for multiple messages passed to defineMessages function of react-intl
 * @return function
 *
 * @example:
 *
 * import makeGetMsgFunction from "utils/localization/makeGetMsgFunction";
 * const get = makeGetMsgFunction("components.AddonsPage");
 * export default defineMessages({ backToCart: get("backToCart") });
 *
 * get("backToCart") will return { id: "components.AddonsPage.backToCart"}.
 */
const makeGetMsgFunction = (base: string) => (key: string) => ({id: `${base}.${key}`});

export default makeGetMsgFunction;
