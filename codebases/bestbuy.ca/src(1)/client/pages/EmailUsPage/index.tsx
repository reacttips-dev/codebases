import {
    emailUsActionCreators as emailUsAction,
    EmailUsActionCreators as EmailUsActions,
    routingActionCreators as routingAction,
    RoutingActionCreators as RoutingAction,
} from "actions";
import * as React from "react";

import Header from "components/Header";
import PageContent from "components/PageContent";
import Footer from "components/Footer";

import * as styles from "./style.css";
import {injectIntl, InjectedIntlProps} from "react-intl";

import messages from "./components/EmailUsForm/translations/messages";

import BreadcrumbList from "components/BreadcrumbList";
import {BreadcrumbListItem} from "models";
import {getBreadcrumbRoot} from "utils/builders/breadcrumbBuilder";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {RoutingState} from "reducers";
import {ConversationType, ContactUsRequest} from "@bbyca/ecomm-communications-components";
import FormSuccessContent from "./components/FormSuccessContent";

import {useState, useEffect} from "react";
import EmailUsForm from "./components/EmailUsForm";
import getLogger from "common/logging/getLogger";

interface StateProps {
    routing: RoutingState;
    ordersWebAppUrl: string;
}

interface DispatchProps {
    emailUsActions: EmailUsActions;
    routingActions: RoutingAction;
}

export const EmailUsPage = (props: StateProps & DispatchProps & InjectedIntlProps) => {
    const [optionSelected, setOptionSelected] = useState(ConversationType.initial);
    const [emailSubmitted, setEmailSubmitted] = useState(false);
    const [submittingEmail, setSubmittingEmail] = useState(false);

    useEffect(() => {
        props.emailUsActions.syncEmailUsStateWithLocation(props.routing.locationBeforeTransitions);
    }, [props.routing.locationBeforeTransitions]);

    const getBreadcrumbs = (): BreadcrumbListItem[] => {
        const breadcrumbs = [
            getBreadcrumbRoot(props.intl),
            {
                label: props.intl.formatMessage(messages.emailUs),
            } as BreadcrumbListItem,
        ];

        return breadcrumbs;
    };

    const handleFormSubmit = async (type, event, data) => {
        event.preventDefault();
        if (submittingEmail) {
            return;
        }

        setSubmittingEmail(true);
        const mapFormDataToPayload = (formData): ContactUsRequest => {
            const formBody = Object.values(formData)
                .map((el: {error: boolean; value: string}) => el.value)
                .join(", ");
            return {
                topic: optionSelected as string,
                type: optionSelected,
                orderNumber: formData.orderNumber && formData.orderNumber.value,
                content: formBody,
                sender: {
                    id: "",
                    firstName: formData.firstName.value,
                    lastName: formData.lastName.value,
                    email: formData.email.value,
                },
            };
        };

        try {
            await props.emailUsActions.sendFormData(mapFormDataToPayload(data), props.intl.locale as Locale, () =>
                handleFormSubmit(type, event, data),
            );
            setEmailSubmitted(true);
        } catch (error) {
            setSubmittingEmail(false);
            getLogger().error(`Can't send form data: ${error}`);
        }
    };

    return (
        <>
            <Header />
            <PageContent>
                <BreadcrumbList breadcrumbListItems={getBreadcrumbs()} />
                <div className={styles.emailUsPage}>
                    <div className={styles.emailUsForm}>
                        {emailSubmitted ? (
                            <FormSuccessContent />
                        ) : (
                            <EmailUsForm
                                option={optionSelected}
                                handleOptionChange={setOptionSelected}
                                handleSubmit={handleFormSubmit}
                                ordersWebAppUrl={props.ordersWebAppUrl}
                            />
                        )}
                    </div>
                </div>
            </PageContent>
            <Footer />
        </>
    );
};

function mapStateToProps(state) {
    return {
        routing: state.routing,
        ordersWebAppUrl: state.config.appPaths.orders,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        emailUsActions: bindActionCreators(emailUsAction, dispatch),
        routingActions: bindActionCreators(routingAction, dispatch),
    };
}

export default connect<StateProps, DispatchProps>(mapStateToProps, mapDispatchToProps)(injectIntl(EmailUsPage));
