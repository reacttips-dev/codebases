import { MixpanelTracker, trackerWithConsole } from "@similarweb/sw-track/";
import { Button } from "@similarweb/ui-components/dist/button";
import React, { FunctionComponent, useEffect } from "react";
import ReactDOM from "react-dom";
import { AssetsService } from "services/AssetsService";
import styled from "styled-components";

declare const SW_ENV: { debug: boolean };
declare const window: any;

// if (process.env.NODE_ENV === 'development') {
//     const whyDidYouRender = require('@welldone-software/why-did-you-render');
//     whyDidYouRender(React, {
//         trackAllPureComponents: true,
//         // logOnDifferentValues: true,
//     });
// }

const PageViewParams = {
    path: {
        section: "mobile introduction",
        sub_section: null,
        sub_sub_section: null,
        page_id: "mobile introduction",
    },
    is_sw_user: true,
    lang: "en-us",
};

const mixpanelTrackerInt = new (class extends MixpanelTracker {
    protected mixpanel() {
        return window.mixpanel;
    }

    protected isEnabled(): boolean {
        return !(SW_ENV && SW_ENV.debug);
    }
})();

const mixpanelTracker = trackerWithConsole(mixpanelTrackerInt, "mixpanelTracker");

export const MOBILE_VIEW_WIDTH = 414;
const isSfPage = () => location.hash.startsWith("#/sf/convert");
const FixedContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999999;
    overflow-y: auto;
    background-color: #ffffff;
    overflow-x: hidden;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #ffffff;
`;

const Logo = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    margin: 19px 0 22px 23px;
`;

const Gradient = styled.div`
    height: 25px;
    background: rgb(237, 242, 247);
    background: linear-gradient(180deg, rgba(237, 242, 247, 1) 0%, rgba(255, 255, 255, 1) 100%);
    width: 100%;
    flex-shrink: 0;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 0 35px;
    margin-bottom: 20px;
    margin-top: 10px;
`;

const Title = styled.div`
    font-size: 24px;
    color: #2a3e52;
    font-weight: 500;
    font-family: "Roboto", Tahoma, sans-serif;
    margin-bottom: 20px;
    line-height: 32px;
`;

const SubTitle = styled.div`
    font-size: 14px;
    color: #2a3e52;
    opacity: 0.8;
    font-family: "Roboto", Tahoma, sans-serif;
    margin-bottom: 20px;
    line-height: 20px;
`;

const logo = AssetsService.assetUrl("images/similarweb-logo.png");
const gif = AssetsService.assetUrl("images/mobile-view-animation.gif");

const App: FunctionComponent<any> = (props) => {
    useEffect(() => {
        if (!window.mixpanel) {
            window.mobileViewPage = window.mobileViewPage || [];
            window.mobileViewPage.push({
                event: "trackPageView",
                params: {
                    ...PageViewParams,
                },
            });
        } else {
            mixpanelTracker.trackPageView(PageViewParams);
        }
    });
    return (
        <FixedContainer>
            <Container>
                <Logo>
                    <img src={logo} />
                </Logo>
                <Gradient />
                <img src={gif} />
                <Content>
                    <Title>The SimilarWeb experience is ideal on desktop</Title>
                    <SubTitle>
                        We suggest you visit our platform on a different device to gain the insights
                        you need
                    </SubTitle>
                    <Button onClick={props.onClick}>continue anyway</Button>
                </Content>
            </Container>
        </FixedContainer>
    );
};

const domElementGetter = () => {
    const id = `mobile-view-page-${Date.now()}`;
    let el = document.getElementById(id);
    if (!el) {
        el = document.createElement("div");
        el.id = id;
        document.body.appendChild(el);
    }
    return el;
};

if (innerWidth <= MOBILE_VIEW_WIDTH && !isSfPage()) {
    const element = domElementGetter();
    ReactDOM.render(
        <App
            onClick={() => {
                const eventParams = ["button", "click", "continue to pro"];
                if (!window.mixpanel) {
                    window.mobileViewPage = window.mobileViewPage || [];
                    window.mobileViewPage.push({
                        event: "trackEvent",
                        params: eventParams,
                    });
                } else {
                    mixpanelTracker.trackEvent(eventParams[0], eventParams[1], eventParams[2]);
                }
                ReactDOM.unmountComponentAtNode(element);
            }}
        />,
        element,
    );
}
