import "@similarweb/icons/dist/output/icons.data.svg.css";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { adsTargetURL } from "filters/ngFilters";
import * as React from "react";
import { StatelessComponent } from "react";
import { allTrackers } from "services/track/track";
import styled, { css } from "styled-components";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { trackEvent } from "../SWReactTableUtils";
import { UpgradeLink } from "./UpgradeLink";
import * as _ from "lodash";

const AdUnitComponent = styled.div<{ withBorder?: boolean; withPadding?: boolean }>`
    white-space: normal;
    display: block;
    width: 100%;
    ${({ withPadding }) => withPadding && `padding: 16px 16px;`};
    ${({ withBorder }) => withBorder && `border: 1px solid ${colorsPalettes.midnight["50"]}`};
    display: flex;
    flex-direction: column;

    & > * {
        margin: 0;
        line-height: normal;
        font-size: 12px;
    }
    p {
        color: #444;
    }
`;

const AdPreview = styled.span`
    height: 16px;
    color: ${rgba(colorsPalettes.carbon[500], 0.6)};
    font-style: normal;
    font-size: 12px;
    word-break: break-all;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

export const H3Container = styled.div`
    padding-bottom: 4px;
`;

export const TextAd = ({
    targetUrl,
    Description,
    DestUrl,
    Title,
    onClick,
    withBorder = true,
    withPadding = true,
}) => {
    return (
        <AdUnitComponent withBorder={withBorder} withPadding={withPadding}>
            <AdPreview>{DestUrl}</AdPreview>
            <H3Container>
                {targetUrl ? (
                    <a className="ad-target-url" href={targetUrl} target="_blank" onClick={onClick}>
                        {Title}
                    </a>
                ) : (
                    <span className="ad-target-url">{Title}</span>
                )}
            </H3Container>
            <p className="description" style={{ lineHeight: "1.33" }}>
                {Description}
            </p>
        </AdUnitComponent>
    );
};

const ShoppingAdContainer = styled.div<{ isImgClickable?: boolean }>`
    display: flex;
    line-height: 1.6em;
    width: 100%;

    .image-container {
        margin-right: 16px;
        border: 1px solid ${colorsPalettes.midnight["50"]};
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 123px;
        min-height: 123px;
        background-color: #fff;
        ${({ isImgClickable }) =>
            isImgClickable &&
            css`
                cursor: pointer;
            `};
    }

    img {
        max-width: 121px;
        max-height: 121px;
    }

    .details {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        align-self: center;
    }

    .price {
        font-weight: 600;
        color: ${colorsPalettes.carbon["500"]};
    }

    .title {
        max-width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        color: ${colorsPalettes.carbon["400"]};
    }
    .brand {
        color: ${colorsPalettes.carbon["500"]};
    }

    .icon-no_image_available--background {
        width: 123px;
        height: 123px;
        background-size: 100% 115%;
    }
`;

function decodeHexedImage(url) {
    return url.replace(/\\x([0-9A-Fa-f]{2})/g, (all, hexNumber) =>
        String.fromCharCode(parseInt(hexNumber, 16)),
    );
}

export const ShoppingAd = ({ Title, Price, Brand, ImageUrl, onImageClick = _.noop }) => {
    return (
        <ShoppingAdContainer isImgClickable={!!onImageClick}>
            <div className="image-container">
                {ImageUrl ? (
                    <img src={decodeHexedImage(ImageUrl)} onClick={onImageClick} />
                ) : (
                    <div className="icon-no_image_available--background"></div>
                )}
            </div>
            <div className="details">
                <span className="price">{Price}</span>
                <span className="title">{Title}</span>
                <span className="brand">{Brand}</span>
            </div>
        </ShoppingAdContainer>
    );
};

function trackUpgrade() {
    allTrackers.trackEvent("Internal Link", "click", "Hook/Table/Pricing Page");
}

export const AdUnit: StatelessComponent<ITableCellProps> = ({ value, tableOptions }) => {
    const targetUrl = adsTargetURL()(value);
    const { Title, Type, Description, DestUrl } = value;
    const onClick = () => trackEvent(tableOptions, "External Link", targetUrl, "click");
    switch (Title) {
        case "grid.upgrade":
            return <UpgradeLink hookType="pages" />;
        default:
            switch (Type) {
                case "Text":
                    return (
                        <TextAd
                            {...{ Title, Description, DestUrl, targetUrl, onClick }}
                            withBorder={false}
                            withPadding={false}
                        />
                    );
                case "Shopping":
                    const { Price, Brand, ImageUrl } = value;
                    return (
                        <ShoppingAd
                            {...{
                                Title,
                                Price,
                                Brand,
                                ImageUrl,
                                Description,
                                DestUrl,
                                targetUrl,
                                onClick,
                            }}
                        />
                    );
            }
    }
};
AdUnit.displayName = "AdUnit";
