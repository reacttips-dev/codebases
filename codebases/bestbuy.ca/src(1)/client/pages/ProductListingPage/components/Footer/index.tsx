import * as React from "react";
import SEOBlock, {SEOBlockProps} from "../SEOBlock";
import styles from "./style.css";
import GlobalContent, {OwnProps as GlobalContentProps} from "components/GlobalContent";

interface SEOBlock {
    seoBlock: SEOBlockProps;
}

interface CMSContent {
    pageBottomGlobalContent?: GlobalContentProps;
    pageFooterGlobalContent?: GlobalContentProps;
}

export type PLPFooterProps = SEOBlock & CMSContent;

const PLPFooter: React.FC<PLPFooterProps> = ({
    seoBlock,
    pageBottomGlobalContent: bottomGlobalContent,
    pageFooterGlobalContent: footerGlobalContent,
}) => {
    const {title, content} = seoBlock;
    const defaultDivider = () => <hr className={styles.dividerWithMargin} />;

    return (
        <>
            {!!bottomGlobalContent && !!bottomGlobalContent.context && (
                <GlobalContent
                    context={bottomGlobalContent.context}
                    contentType={bottomGlobalContent.contentType}
                    before={bottomGlobalContent.before || defaultDivider}
                />
            )}
            <SEOBlock title={title} content={content} />
            {!!footerGlobalContent && !!footerGlobalContent.context && (
                <GlobalContent
                    context={footerGlobalContent.context}
                    contentType={footerGlobalContent.contentType}
                    before={footerGlobalContent.before || defaultDivider}
                />
            )}
        </>
    );
};

export default PLPFooter;
