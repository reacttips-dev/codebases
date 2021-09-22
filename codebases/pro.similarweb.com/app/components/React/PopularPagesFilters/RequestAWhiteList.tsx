import { FeedbackBar } from "@similarweb/ui-components/dist/feedback-bar";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { allTrackers } from "services/track/track";
import { i18nFilter } from "filters/ngFilters";
import useLocalStorage from "../../../custom-hooks/useLocalStorage";
import { PreferencesService } from "services/preferences/preferencesService";

const WhiteListKeyPrefix = (domain) => `WHITE_LIST_KEY_PREFIX_${domain}`;
const RequestAWhiteList = (props) => {
    const i18n = i18nFilter();
    const {
        popularPagesRequestMessage: { showRequestMessage, keys },
    } = props;
    const [requested, setRequested] = useState({ loading: true, value: false });

    const [hideRequestedMessage] = useLocalStorage(WhiteListKeyPrefix(keys));

    useEffect(() => {
        if (keys) {
            const result = PreferencesService.get(WhiteListKeyPrefix(keys));
            setRequested({ loading: false, value: result });
            PreferencesService.get(WhiteListKeyPrefix(keys));
        }
    }, [keys]);

    const isVisible = () => {
        if (requested.loading) {
            return false;
        } else {
            if (requested.value) {
                return !hideRequestedMessage;
            } else {
                return showRequestMessage;
            }
        }
    };

    if (isVisible()) {
        allTrackers.trackEvent("PopularPagesMessage", "show", "WhiteListRequestMessageButton");
    }
    return (
        <>
            {isVisible() && (
                <div style={{ marginBottom: "16px" }}>
                    <FeedbackBar iconSrc="avg-visit-duration">
                        {i18n("whitelist.feedback.bar.no_request")}
                    </FeedbackBar>
                </div>
            )}
        </>
    );
};
const mapStateToProps = ({ popularPages: { popularPagesRequestMessage } }) => {
    return {
        popularPagesRequestMessage,
    };
};
const connected = connect(mapStateToProps)(RequestAWhiteList);
export default SWReactRootComponent(connected, "RequestAWhiteList");
