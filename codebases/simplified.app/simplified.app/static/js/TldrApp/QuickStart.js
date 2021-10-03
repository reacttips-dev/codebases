import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { fetchStories, resetStories } from "../_actions/storiesActions";
import { showToast } from "../_actions/toastActions";
import TLDRFeaturedTemplateSwiper from "../_components/common/TLDRFeaturedTemplateSwiper";
import TldrLearnSection from "../_components/common/TldrLearnSection";
import TLDRSwiper from "../_components/common/TLDRSwiper";
import StoryCard from "../_components/home/StoryCard";
import { TAB_MY_STORIES } from "../_components/details/constants";
import { StyledMarketPlaceSwiperButton } from "../_components/styled/details/stylesDetails";
import {
  HomeComponent,
  QuickStartComponent,
  StyledMarkerplaceHelpText,
  StyledMarketplaceContent,
  StyledSectionTitle,
  StyledSectionTitleRow,
  StyledDashboardBannerRow,
  StyledDashboardGetStartedBox,
  StyledSimplifiedSpan,
  StyledDashboardGetStartedBoxWrapper,
  StyledGetStartedDetailWrapper,
} from "../_components/styled/home/stylesHome";
import { lightInactive } from "../_components/styled/variable";
import { analyticsTrackEvent } from "../_utils/common";
import { LAYOUTS, MAGICAL, PROJECTS, TEMPLATES_SCREEN } from "../_utils/routes";

let marketPlaceTemplateFormatsSwiperParams = {
  spaceBetween: 20, // padding between 2 elements (in px)
  slidesPerView: 5,
  freeMode: true,
  shouldSwiperUpdate: true,
  runCallbacksOnInit: true,
  mousewheel: false,
  containerClass: "marketplace-recent-template-formats-swiper-container",
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
    disabledClass: "swiper-button-disabled",
  },
  breakpoints: {
    768: {
      slidesPerView: 5,
      spaceBetween: 20,
    },
    640: {
      slidesPerView: 3.5,
      spaceBetween: 10,
    },
    320: {
      slidesPerView: 1.5,
      spaceBetween: 10,
    },
  },
  renderPrevButton: () => (
    <StyledMarketPlaceSwiperButton
      className={"swiper-button-prev"}
      variance="left"
    >
      <div className="swiper-button-inner-div">
        <FontAwesomeIcon icon="chevron-left" />
      </div>
    </StyledMarketPlaceSwiperButton>
  ),
  renderNextButton: () => (
    <StyledMarketPlaceSwiperButton
      className={"swiper-button-next"}
      variance="right"
    >
      <div className="swiper-button-inner-div">
        <FontAwesomeIcon icon="chevron-right" />
      </div>
    </StyledMarketPlaceSwiperButton>
  ),
};

class QuickStart extends Component {
  signal = axios.CancelToken.source();

  componentDidMount() {
    this.props.fetchStories("", "", 1, { ...this.props, isRecent: true });
  }

  componentWillUnmount() {
    this.signal.cancel("The user aborted a request.");
  }

  getActionButton = (icon, title) => {
    return (
      <div className="action-button">
        <div
          className="icon-holder"
          onClick={() => this.props.history.push(LAYOUTS)}
        >
          <FontAwesomeIcon icon={icon} size="2x" />
        </div>
        <span
          className="title"
          onClick={() => this.props.history.push(LAYOUTS)}
        >
          {title}
        </span>
      </div>
    );
  };

