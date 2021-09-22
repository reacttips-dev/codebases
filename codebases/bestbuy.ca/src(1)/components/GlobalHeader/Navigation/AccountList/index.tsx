import { AccountMenuContent } from "@bbyca/account-components";
import { ChevronLeft } from "@bbyca/bbyca-components";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { MenuItem } from "../../../MenuPanel/components/MenuItem";
import * as styles from "../../../MenuPanel/style.css";
import messages from "../../../MenuPanel/translations/messages";
import * as accountListStyles from "./styles.css";
const closeMenuOnSignOut = (props) => () => {
    props.onSignOutSuccess();
    props.toggleNavigation();
};
export const AccountList = (props) => {
    return (React.createElement("div", { className: accountListStyles.accountMenu },
        React.createElement("ul", null,
            React.createElement(MenuItem, { className: `${styles.backLink}`, dataAutomation: "menu-back" },
                React.createElement("a", { onClick: props.onBackClick, href: "javascript: void(0);" },
                    React.createElement(ChevronLeft, { color: "blue", viewBox: "1 -3 32 32", className: styles.backIcon }),
                    React.createElement(FormattedMessage, Object.assign({}, messages.back))))),
        React.createElement(AccountMenuContent, { accountDashboardUrl: props.accountDashboardUrl, cieServiceUrl: props.cieServiceUrl, locale: props.locale, onSignOutSuccess: closeMenuOnSignOut(props) })));
};
export default AccountList;
//# sourceMappingURL=index.js.map