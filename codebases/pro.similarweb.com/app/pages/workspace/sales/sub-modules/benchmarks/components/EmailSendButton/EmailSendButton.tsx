import { useTranslation } from "components/WithTranslation/src/I18n";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import {
    StyledEmailButton,
    StyledEmailSendButtonContainer,
    StyledContentWrapper,
    StyledMessageWrapper,
} from "./styles";
import { BENCHMARK_ITEM_KEY } from "../../constants";
import dayjs from "dayjs";

type EmailSendButtonProps = {
    isLoading: boolean;
    onClick(): void;
    sentDate?: string;
};

//TODO Need to be renamed to benchmark footer or smt
const EmailSendButton = (props: EmailSendButtonProps) => {
    const translate = useTranslation();
    const { isLoading, onClick, sentDate } = props;
    const sentMessage = sentDate && dayjs(sentDate).format("[Sent: ] MMMM Do YYYY ");

    return (
        <StyledEmailSendButtonContainer>
            <StyledContentWrapper>
                <StyledMessageWrapper>{sentMessage}</StyledMessageWrapper>
                <PlainTooltip
                    maxWidth={160}
                    placement="top"
                    tooltipContent={translate(`${BENCHMARK_ITEM_KEY}.email_me_tooltip`)}
                >
                    <div>
                        <StyledEmailButton
                            iconName="mail"
                            onClick={onClick}
                            isLoading={isLoading}
                            isDisabled={isLoading}
                            type={isLoading ? "primary" : "flat"}
                            dataAutomation="benchmark-item-email-me-button"
                        >
                            {translate(
                                `${BENCHMARK_ITEM_KEY}.${
                                    isLoading ? "sending_email_me_button" : "email_me_button"
                                }`,
                            )}
                        </StyledEmailButton>
                    </div>
                </PlainTooltip>
            </StyledContentWrapper>
        </StyledEmailSendButtonContainer>
    );
};

export default EmailSendButton;
