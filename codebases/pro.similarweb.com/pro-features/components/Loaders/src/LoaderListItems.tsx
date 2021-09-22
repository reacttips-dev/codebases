import * as React from "react";
import { colorsPalettes } from "@similarweb/styles";
import { FC } from "react";
import styled, { keyframes } from "styled-components";
import SWReactRootComponent from "../../../../app/decorators/SWReactRootComponent";

export const LoaderListItemsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
LoaderListItemsWrapper.displayName = "LoaderListItemsWrapper";

interface TextProps {
    textSize?: "medium" | "large";
}

const LoaderListItemsTitle = styled.div`
    line-height: 24px;
    margin-bottom: 12px;
    color: #2a3e52;
    width: 485px;
    text-align: center;
    font-weight: ${({ textSize }: TextProps) => (textSize === "large" ? "bold" : 500)};
    font-size: ${({ textSize }: TextProps) => (textSize === "large" ? "26px" : "20px")};
`;
LoaderListItemsTitle.displayName = "LoaderListItemsTitle";
LoaderListItemsTitle.defaultProps = { textSize: "medium" };

const LoaderListItemsSubtitle = styled.div`
    color: rgba(42, 62, 82, 0.6);
    text-align: center;
    line-height: 18px;
    width: 485px;
    font-weight: 400;
    font-size: ${({ textSize }: TextProps) => (textSize === "large" ? "16px" : "14px")};
`;
LoaderListItemsSubtitle.displayName = "LoaderListItemsSubtitle";
LoaderListItemsSubtitle.defaultProps = { textSize: "medium" };

const animationMove = keyframes`
  0% {
        top: 0;
        opacity: 0;
        transform: scale(0.8);
      }
      20% {
        top: 32px;
        opacity: 1;
        transform: scale(1);
      }
      40% {
        top: 64px;
      }
      60% {
        top: 96px;
      }
      80% {
        top: 128px;
        opacity: 1;
        transform: scale(1);
      }
      100% {
        top: 160px;
        opacity: 0;
        transform: scale(0.9);
      }
`;

const bulletAnimationMove = keyframes`
  0% {
        top: 0;
        opacity: 0;
        transform: scale(0.8);
      }
      20% {
        top: 32px;
        opacity: 1;
        transform: scale(1);
      }
      40% {
        top: 64px;
      }
      60% {
        top: 96px;
      }
      80% {
        top: 128px;
        opacity: 1;
        transform: scale(1);
      }
      100% {
        top: 160px;
        opacity: 0;
        transform: scale(0.9);
      }
`;

const Container = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    width: 132px;
    height: 192px;
    text-align: center;
`;

const Item = styled.div`
    animation: ${animationMove} 2s ease-out infinite;
    position: absolute;
    display: block;
    opacity: 0;
    top: 0;
    left: 0;
    animation-delay: 0s;
    :nth-child(2) {
        animation-delay: 400ms;
    }
    :nth-child(3) {
        animation-delay: 800ms;
    }
    :nth-child(4) {
        animation-delay: 1200ms;
    }
    :nth-child(5) {
        animation-delay: 1600ms;
    }
`;

const BulletContainer = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    width: 132px;
    height: 177px;
    text-align: center;
`;

const BulletItem = styled.div`
    animation: ${bulletAnimationMove} 4s ease-out infinite;
    position: absolute;
    display: block;
    opacity: 0;
    top: 0;
    left: 0;
    animation-delay: 0s;
    :nth-child(2) {
        animation-delay: 800ms;
    }
    :nth-child(3) {
        animation-delay: 1600ms;
    }
    :nth-child(4) {
        animation-delay: 2400ms;
    }
    :nth-child(5) {
        animation-delay: 3200ms;
    }
`;

const Bullet = styled.div`
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-bottom: 6px;
    background-color: ${colorsPalettes.carbon[100]};
`;

const BulletsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100px;
    margin-left: 12.5px;
`;

const LoaderListBulletsContainer = styled.div`
    height: 457px;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

interface LoaderListItemsProps extends TextProps {
    title: string | React.ReactNode;
    subtitle: string | React.ReactNode;
}

