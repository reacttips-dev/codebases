import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import { usePrevious } from "components/hooks/usePrevious";
import useEmailService from "../../hooks/useEmailService";
import { useTranslation } from "components/WithTranslation/src/I18n";
import useRightSidebarTrackingService from "pages/sales-intelligence/hooks/useRightSidebarTrackingService";
import { selectActiveTopic, selectBenchmarkIdSendingByEmail } from "../../store/selectors";
import { sendEmailSingleBenchmarkThunkAction } from "../../store/effects";
import BenchmarkItemContext from "../../contexts/BenchmarkItemContext";
import EmailSendButton from "./EmailSendButton";
import {
    BenchmarksVisualizationType,
    METRICS_TRANSLATION_KEY,
    TOPICS_TRANSLATION_KEY,
} from "../../constants";

type EmailSendButtonProps = {
    emailSentDate?: string;
};

type ConnectedProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps> &
    EmailSendButtonProps;

const EmailSendButtonContainer = (props: ConnectedProps) => {
    const { selectedVisualisation, benchmarkItemService } = React.useContext(BenchmarkItemContext);

    const { sendEmail, sendingId, selectedTopic, emailSentDate } = props;
    const [isLoading, setIsLoading] = React.useState(false);
    const isSending = sendingId === benchmarkItemService.id;

    const translate = useTranslation();
    const previousSending = usePrevious(isSending);
    const emailService = useEmailService();
    const sidebarTrackingService = useRightSidebarTrackingService();

    const buildAndSendEmail = async () => {
        sidebarTrackingService.trackBenchmarksEmailMeClicked(
            translate(`${METRICS_TRANSLATION_KEY}.${benchmarkItemService.bResult.metric}.title`),
            translate(`${TOPICS_TRANSLATION_KEY}.${selectedTopic}`),
            (BenchmarksVisualizationType as object)[selectedVisualisation],
        );

        const template = await emailService.build(selectedVisualisation);

        sendEmail(benchmarkItemService.id, benchmarkItemService.prospect.domain, template);
    };

    const handleSendButtonClick = () => {
        setIsLoading(true);
        setTimeout(() => {
            void buildAndSendEmail();
        }, 1000);
    };

    React.useEffect(() => {
        if (
            isLoading &&
            typeof previousSending !== "undefined" &&
            previousSending !== isSending &&
            !isSending
        ) {
            setIsLoading(false);
        }
    }, [isSending]);

    return (
        <EmailSendButton
            sentDate={emailSentDate}
            isLoading={isLoading}
            onClick={handleSendButtonClick}
        />
    );
};

const mapStateToProps = (state: RootState) => ({
    sendingId: selectBenchmarkIdSendingByEmail(state),
    selectedTopic: selectActiveTopic(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            sendEmail: sendEmailSingleBenchmarkThunkAction,
        },
        dispatch,
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(EmailSendButtonContainer) as React.FC<
    EmailSendButtonProps
>;
