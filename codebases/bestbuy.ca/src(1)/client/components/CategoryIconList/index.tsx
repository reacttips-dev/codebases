import * as React from "react";
import StyledHTML from "components/StyledHTML";
import {Col, Row} from "@bbyca/ecomm-components";
import {classname} from "utils/classname";
import {IBrowser as ScreenSize} from "redux-responsive";
import {GlobalStyles} from "pages/PageLayouts";
import CategoryIcon, {CategoryIconProps} from "./components/CategoryIcon";
import * as styles from "./style.css";

export interface CategoryIconListProps {
    categoryList?: Array<CategoryIconProps | null>;
    text?: string;
}

export interface CategoryIconListBuildProps {
    isMobileApp: boolean;
    screenSize: ScreenSize;
    language: Language;
}

export const CategoryIconList: React.FC<CategoryIconListProps & CategoryIconListBuildProps> = (props) => {
    const {text, categoryList} = props;
    const contextStyles = React.useContext(GlobalStyles);
    return (
        <div className={styles.shopByCategoryHeader}>
            {text && (
                <StyledHTML className={classname([contextStyles.contentSections.textContent, styles.sectionText])}>
                    <p>{text}</p>
                </StyledHTML>
            )}
            {categoryList && <CategoryList {...props} />}
        </div>
    );
};

export const CategoryList: React.FC<CategoryIconListProps & CategoryIconListBuildProps> = ({
    categoryList,
    screenSize,
    language,
    isMobileApp,
}) => {
    return (
        <Row className={styles.container}>
            {categoryList &&
                categoryList.map((category, index) => (
                    <Col xs={4} sm={2} className={styles.category} key={`${category?.text}${index}`}>
                        <CategoryIcon
                            language={language}
                            screenSize={screenSize}
                            isMobileApp={!!isMobileApp}
                            {...category}
                        />
                    </Col>
                ))}
        </Row>
    );
};

CategoryIconList.displayName = "CategoryIconListWithContainer";

export default CategoryIconList;