export const LoaderListItems: FC<LoaderListItemsProps> = ({
    title,
    subtitle,
    textSize = "medium",
}) => (
    <LoaderListItemsWrapper>
        <Container>
            <Item>
                <svg width="128" height="32" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <rect id="b" width="24" height="24" rx="6" />
                        <filter
                            x="-29.2%"
                            y="-20.8%"
                            width="158.3%"
                            height="158.3%"
                            filterUnits="objectBoundingBox"
                            id="a"
                        >
                            <feOffset dy="2" in="SourceAlpha" result="shadowOffsetOuter1" />
                            <feGaussianBlur
                                stdDeviation="2"
                                in="shadowOffsetOuter1"
                                result="shadowBlurOuter1"
                            />
                            <feComposite
                                in="shadowBlurOuter1"
                                in2="SourceAlpha"
                                operator="out"
                                result="shadowBlurOuter1"
                            />
                            <feColorMatrix
                                values="0 0 0 0 0.792156863 0 0 0 0 0.792156863 0 0 0 0 0.792156863 0 0 0 0.2 0"
                                in="shadowBlurOuter1"
                            />
                        </filter>
                    </defs>
                    <g transform="translate(4 2)" fill="none" fillRule="evenodd">
                        <use fill="#000" filter="url(#a)" />
                        <use fill="#FFF" />
                        <rect stroke="#D6DBE1" x=".5" y=".5" width="23" height="23" rx="6" />
                        <rect
                            fillOpacity=".2"
                            fill="#2A3E52"
                            x="3"
                            y="3"
                            width="18"
                            height="18"
                            rx="3"
                        />
                        <rect
                            fillOpacity=".2"
                            fill="#2A3E52"
                            x="36"
                            y="8"
                            width="88"
                            height="8"
                            rx="2"
                        />
                    </g>
                </svg>
            </Item>
            <Item>
                <svg width="128" height="32" xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(4 2)" fill="none" fillRule="evenodd">
                        <use fill="#000" filter="url(#a)" />
                        <use fill="#FFF" />
                        <rect stroke="#D6DBE1" x=".5" y=".5" width="23" height="23" rx="6" />
                        <rect
                            fillOpacity=".2"
                            fill="#2A3E52"
                            x="3"
                            y="3"
                            width="18"
                            height="18"
                            rx="3"
                        />
                        <rect
                            fillOpacity=".2"
                            fill="#2A3E52"
                            x="36"
                            y="8"
                            width="65"
                            height="8"
                            rx="2"
                        />
                    </g>
                </svg>
            </Item>
            <Item>
                <svg width="128" height="32" xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(4 2)" fill="none" fillRule="evenodd">
                        <use fill="#000" filter="url(#a)" />
                        <use fill="#FFF" />
                        <rect stroke="#D6DBE1" x=".5" y=".5" width="23" height="23" rx="6" />
                        <rect
                            fillOpacity=".2"
                            fill="#2A3E52"
                            x="3"
                            y="3"
                            width="18"
                            height="18"
                            rx="3"
                        />
                        <rect
                            fillOpacity=".2"
                            fill="#2A3E52"
                            x="36"
                            y="8"
                            width="90"
                            height="8"
                            rx="2"
                        />
                    </g>
                </svg>
            </Item>

            <Item>
                <svg width="128" height="32" xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(4 2)" fill="none" fillRule="evenodd">
                        <use fill="#000" filter="url(#a)" />
                        <use fill="#FFF" />
                        <rect stroke="#D6DBE1" x=".5" y=".5" width="23" height="23" rx="6" />
                        <rect
                            fillOpacity=".2"
                            fill="#2A3E52"
                            x="3"
                            y="3"
                            width="18"
                            height="18"
                            rx="3"
                        />
                        <rect
                            fillOpacity=".2"
                            fill="#2A3E52"
                            x="36"
                            y="8"
                            width="60"
                            height="8"
                            rx="2"
                        />
                    </g>
                </svg>
            </Item>
            <Item>
                <svg width="128" height="32" xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(4 2)" fill="none" fillRule="evenodd">
                        <use fill="#000" filter="url(#a)" />
                        <use fill="#FFF" />
                        <rect stroke="#D6DBE1" x=".5" y=".5" width="23" height="23" rx="6" />
                        <rect
                            fillOpacity=".2"
                            fill="#2A3E52"
                            x="3"
                            y="3"
                            width="18"
                            height="18"
                            rx="3"
                        />
                        <rect
                            fillOpacity=".2"
                            fill="#2A3E52"
                            x="36"
                            y="8"
                            width="80"
                            height="8"
                            rx="2"
                        />
                    </g>
                </svg>
            </Item>
        </Container>
        <LoaderListItemsTitle textSize={textSize}>{title}</LoaderListItemsTitle>
        <LoaderListItemsSubtitle textSize={textSize}>{subtitle}</LoaderListItemsSubtitle>
    </LoaderListItemsWrapper>
);

export const LoaderListBullets: FC<any> = ({ title, subtitle }) => (
    <LoaderListItemsWrapper>
        <BulletContainer>
            {[1, 2, 3, 4, 5].map((i) => (
                <BulletItem key={`bullet-${i}`}>
                    <BulletsContainer>
                        <Bullet />
                        <Bullet />
                        <Bullet />
                        <Bullet />
                    </BulletsContainer>
                </BulletItem>
            ))}
        </BulletContainer>
        <LoaderListItemsTitle>{title}</LoaderListItemsTitle>
        <LoaderListItemsSubtitle>{subtitle}</LoaderListItemsSubtitle>
    </LoaderListItemsWrapper>
);

export const LoaderListBulletsWrapper = (props) => {
    return (
        <LoaderListBulletsContainer>
            <LoaderListBullets {...props} />
        </LoaderListBulletsContainer>
    );
};

export default SWReactRootComponent(LoaderListBullets, "LoaderListBullets");
