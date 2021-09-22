import * as React from "react";
import * as styles from "./styles.css";
import HelpCategory, {HelpCategoryProps} from "../HelpCategory";
import {FormattedMessage} from "react-intl";

import messages from "./translations/messages";
import {GlobalStyles} from "pages/PageLayouts";
import {classname} from "utils/classname";
import SectionTitle, {TitleAppearance} from "components/SectionTitle";

export interface Props {
    helpCategories: HelpCategoryProps[];
    isGreaterThanXS: boolean;
}

export const HelpCategoryBox = (props: Props) => {
    const contextStyles = React.useContext(GlobalStyles);
    return (
        <div className={classname([styles.sectionWrapper, contextStyles.browserSizeLayout])}>
            <div className={styles.helpCategoryBox}>
                <div className={styles.helpCategoryContainer}>
                    <SectionTitle appearance={TitleAppearance.d2} className={styles.sectionTitle}>
                        <h2>
                            <FormattedMessage {...messages.helpHeading} />
                        </h2>
                    </SectionTitle>
                    {props.helpCategories.map((category, index) => {
                        return (
                            <HelpCategory
                                className={styles.helpCategory}
                                seoText={category.seoText}
                                topics={category.topics}
                                categoryId={category.categoryId}
                                logo={category.logo}
                                isGreaterThanXS={props.isGreaterThanXS}
                                key={index}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default HelpCategoryBox;
