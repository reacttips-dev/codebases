import * as React from "react";
import {connect} from "react-redux";
import Header from "../../components/Header";
import {HttpRequestError, StatusCode} from "../../errors";
import {ErrorState as Errors} from "../../reducers";
import InternalServerError from "./InternalServerError";
import NotFound from "./NotFound";
import Footer from "../../components/Footer";
import {State} from "store";

interface StateProps {
    errors: Errors;
}

export class Error extends React.Component<StateProps> {
    public render() {
        let content = null;

        if (!this.props.errors.error) {
            return content;
        }

        const statuscode =
            this.props.errors.error instanceof HttpRequestError
                ? this.props.errors.error.statusCode
                : StatusCode.InternalServerError;

        switch (statuscode) {
            case StatusCode.NotFound:
                content = <NotFound />;
                break;
            default:
                content = <InternalServerError />;
                break;
        }

        return (
            <>
                <Header />
                {content}
                <Footer />
            </>
        );
    }
}

function mapStateToProps(state: State) {
    return {
        errors: state.errors,
    };
}

export default connect<StateProps, {}, {}, State>(mapStateToProps)(Error);