  render() {
    const loaded = this.props.stories.loaded;
    let results = [];
    if (loaded && this.props.stories?.recent?.results) {
      results = this.props.stories?.recent.results.slice(0, 10);
    }
    const { first_name } = this.props.auth.payload.user;

    let firstName = first_name.length === 0 ? "there" : first_name;

    return (
      <HomeComponent>
        <StyledMarketplaceContent>
          <StyledDashboardBannerRow className={"d-flex d-sm-flex d-md-none"}>
            <div>
              <StyledMarkerplaceHelpText
                className="marketplace-template-subheader"
                style={{ textAlign: "center" }}
              >
                Hi {firstName} 👋🏼, Let's get started.
              </StyledMarkerplaceHelpText>
              <StyledSectionTitle style={{ textAlign: "center" }}>
                Do more with less using{" "}
                <StyledSimplifiedSpan>Simplified</StyledSimplifiedSpan>
              </StyledSectionTitle>
            </div>
          </StyledDashboardBannerRow>
          <QuickStartComponent className={"mt-0 mt-md-3"}>
            <StyledSectionTitleRow className="mb-3 d-none d-md-block">
              <div>
                <StyledMarkerplaceHelpText className="marketplace-template-subheader">
                  Hi {firstName} 👋🏼, Let's get started.
                </StyledMarkerplaceHelpText>
                <StyledSectionTitle>
                  Do more with less using{" "}
                  <StyledSimplifiedSpan>Simplified</StyledSimplifiedSpan>
                </StyledSectionTitle>
              </div>
            </StyledSectionTitleRow>
            <StyledDashboardBannerRow className={"d-none d-md-flex"}>
              <StyledSectionTitle style={{ fontSize: "32px" }}>
                What would you like to do?
              </StyledSectionTitle>
              <StyledDashboardGetStartedBoxWrapper>
                <StyledDashboardGetStartedBox
                  onClick={(event) => {
                    this.props.history.push(TEMPLATES_SCREEN);
                    analyticsTrackEvent("exploreTemplates");
                  }}
                >
                  <StyledGetStartedDetailWrapper>
                    <StyledSectionTitle style={{ fontSize: "24px" }}>
                      Browse Templates
                    </StyledSectionTitle>
                    <StyledMarkerplaceHelpText className="marketplace-template-subheader">
                      Take your designs to the next level
                    </StyledMarkerplaceHelpText>
                  </StyledGetStartedDetailWrapper>
                  <div className="view-all" style={{ color: lightInactive }}>
                    <span className="view-all mr-2">Get Started</span>
                    <FontAwesomeIcon icon="arrow-right" />
                  </div>
                </StyledDashboardGetStartedBox>
                <StyledDashboardGetStartedBox
                  onClick={() => {
                    this.props.history.push(MAGICAL);
                    analyticsTrackEvent("openAiAssistant");
                  }}
                >
                  <StyledGetStartedDetailWrapper>
                    <StyledSectionTitle style={{ fontSize: "24px" }}>
                      Content Generator
                    </StyledSectionTitle>
                    <StyledMarkerplaceHelpText className="marketplace-template-subheader">
                      Let AI create stunning content for you
                    </StyledMarkerplaceHelpText>
                  </StyledGetStartedDetailWrapper>
                  <div className="view-all" style={{ color: lightInactive }}>
                    <span className="view-all mr-2">Get Started</span>
                    <FontAwesomeIcon icon="arrow-right" />
                  </div>
                </StyledDashboardGetStartedBox>
              </StyledDashboardGetStartedBoxWrapper>
            </StyledDashboardBannerRow>

            {/* Recent */}
            {loaded && results.length > 0 && (
              <>
                <StyledSectionTitleRow className="mt-0 mt-md-3">
                  <div>
                    <StyledMarkerplaceHelpText className={"d-none d-md-block"}>
                      Pick up where you left off
                    </StyledMarkerplaceHelpText>
                    <StyledSectionTitle>Recent projects</StyledSectionTitle>
                  </div>
                  <div
                    className="view-all"
                    onClick={() => {
                      this.props.history.push(PROJECTS);
                    }}
                  >
                    <span className="view-all mr-2">View all</span>
                    <FontAwesomeIcon icon="arrow-right" />
                  </div>
                </StyledSectionTitleRow>
                <TLDRSwiper
                  swiperParams={marketPlaceTemplateFormatsSwiperParams}
                >
                  {results.map((story, index) => (
                    <div key={index}>
                      <StoryCard
                        key={story.id}
                        story={story}
                        tab={TAB_MY_STORIES}
                        template={story.template}
                        height={"100%"}
                        isRecent={true}
                      />
                    </div>
                  ))}
                </TLDRSwiper>
              </>
            )}
            <TLDRFeaturedTemplateSwiper
              format={"instagram-stories"}
              category={"health-beauty"}
              categoryId={"5949ca1f-b6a3-4f0a-b158-a9ff161ad96e"}
            ></TLDRFeaturedTemplateSwiper>
            <TldrLearnSection></TldrLearnSection>
          </QuickStartComponent>
        </StyledMarketplaceContent>
      </HomeComponent>
    );
  }
}

QuickStart.propTypes = {
  fetchStories: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  stories: state.stories,
  errors: state.errors,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  showToast: (payload) => dispatch(showToast(payload)),
  fetchStories: (status, searchPhrase, pageNo, props) =>
    dispatch(fetchStories(status, searchPhrase, pageNo, props)),
  resetStories: () => dispatch(resetStories()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(QuickStart));
