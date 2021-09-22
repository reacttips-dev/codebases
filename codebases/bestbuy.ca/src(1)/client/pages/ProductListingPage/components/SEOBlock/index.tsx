import * as React from "react";
import {FormattedMessage} from "react-intl";
import * as styles from "./style.css";
import messages from "./translations/messages";
import TextBlock from "components/TextBlock";
import SectionTitle from "components/SectionTitle";
import {Expandable, DisplayLimitLines} from "@bbyca/bbyca-components";

export interface SEOBlockProps {
    title?: string;
    content?: string;
}

const SEOBlock: React.FunctionComponent<SEOBlockProps> = ({title, content}: SEOBlockProps) => {
    return !!content ? (
        <div data-automation={"x-seo-block"} className={styles.seoContainer}>
            <div className={styles.seoText}>
                <div className="extraSmallOnly">
                    <Expandable
                        variant={"compact"}
                        direction={"up"}
                        headerText={<FormattedMessage {...messages.categoryOverviewReadMore} />}
                        toggleHeaderText={<FormattedMessage {...messages.categoryOverviewReadLess} />}>
                        <DisplayLimitLines lines={5}>
                            <TextBlock
                                title={<SectionTitle>{title}</SectionTitle>}
                                className={styles.seoTextContent}
                                body={content}
                            />
                        </DisplayLimitLines>
                    </Expandable>
                </div>
                <TextBlock
                    title={<SectionTitle>{title}</SectionTitle>}
                    className={`${styles.seoTextContent} small`}
                    body={content}
                />
            </div>
        </div>
    ) : null;
};

export default SEOBlock;
