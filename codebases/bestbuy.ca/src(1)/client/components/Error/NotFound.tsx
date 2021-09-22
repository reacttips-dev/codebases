import * as React from "react";
import { FormattedMessage } from "react-intl";
import * as styles from "./style.css";
import messages from "./translations/messages";
import { connect } from "react-redux";
import { errorActionCreators, ErrorActionCreators } from "actions";
import { bindActionCreators } from "redux";
interface DispatchProps {
    errorActions: ErrorActionCreators;
}

export class PageNotFound extends React.Component<DispatchProps> {

    public render() {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <FormattedMessage {...messages.notFoundHeadertitle} />
                </div>
                <p>
                    <FormattedMessage {...messages.notFoundHeaderContent} />
                </p>
                <div className={styles.subheader}>
                    <FormattedMessage {...messages.notFoundSubheader} />
                </div>
                <div>
                    <ul>
                        <li><FormattedMessage {...messages.notFoundli1} /></li>
                        <li><FormattedMessage {...messages.notFoundli2} /></li>
                        <li>
                            <FormattedMessage {...messages.notFoundli3}
                                values={{
                                    homePage:
                                    <a href="/" className={styles.anchor}>
                                        <FormattedMessage {...messages.notFoundhomePage} />
                                    </a>,
                                }} />
                        </li>
                    </ul>
                </div>
            </div>
        );
    }

    public async componentDidMount() {
        await this.props.errorActions.trackPageNotFoundView();
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        errorActions: bindActionCreators(errorActionCreators, dispatch),
    };
};

export default connect<null, DispatchProps>(null, mapDispatchToProps)(PageNotFound);
