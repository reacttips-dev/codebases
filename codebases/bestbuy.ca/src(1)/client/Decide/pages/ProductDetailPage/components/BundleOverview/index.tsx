import * as React from "react";
import {FormattedMessage} from "react-intl";

import {BundleProduct} from "models";
import {classname} from "utils/classname";

import * as styles from "./style.css";
import messages from "./translations/messages";

interface Props {
    constituents: BundleProduct[];
    classname?: string;
}

export class BundleOverview extends React.Component<Props, {}> {
    public render() {
        return (
            this.props.constituents && (
                <div className={classname([styles.packageOverviewContainer, this.props.classname])}>
                    <h2 className={styles.packageOverviewTitle}>
                        <span className={styles.bundleText}>
                            <FormattedMessage {...messages.packageOverviewTitle} />
                        </span>
                    </h2>

                    <span className={styles.bundleText}>
                        <FormattedMessage {...messages.packageOverviewSubTitle} />
                    </span>

                    <ol className={styles.constituentLinks}>
                        {this.props.constituents.map((constituent, index) => (
                            <li key={index}>
                                <p>{constituent.name}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            )
        );
    }
}

export default BundleOverview;
