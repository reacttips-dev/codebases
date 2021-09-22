import React from "react";
import { useSalesSettingsHelper } from "pages/sales-intelligence/services/salesSettingsHelper";
import { EmailSubscribeContainerProps } from "./EmailSubscribeContainer";
import OpportunityListPageContext from "../../../context/OpportunityListPageContext";
import { EmailDigestContainer } from "pages/workspace/sales/EmaiDigest/EmailDigestContainer";

// TODO: This is not ready yet
const EmailSubscribe = (props: EmailSubscribeContainerProps) => {
    const { impersonated } = props;
    const { list } = React.useContext(OpportunityListPageContext);
    const isFROUser = useSalesSettingsHelper().isUserAFroUser();

    const renderContent = () => {
        if (!isFROUser) {
            return (
                <EmailDigestContainer
                    isImpersonateMode={impersonated}
                    sizeCurrentLeads={list.opportunities.length}
                    isSubscriptionActive={list.isSubscriptionActive}
                    isShowUnsubscribeFromUrl={false}
                    onSubscribeEmailDigest={() => null}
                    onCloseUnsubscribeEmailDigestModal={() => null}
                />
            );
        }

        return null;
    };

    return <div>{renderContent()}</div>;
};

export default EmailSubscribe;
