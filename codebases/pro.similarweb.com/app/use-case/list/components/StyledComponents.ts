import styled from "styled-components";

const PageHeadingText = styled.h1`
    font-size: 48px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.17;
    letter-spacing: normal;
    color: #2a3e52;
    text-align: center;
`;

export const PageHeading = styled(PageHeadingText)`
    margin-top: 64px;
`;

export const PageDescription = styled.h2`
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1;
    letter-spacing: normal;
    text-align: center;
    color: rgba(42, 62, 82, 0.6);
    margin-bottom: 5px;
`;

export const Tiles = styled.div`
    padding-bottom: 23px;
`;

export const TileRow = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 24px;
`;

export const Tile = styled.div`
    position: relative;
    box-sizing: border-box;
    width: 250px;
    height: 220px;
    border-radius: 6px;
    box-shadow: 0 3px 6px 0 rgba(14, 30, 62, 0.08);
    background-color: #ffffff;
    text-align: center;
    padding: 34px 11px;
    margin-left: 23px;
    transition: box-shadow 200ms ease-out;

    &:first-of-type {
        margin-left: 0;
    }

    &:hover {
        box-shadow: 0 3px 6px rgba(17, 27, 66, 0.2);
    }
`;

export const TileTitle = styled.h3`
    font-size: 16px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: 0.25px;
    color: #2a3e52;
    margin: 30px 0 0 0;
`;

export const TileDescription = styled.p`
    opacity: 0.74;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.43;
    letter-spacing: normal;
    text-align: center;
    color: rgba(42, 62, 82, 0.8);
    margin: 5px 0 0 0;
`;

export const TileIconSpacer = styled.div`
    line-height: 48px;
`;

export const TileIconHolder = styled.span`
    display: inline-block;
    vertical-align: bottom;
    line-height: 0;
`;

export const LinkStretched = styled.a`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: transparent;
`;
