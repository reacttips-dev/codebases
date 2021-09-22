import * as React from "react";
import {classname} from "utils/classname";
import * as styles from "./styles.css";
import {Theme, ContentPositions, BackgroundWidth} from "models";
import StyledHTML from "components/StyledHTML";
import {GlobalStyles} from "pages/PageLayouts/";
import SectionTitle from "components/SectionTitle";
import ContentContainer, {ContainerComponentProps} from "components/DynamicContent/ContentContainer";

export interface TextBlockProps {
    title?: React.ReactNode | string;
    body?: string;
    className?: string;
    isLegal?: boolean;
    textAlignment?: ContentPositions;
    textTheme?: Theme;
}

export const TextBlock: React.FunctionComponent<TextBlockProps> = ({
    title,
    body,
    children,
    className = "",
    textAlignment = ContentPositions.left,
    isLegal = false,
    textTheme = Theme.dark,
}) => {
    const contextStyles = React.useContext(GlobalStyles);
    return (
        <div className={classname([styles.textBlockContainer, styles[textTheme]])}>
            <div
                className={classname([
                    className,
                    contextStyles.contentSections.textContent,
                    styles.textBlock,
                    styles[`text${textAlignment}`],
                    isLegal && styles.legal,
                ])}>
                {!!title && <SectionTitle className={styles.title}>{title}</SectionTitle>}
                <StyledHTML body={body}>{children}</StyledHTML>
            </div>
        </div>
    );
};

const WrappedTextBlock: React.FC<TextBlockProps & ContainerComponentProps> = (props) => {
    const {backgroundColour, displayOptions = {}} = props;
    const contextStyles = React.useContext(GlobalStyles);

    const containerClassName = classname([
        styles.textBlockContainer,
        displayOptions.backgroundWidth === BackgroundWidth.browserSize && contextStyles.browserSizeLayout,
        backgroundColour && styles.wPadding,
    ]);

    const contentClassName = classname([
        contextStyles.siteSizeLayout,
        backgroundColour && contextStyles.contentSections.backgroundMountedContent,
    ]);

    return (
        <ContentContainer {...props} className={containerClassName}>
            <div className={contentClassName}>
                <TextBlock {...props}>{props.children}</TextBlock>
            </div>
        </ContentContainer>
    );
};

export default WrappedTextBlock;
