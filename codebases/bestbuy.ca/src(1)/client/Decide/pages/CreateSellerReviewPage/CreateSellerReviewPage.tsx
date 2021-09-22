import * as React from "react";
import {Location} from "history";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {FormattedHTMLMessage, FormattedMessage, InjectedIntlProps, injectIntl} from "react-intl";
import {Col} from "@bbyca/ecomm-components";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import {getHelpTopicsId} from "@bbyca/apex-components/dist/utils/helpTopics";

import {RoutingActionCreators as RoutingActions, routingActionCreators as routingActions} from "actions/routingActions";
import {userActionCreators as userActions, UserActionCreators as UserActions} from "actions/userActions";
import Header from "components/Header";
import PageContent from "components/PageContent";
import TitleHeader from "components/TitleHeader";
import SellerReviewDuplicateError from "errors/SellerReviewDuplicateError";
import {User} from "models";
import routeManager from "utils/routeManager";
import Footer from "components/Footer";
import {ClientConfig, ServerConfig} from "config";

import {sellerReviewSubmissionStatus as status} from "../../constants/Seller";
import {ApiSellerReviewsProvider} from "../../providers";
import ReviewForm from "./components/ReviewForm";
import * as styles from "./style.css";
import messages from "./translations/messages";

export interface StateProps {
    language: Language;
    locale: Locale;
    location: Location;
    sellerReviewsUrl: string;
    user: User;
    config: ClientConfig & ServerConfig;
}

export interface DispatchProps {
    routingActions: RoutingActions;
    userActions: UserActions;
}

export interface State {
    isLoading: boolean;
    location: string;
    ratingValue: number;
    submissionStatus: string;
    customerName: string;
    reviewText: string;
    canSubmit: boolean;
}

export interface RouteParams {
    secret: string;
}

export interface Props {
    params: RouteParams;
}
export class CreateSellerReviewPage extends React.PureComponent<
    StateProps & Props & DispatchProps & InjectedIntlProps,
    State
