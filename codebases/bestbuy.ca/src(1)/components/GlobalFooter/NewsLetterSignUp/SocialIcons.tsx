import { Facebook, Instagram, Linkedin, Pinterest, Twitter, Youtube } from "@bbyca/bbyca-components";
import * as React from "react";
import { Link } from "../../GlobalHeader/Link";
import * as styles from "./style.css";
export default ({ locale }) => {
    const isFrench = locale === "fr-CA";
    return (React.createElement("div", { className: styles.socialIconsContainer },
        React.createElement(Link, { href: `https://www.facebook.com/${isFrench ? "bestbuyquebec" : "BestBuyCanada"}`, ariaLabel: "Facebook Best Buy Canada", external: true, extraAttributes: { "data-automation": "footer-facebook-icon" }, locale: locale, targetSelf: false },
            React.createElement(Facebook, { className: styles.socialIcon })),
        React.createElement(Link, { href: `https://www.instagram.com/bestbuycanada`, ariaLabel: "Instagram Best Buy Canada", external: true, extraAttributes: { "data-automation": "footer-instagram-icon" }, locale: locale, targetSelf: false },
            React.createElement(Instagram, { className: styles.socialIcon })),
        React.createElement(Link, { href: `https://www.linkedin.com/company/best-buy`, ariaLabel: "Linkedin Best Buy Canada", external: true, extraAttributes: { "data-automation": "footer-linkedin-icon" }, locale: locale, targetSelf: false },
            React.createElement(Linkedin, { className: styles.socialIcon })),
        React.createElement(Link, { href: `https://www.pinterest.com/bestbuycanada/`, ariaLabel: "Pinterest Best Buy Canada", external: true, extraAttributes: { "data-automation": "footer-pinterest-icon" }, locale: locale, targetSelf: false },
            React.createElement(Pinterest, { className: styles.socialIcon })),
        React.createElement(Link, { href: `https://www.twitter.com/${isFrench ? "BestBuyQUEBEC" : "bestbuycanada"}`, ariaLabel: "Twitter Best Buy Canada", external: true, extraAttributes: { "data-automation": "footer-twitter-icon" }, locale: locale, targetSelf: false },
            React.createElement(Twitter, { className: styles.socialIcon })),
        React.createElement(Link, { href: `https://www.youtube.com/user/${isFrench ? "BestBuyQuebec" : "CanadaBestBuy"}`, ariaLabel: "Youtube Best Buy Canada", external: true, extraAttributes: { "data-automation": "footer-youtube-icon" }, locale: locale, targetSelf: false },
            React.createElement(Youtube, { className: styles.socialIcon }))));
};
//# sourceMappingURL=SocialIcons.js.map