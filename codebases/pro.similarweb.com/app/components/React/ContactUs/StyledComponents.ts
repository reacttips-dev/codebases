import { Button } from "@similarweb/ui-components/dist/button";
import styled from "styled-components";

export const ContactUsInlineContent = styled.div`
    position: relative;
    box-sizing: border-box;
    margin: 0;
    padding: 16px 24px 24px;
    background: #fff;
    border-radius: 6px;
    // Contact Us styles overrides
    .cu-content {
        padding: 11px 0 0;
        &__text {
            font-size: 12px;
            color: rgba(42, 62, 82, 0.6);
            &--legal {
                font-size: 11px;
                text-align: left;
                @media (min-width: 887px) {
                    max-width: 168px;
                }
            }
        }
    }
    .cu-success {
        .cu-button {
            display: none;
        }
    }
    .swui-textarea {
        height: 100px;
    }
    .cu-form__line--submit {
        margin-top: 10px;
        .cu-button {
            width: 94px;
            background: #4f8df9;
            font-size: 0.875rem;
            font-weight: bold;
            padding: 0 15px;
            line-height: 37px;
            &:hover {
                background: #3f70c7;
                box-shadow: none;
                transform: none;
            }
        }
    }
`;
ContactUsInlineContent.displayName = "ContactUsInlineContent";

export const ContactUsInlineTitle = styled.div`
    position: relative;
    padding: 0 18px 16px 0;
    font-size: 20px;
    font-weight: 700;
    color: #2a3e52;
    line-height: 1.6;
    &::after {
        position: absolute;
        width: calc(100% + ${24 * 2}px);
        height: 1px;
        top: 100%;
        left: -24px;
        background: #e9ebed;
        content: "";
    }
`;
ContactUsInlineTitle.displayName = "ContactUsInlineTitle";

export const ContactUsInlineSubtitle = styled.div`
    margin-top: 16px;
    font-size: 14px;
    color: rgba(42, 62, 82, 0.8);
    line-height: 1.29;
    white-space: pre-wrap;
`;
ContactUsInlineSubtitle.displayName = "ContactUsInlineSubtitle";

export const ContactUsInlineButton = styled(Button)`
    display: block;
    margin: 0 auto;
`;
ContactUsInlineButton.displayName = "ContactUsInlineButton";