> {
    private provider: ApiSellerReviewsProvider;
    private secret: string;

    constructor(props) {
        super(props);
        this.state = {
            canSubmit: false,
            customerName: "",
            isLoading: true,
            location: "",
            ratingValue: 0,
            reviewText: "",
            submissionStatus: "",
        };
    }

    public async componentDidMount() {
        // parse url for secret value
        this.secret = (this.props.params as any).splat;
        this.props.routingActions.setAltLangHrefs({
            altLangUrl:
                routeManager.getAltLangPathByKey(this.props.language, "createSellerReview", this.props.params) +
                this.props.location.search,
            curLangUrl: routeManager.getCurrLang(this.props.location.pathname + this.props.location.search),
        });

        const sellerReviewsUrl = this.props.sellerReviewsUrl || "";
        this.provider = new ApiSellerReviewsProvider(sellerReviewsUrl, this.props.locale);

        await this.props.userActions.locate(false);
        this.setState({
            isLoading: false,
            location: `${this.props.user.shippingLocation.city}, ${this.props.user.shippingLocation.regionCode}`,
        });
    }

    public render() {
        return (
            <div>
                <Header />
                <PageContent>
                    <TitleHeader title={this.props.intl.formatMessage(messages.titleH1)} />
                    {this.state.submissionStatus !== "" && this.state.submissionStatus !== status.invalid
                        ? this.getSubmissionResponse(this.state.submissionStatus)
                        : this.getSellerReviewComponent()}
                </PageContent>
                <Footer />
            </div>
        );
    }

    private onSubmitHandler = async (event) => {
        let submissionStatus;

        if (this.state.canSubmit) {
            this.setState({isLoading: true});

            try {
                await this.provider.saveSellerReview({
                    CustomerName: this.state.customerName,
                    Location: this.state.location,
                    RatingValue: this.state.ratingValue,
                    ReviewText: this.state.reviewText,
                    Secret: this.secret,
                });
                submissionStatus = status.success;
            } catch (error) {
                submissionStatus = error instanceof SellerReviewDuplicateError ? status.duplicate : status.fail;
            }
        } else {
            submissionStatus = status.invalid;
        }

        this.setState({submissionStatus});
    };

    private getInstructions(type: string) {
        return (
            <div className={styles.instructionContent}>
                <h3 className={styles.instructionTitle}>
                    <FormattedMessage {...messages[`${type}Title`]} />
                </h3>
                <ul>
                    <li>
                        {" "}
                        <FormattedMessage {...messages[`${type}1`]} />{" "}
                    </li>
                    <li>
                        {" "}
                        <FormattedMessage {...messages[`${type}2`]} />{" "}
                    </li>
                    <li>
                        {" "}
                        <FormattedMessage {...messages[`${type}3`]} />{" "}
                    </li>
                </ul>
            </div>
        );
    }

    private getSellerReviewComponent() {
        // display loader during initial loading
        if (this.state.isLoading && !this.state.canSubmit) {
            return <CircularProgress className={styles.circularProgress} size={50} />;
        }
        const helpTopics = getHelpTopicsId(this.props.config.environment);
        return (
            <div className={styles.container}>
                <Col xs={12} sm={8} md={8} className={styles.formContainer}>
                    <ReviewForm
                        {...this.state}
                        onChangeHandler={this.onChangeHandler}
                        selectRatingHandler={this.selectRatingHandler}
                        onSubmitHandler={this.onSubmitHandler}
                        formatMessage={this.props.intl.formatMessage}
                    />
                    <div className={styles.termsContainer}>
                        <FormattedHTMLMessage
                            {...messages.terms}
                            values={{
                                conditionsOfUse: routeManager.getPathByKey(
                                    this.props.language,
                                    "help",
                                    ...helpTopics.conditionsOfUse,
                                ),
                            }}
                        />
                    </div>
                    <Divider className={styles.divider} />
                </Col>

                <Col xs={12} sm={4} md={4} className={styles.instructionContainer}>
                    {this.getInstructions("include")}
                    {this.getInstructions("dontInclude")}
                </Col>
            </div>
        );
    }

    private getSubmissionResponse(submissionStatus: string) {
        const backToSellerFeedbackHandler = (event) => {
            event.preventDefault();
            this.setState({
                isLoading: false,
                submissionStatus: "",
            });
        };

        return (
            <div className={`${styles.messageContainer} ${submissionStatus !== status.success ? styles.error : ""}`}>
                <FormattedMessage {...messages[`submit${submissionStatus}`]} />
                <div className={styles.returnButton}>
                    {submissionStatus === status.fail && (
                        <button onClick={backToSellerFeedbackHandler}>
                            {<FormattedMessage {...messages.toSellerFeedback} />}{" "}
                        </button>
                    )}
                </div>
            </div>
        );
    }

    private selectRatingHandler = (ratingIndex) => {
        return () => {
            this.setState({ratingValue: ratingIndex + 1}, () => {
                this.setState({canSubmit: this.canSubmit()});
            });
        };
    };

    private onChangeHandler = (text: string, name: any) => {
        this.setState({[name]: text} as any, () => {
            this.setState({canSubmit: this.canSubmit()});
        });
    };

    private canSubmit(): boolean {
        return !!(
            this.state.location.length > 0 &&
            this.state.location.length <= 50 &&
            this.state.reviewText.length > 0 &&
            this.state.reviewText.length <= 500 &&
            this.state.ratingValue > 0 &&
            this.state.customerName.length > 0 &&
            this.state.customerName.length <= 50
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        language: state.intl.language,
        locale: state.intl.locale,
        location: state.routing.locationBeforeTransitions,
        sellerReviewsUrl: state.config.dataSources.sellerReviewsApiUrl,
        user: state.user,
        config: state.config,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        routingActions: bindActionCreators(routingActions, dispatch),
        userActions: bindActionCreators(userActions, dispatch),
    };
};

export default connect<StateProps, DispatchProps>(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl(CreateSellerReviewPage));
