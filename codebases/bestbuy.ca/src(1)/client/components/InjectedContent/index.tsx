import CircularProgress from "@material-ui/core/CircularProgress";
import * as React from "react";
import * as styles from "./style.css";
import {Cookie, CookieUtils} from "@bbyca/bbyca-components";

let baseDomain = "";
const iFrameCookieName = "mDot_iframe";
if (typeof document !== "undefined") {
    const domain = document.location.hostname.match(/\w+\.?\w+$/);
    baseDomain = domain ? domain[0] : "";
}

export interface Props {
    src: string;
    height?: string;
    width?: string;
    iFrameTitle?: string;
}

interface State {
    loading: boolean;
}

export class InjectedContent extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        };
    }

    public componentWillMount() {
        const iFrameCookie: Cookie = new Cookie(iFrameCookieName, String(true));
        iFrameCookie.domain = baseDomain;
        iFrameCookie.path = "/";

        CookieUtils.setCookie(iFrameCookie);

        if (window && !window.onbeforeunload) {
            window.onbeforeunload = () => {
                this.unsetCookie();
            };
        }
    }

    public componentWillUnmount() {
        this.unsetCookie();
    }

    public render() {
        return (
            <div className={styles.loadingIframe}>
                {this.state.loading && <CircularProgress className={styles.circularProgress} />}
                <iframe
                    style={{
                        visibility: this.state.loading ? "hidden" : "visible",
                        height: this.props.height,
                        width: this.props.width,
                    }}
                    title={this.props.iFrameTitle}
                    onLoad={() => this.setState({loading: false})}
                    src={`${this.props.src}`}
                    className={this.state.loading ? styles.loadingIframe : styles.iframe}></iframe>
            </div>
        );
    }

    private unsetCookie() {
        const iFrameCookie: Cookie = new Cookie(iFrameCookieName, String(false));
        iFrameCookie.domain = baseDomain;
        iFrameCookie.path = "/";
        iFrameCookie.maxAge = -1;

        CookieUtils.setCookie(iFrameCookie);
    }
}

export default InjectedContent;
