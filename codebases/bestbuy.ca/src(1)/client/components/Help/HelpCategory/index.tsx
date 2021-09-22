import * as React from "react";
import * as styles from "./styles.css";
import Link from "components/Link";
import {Key} from "@bbyca/apex-components";
import {HelpLink} from "models/Help";
import {classname} from "utils/classname";

export interface HelpCategoryProps {
    className?: string;
    categoryId: string;
    logo: {
        x1: string;
    };
    seoText: string;
    isGreaterThanXS: boolean;
    topics: HelpLink[];
}

export const HelpCategory = (props: HelpCategoryProps) => (
    <div className={classname([styles.categoryBox, props.className])}>{getSubCategories(props)}</div>
);

const getImage = (path: string) => <img src={path} className={styles.logo} alt="" role="presentation" />;

const getSubCategories = (props: HelpCategoryProps) => {
    const helpCategoryProps = {
        params: [props.categoryId],
        to: "help" as Key,
    };

    const CategoryHeading = () => (
        <>
            {props.logo && getImage(props.logo.x1)}
            <h3>{props.seoText}</h3>
        </>
    );

    if (props.isGreaterThanXS) {
        return (
            <div className={styles.categoryWrapper}>
                <CategoryHeading />
                <hr />
                <ul className={styles.categoryList}>
                    {props.topics &&
                        props.topics.map((topic, index) => {
                            const helpCategoriesProps = {
                                params: [topic.categoryId, topic.topicId],
                                to: "help" as Key,
                            };
                            return (
                                <li key={topic.topicId}>
                                    <Link {...helpCategoriesProps}>{topic.seoText}</Link>
                                </li>
                            );
                        })}
                </ul>
            </div>
        );
    }
    return (
        <Link {...helpCategoryProps}>
            <div className={styles.categoryWrapper}>
                <CategoryHeading />
            </div>
        </Link>
    );
};

export default HelpCategory;
