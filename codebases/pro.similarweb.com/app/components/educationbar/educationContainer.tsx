import { i18nFilter } from "filters/ngFilters";
import { AssetsService } from "services/AssetsService";
import * as React from "react";
import { SubNavEducationComponent } from "@similarweb/ui-components/dist/SubNavEducationComponent/src/SubNavEducationComponent";
import { SubNavEducationBar } from "@similarweb/ui-components/dist/subNavEducationBar/src/SubNavEducationBar";
import { useSelector, useDispatch } from "react-redux";
import { EducationalVideoModal } from "components/Modals/src/EducationalVideoModal";
import { FunctionComponent, useState } from "react";
import { showIntercomTour } from "services/IntercomProductTourService";
import { ArticlesService } from "components/React/EducationBarContainer/ArticlesService";
import { toggleEducationBar } from "actions/educationBarActions";
import useLocalStorage from "custom-hooks/useLocalStorage";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

declare const window;

interface IEducationContainer {
    onCloseEducationComponent: () => void;
}
export const EducationStorageKey = "click-on-close-education-component";

export const EducationContainer: FunctionComponent<IEducationContainer> = (props) => {
    const [educationalVideoModalIsOpen, setEducationalVideoModalIsOpen] = useState(false);
    const [showBar, setShowBar] = useLocalStorage(EducationStorageKey);
    const dispatch = useDispatch();

    const currentPage = useSelector((state) => {
        const {
            routing: { currentPage },
        } = state;
        return currentPage;
    });

    const educationData = window.education?.[currentPage];

    const videoProps = {
        url: `https://vimeo.com/${educationData?.video}`,
        videoConfig: {
            autoPlay: true,
            width: "100%",
            height: "100%",
        },
    };

    const onVideoClick = () => {
        TrackWithGuidService.trackWithGuid("education.bar.click.video.button", "click");
        setEducationalVideoModalIsOpen(true);
    };

    const onVideoModelCloseClick = () => {
        setEducationalVideoModalIsOpen(false);
    };
    const onTourClick = () => {
        TrackWithGuidService.trackWithGuid("education.bar.click.tour.button", "click");
        showIntercomTour(educationData.intercom);
    };

    const onGetStartedClick = async () => {
        TrackWithGuidService.trackWithGuid("education.bar.click.article.button", "click");
        const GetArticleById = await ArticlesService.GetArticleById(educationData.zendesk).then(
            (res) => {
                const parsed = parsedArticle(res);
                dispatch(toggleEducationBar(true, parsed));
            },
        );
    };

    const parsedArticle = (response) => {
        return {
            active: response.draft,
            content: response.body,
            docType: 1,
            id: response.id,
            link: response.html_url,
            title: response.title,
            attachments: [],
        };
    };

    const onCloseEducationComponent = () => {
        TrackWithGuidService.trackWithGuid("education.bar.click.close.button", "close");
        setShowBar("true");
        props.onCloseEducationComponent();
    };

    const onCloseEducationBar = () => {
        TrackWithGuidService.trackWithGuid("education.bar.click.close.button", "close");
        props.onCloseEducationComponent();
    };

    const showVideoButton = !!educationData?.video;
    const showTourButton = !!educationData?.intercom;
    const showArticleButton = !!educationData?.zendesk;
    const showEducation = !!educationData;

    return (
        <>
            {showEducation ? (
                showBar ? (
                    <SubNavEducationBar
                        onCloseEducationBar={onCloseEducationBar}
                        onWatchVideoClick={showVideoButton && onVideoClick}
                        onGetStartedClick={showArticleButton && onGetStartedClick}
                        onTourClick={showTourButton && onTourClick}
                        videoText={i18nFilter()("education.bar_see.video_button")}
                        helpText={i18nFilter()("education.bar_see.article_button")}
                        tourText={i18nFilter()("education.bar_see.tour_button")}
                        extraMarginBottom={false}
                    />
                ) : (
                    <SubNavEducationComponent
                        onCloseEducationBar={onCloseEducationComponent}
                        onWatchVideoClick={showVideoButton && onVideoClick}
                        onGetStartedClick={showArticleButton && onGetStartedClick}
                        onTourClick={showTourButton && onTourClick}
                        videoText={i18nFilter()("education.bar_see.video_button")}
                        helpText={i18nFilter()("education.bar_see.article_button")}
                        tourText={i18nFilter()("education.bar_see.tour_button")}
                        closeText={i18nFilter()("education.bar_later_button")}
                        Image={AssetsService.assetUrl("images/All-categories.svg")}
                        title={i18nFilter()("education.component.title")}
                        subTitle={i18nFilter()("education.component.sub_title")}
                    />
                )
            ) : null}
            <EducationalVideoModal
                isOpen={educationalVideoModalIsOpen}
                onCloseClick={onVideoModelCloseClick}
                videoConfig={videoProps}
                shouldCloseOnOverlayClick={true}
            />
        </>
    );
};
