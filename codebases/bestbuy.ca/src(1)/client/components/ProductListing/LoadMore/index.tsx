import CircularProgress from "@material-ui/core/CircularProgress";
import {Button, ButtonAppearance} from "@bbyca/bbyca-components";
import * as React from "react";
import {FormattedMessage} from "react-intl";
import {IBrowser as ScreenSize} from "redux-responsive";
import EndOfResults from "../EndOfResults";
import * as styles from "./style.css";
import messages from "./translations/messages";
import Link, {Props as LinkProps} from "components/Link";
import {Key} from "@bbyca/apex-components";
import {classname, classIf} from "utils/classname";

export interface Props extends LinkProps {
    appearance?: ButtonAppearance;
    shouldRender: boolean;
    isLoading?: boolean;
    isEndOfResults?: boolean;
    screenSize: ScreenSize;
    labelText?: string;
    hideDivider?: boolean;
    linkKey: Key;
    seoOptimized?: boolean;
    className?: string;
    onLoadMoreButtonTap(): void;
}

export class LoadMore extends React.Component<Props, undefined> {
    public static displayName: string = "LoadMore";

    private classes = classname([
        classIf(styles.loadMoreRow, !this.props.hideDivider),
        styles.loadMoreButtonContainer,
        this.props.className,
    ]);

    public render() {
        if (!this.props.shouldRender) {
            return null;
        }

        return this.buildTemplate();
    }

    private buildTemplate = () => {
        if (this.props.isEndOfResults) {
            return <EndOfResults />;
        }

        if (this.props.isLoading) {
            return (
                <div className={styles.loadingContainer}>
                    <CircularProgress
                        className={styles.circularProgress}
                        size={this.props.screenSize.lessThan.medium ? 24 : 40}
                        thickness={this.props.screenSize.lessThan.medium ? 2 : 4}
                    />
                </div>
            );
        }

        if (this.props.seoOptimized) {
            return (
                <div className={this.classes}>
                    <Link
                        to={this.props.linkKey}
                        params={this.props.params}
                        className={styles.loadMoreLink}
                        query={this.props.query}>
                        <Button
                            appearance={this.props.appearance}
                            onClick={this.onClickHandler}
                            className={classname([styles.button, styles.loadMore])}>
                            {this.props.labelText || <FormattedMessage {...messages.buttonText} />}
                        </Button>
                    </Link>
                </div>
            );
        }

        return (
            <div className={this.classes}>
                <Button
                    appearance={this.props.appearance}
                    className={classname([styles.button, styles.loadMore])}
                    onClick={this.onClickHandler}>
                    {this.props.labelText || <FormattedMessage {...messages.buttonText} />}
                </Button>
            </div>
        );
    };

    private onClickHandler = (e) => {
        e.preventDefault();
        this.props.onLoadMoreButtonTap();
    };
}

LoadMore.defaultProps = {
    appearance: "secondary",
};

export default LoadMore;
