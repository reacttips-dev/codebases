import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import { WaSearchUrlTooltip } from "components/React/Tooltip/WaSearchUrlTooltip/WaSearchUrlTooltip";
import _ from "lodash";
import React from "react";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";

const DotsIcon = styled.span`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 6px;
`;

const UrlCellAnchor = styled.a`
    visibility: hidden;
`;

const UrlCellContainer = styled.div`
    width: 100%;
    margin: auto 0;
    display: flex;
    &:hover {
        ${UrlCellAnchor} {
            visibility: visible;
        }
    }
`;
/*
    Webkit is supported only in Safari, Google Chrome and Konqueror,
    The product knows that this cell will behave differently in other browsers.
 */
const Span = styled.span`
    display: block;
    ${setFont({ $size: 12, $color: rgba(colorsPalettes.carbon[500], 0.8) })};
    line-height: 16px;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    white-space: initial;
    letter-spacing: 0.5px;
`;

const Icon = styled(SWReactIcons)`
    path {
        fill: ${colorsPalettes.carbon[200]};
    }
`;

const UrlCellWithTooltipContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`;

declare const window;

const copySite = (event, site) => {
    event.preventDefault();
    // window.clipboardData method for IE and event.clipboardData for the other browsers
    (event.clipboardData || window.clipboardData).setData("Text", site);
};

export const UrlCell = (props) => {
    const { site, tooltipData } = props;

    const [isTooltipEnabled, setIsTooltipEnabled] = React.useState<boolean>(false);
    const textContainerRef = React.useRef(undefined);

    const updateIsTooltipEnabled = () => {
        if (textContainerRef?.current) {
            const {
                scrollHeight,
                clientHeight,
                scrollWidth,
                clientWidth,
            } = textContainerRef.current;
            const isOverFlown = scrollHeight > clientHeight || scrollWidth > clientWidth;
            setIsTooltipEnabled(isOverFlown);
        }
    };

    React.useEffect(() => {
        updateIsTooltipEnabled();
        const debounceUpdateIsTooltipEnabled = _.debounce(updateIsTooltipEnabled, 5);
        window.addEventListener("swColumnsResize", debounceUpdateIsTooltipEnabled);
        return () => window.removeEventListener("swColumnsResize", debounceUpdateIsTooltipEnabled);
    }, []);

    let siteDecode;
    try {
        siteDecode = decodeURIComponent(site);
    } catch (e) {
        siteDecode = site;
    }

    if (siteDecode === "N/A" || !siteDecode) {
        return (
            <UrlCellContainer>
                <Span>-</Span>
            </UrlCellContainer>
        );
    }
    const onCopy = (event) => copySite(event, siteDecode);
    const LinkOut = () => (
        <UrlCellAnchor
            href={_.startsWith(siteDecode, "http") ? siteDecode : `http://${siteDecode}`}
            target="_blank"
        >
            <Icon iconName="link-out" size="xs" />
        </UrlCellAnchor>
    );
    const cellContent = (
        <UrlCellContainer onCopy={onCopy}>
            <Span className="url-cell-content" ref={textContainerRef}>
                {siteDecode}&nbsp;
            </Span>
            <LinkOut />
        </UrlCellContainer>
    );
    return tooltipData ? (
        <UrlCellWithTooltipContainer>
            <FlexRow>{cellContent}</FlexRow>
            <WaSearchUrlTooltip data={tooltipData}>
                <DotsIcon className="sw-icon-show-more" />
            </WaSearchUrlTooltip>
        </UrlCellWithTooltipContainer>
    ) : (
        <FlexRow>
            <PlainTooltip
                text={siteDecode}
                cssClassContent="plainTooltip-content-without-space"
                enabled={isTooltipEnabled}
            >
                {cellContent}
            </PlainTooltip>
        </FlexRow>
    );
};
