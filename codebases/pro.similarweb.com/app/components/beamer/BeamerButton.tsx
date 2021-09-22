import { IconSidebarItem } from "@similarweb/ui-components/dist/icon-sidebar";
import { useTrack } from "components/WithTrack/src/useTrack";
import React, { useEffect } from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import styled, { createGlobalStyle, css } from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";

declare const window: {
    Beamer?: {
        update: (config) => void;
    };
};

const GlobalStyles = createGlobalStyle`
    //hide unwanted beamer articles with "snippet" mode
    .beamerAnnouncementSnippet {
        display: none
    }
`;

const badgeStyle = () => css`
    // overriding beamer badge inline style
    background: ${colorsPalettes.red[400]} !important;
    ${setFont({ $color: "#ffffff", $size: 9, $weight: 400 })};
    width: 16px;
    height: 16px;
    border-radius: 50%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: space-around;
    top: 32px;
    left: 30px;
    animation: none;
`;

const Container = styled.div`
    position: relative;

    .beamer_icon.active {
        ${badgeStyle}
    }
`;

// DO NOT change this id, Since its configured in google tag manager
const BEAMER_ELEMENT_ID = "beamer-elm";

export const BeamerButton = () => {
    const translate = useTranslation();
    const [track, trackWithGuid] = useTrack();
    const { Beamer } = window;
    useEffect(() => {
        // Add event listeners to beamer in order to track open/close
        if (Beamer && typeof Beamer.update === "function") {
            Beamer.update({
                onopen: () => {
                    trackWithGuid("whats.new.menu", "open");
                },
                onclose: () => {
                    trackWithGuid("whats.new.menu", "close");
                },
            });
        }
    }, []);

    if (!Beamer) {
        return null;
    }
    return (
        <Container id={BEAMER_ELEMENT_ID}>
            <GlobalStyles />
            <IconSidebarItem key="beamer" icon={"gift"} title={translate("whats.new.title")} />
        </Container>
    );
};
