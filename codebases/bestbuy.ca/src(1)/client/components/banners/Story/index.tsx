import * as React from "react";
import {BackgroundWidth, BackgroundDisplayOptions, TextLayout} from "models";
import {classname, classIf} from "utils/classname";
import * as styles from "./style.css";
import StoryRow, {StoryRowProps} from "./components/StoryRow";
import Headline from "components/banners/components/Headline";
import {GlobalStyles} from "pages/PageLayouts/";
import getBackgroundSizing from "components/DynamicContent/helpers/getBackgroundSizing";

export interface StoryProps {
    title?: string;
    displayOptions?: BackgroundDisplayOptions;
    storyRowList?: StoryRowProps[];
}

export const Story: React.FC<StoryProps> = (props) => {
    const {displayOptions = {}, storyRowList, title} = props;
    const {backgroundColour, backgroundWidth, theme} = displayOptions;
    const bgStyles = backgroundColour ? {backgroundColor: backgroundColour} : {};
    const contextStyles = React.useContext(GlobalStyles);
    const singleStory = storyRowList && storyRowList.length === 1;
    const backgroundSizing = backgroundWidth && getBackgroundSizing(backgroundWidth);
    return (
        <div
            className={classname([
                styles.StoryContainer,
                classIf(styles.hasBackground, !!backgroundColour),
                styles[theme as string],
            ])}>
            <div
                style={bgStyles}
                className={classname([
                    styles.StoryBackground,
                    classIf(contextStyles.browserSizeLayout, backgroundSizing === BackgroundWidth.browserSize),
                ])}
            />
            {title && <Headline className={styles.SectionTitle}>{title}</Headline>}
            {storyRowList &&
                storyRowList.map((storyProps: StoryRowProps, index: number) => {
                    const {id, background = {}} = storyProps;
                    const {backgroundImage} = background;
                    const storyRowId = !!id ? {id} : {};

                    // Cannot deconstruct as lint catches shadowed variable from parent
                    const backgroundColor =
                        !!storyProps && storyProps.background && storyProps.background.backgroundColour;
                    const textLayout =
                        !!storyProps && storyProps.displayOptions && storyProps.displayOptions.textLayout;

                    const hasBackgroundImage: boolean =
                        !!backgroundImage &&
                        !!Object.keys(backgroundImage).filter((k) => backgroundImage[k as any] !== null).length;
                    const lastChild = index === storyRowList.length - 1;
                    const longStory = textLayout === TextLayout.long;

                    return (
                        <StoryRow
                            key={index}
                            className={classname([
                                styles.storyRowItem,
                                classIf(styles.bgImg, !!hasBackgroundImage),
                                classIf(styles.bgColor, !!backgroundColor),
                                classIf(styles.lastChild, !!lastChild),
                                classIf(styles.singleStory, !!singleStory),
                                classIf(styles.longRow, !!longStory),
                            ])}
                            {...storyRowId}
                            {...storyProps}
                        />
                    );
                })}
        </div>
    );
};

export default Story;
