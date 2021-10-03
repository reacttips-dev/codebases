import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { StyledMarketplaceDesignCard } from "../styled/styles";
import {
  MarketplaceTemplatesAction,
  TldrProgressDialog,
} from "../common/statelessView";
import { cloneTemplate } from "../../_actions/storiesActions";
import axios from "axios";
import { withRouter } from "react-router-dom";
import TLDRImage from "../common/TLDRImage";
import TldrGuidedTour from "../partners/TldrGuidedTour";
import { redirect } from "../../_actions/commonAction";
import { STORY_DETAIL } from "../../_utils/routes";
import Format from "string-format";
import { analyticsTrackEvent } from "../../_utils/common";
import TLDRSwiperImage from "../common/TLDRSwiperImage";

export const StoryCardCoverImage = ({
  imageSrc,
  width,
  height,
  altTitle,
  isUsedInSwiper,
}) => {
  return (
    <>
      {isUsedInSwiper ? (
        <TLDRSwiperImage
          src={imageSrc}
          width={152.5}
          height={(152.5 * parseInt(height)) / parseInt(width)}
        />
      ) : (
        <TLDRImage
          src={imageSrc}
          width={152.5}
          height={(152.5 * parseInt(height)) / parseInt(width)}
          alt={altTitle}
        />
      )}
    </>
  );
};

export class DesignCard extends Component {
  signal = axios.CancelToken.source();
  constructor(props) {
    super(props);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.state = {
      isHovering: false,
      inProgress: "false",
      showCloneModal: false,
      startGuidedTour: false,
      showUpgradeSubscriptionModal: false,
    };
  }

  componentWillUnmount() {
    this.signal.cancel("The user aborted a request.");
  }

  handleMouseEnter() {
    this.setState({
      isHovering: true,
    });
  }

  handleMouseLeave() {
    this.setState({
      isHovering: false,
    });
  }

  toggleHoverState(state) {
    return {
      isHovering: !state.isHovering,
    };
  }

  onClick = () => {
    const { story } = this.props;
    const isGuidedTemplate = story.tags.includes("shopify");
    if (isGuidedTemplate) {
      this.setState({
        startGuidedTour: true,
      });
    } else {
      // const isFeatureAvailable = availableFeatures.findIndex(
      //   (feature) => feature.feature_code === USE_STUDIO
      // );
      this.setState({
        inProgress: true,
        showCloneModal: true,
      });
      this.props.cloneTemplate(this.props.story.id, this.signal, this.props);
      analyticsTrackEvent("cloneTemplate", {
        template: this.props.story.id,
      });
      // if (isFeatureAvailable !== -1) {
      // } else {
      //   // TODO(SUSHANT): show "upgrade plan to use this feature" modal.
      //   this.setState({ showUpgradeSubscriptionModal: true });
      // }
    }
  };

  render() {
    const { inProgress, showCloneModal, startGuidedTour } = this.state;
    const { story, showHoverOverlay, isUsedInSwiper } = this.props;
    const { id, image, image_height, image_width, title } = story;

    return (
      <StyledMarketplaceDesignCard>
        <div
          className="design-card-thumbnail"
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          onClick={this.onClick}
        >
          <StoryCardCoverImage
            imageSrc={image}
            width={image_width}
            height={image_height}
            altTitle={title}
            isUsedInSwiper={isUsedInSwiper}
          />
          {this.state.isHovering && showHoverOverlay && (
            <div className="actions">
              <MarketplaceTemplatesAction
                action="clone"
                id={id}
                icon="plus-circle"
                tooltip="Use Template"
                clickHandler={this.onClick}
                label="Use Template"
              />
            </div>
          )}
        </div>

        <TldrProgressDialog
          inprogress={inProgress}
          show={showCloneModal}
          onHide={() => {
            this.setState({
              ...this.state,
              showCloneModal: false,
            });
          }}
          onYes={() => {
            this.setState({
              inProgress: "true",
            });
          }}
        ></TldrProgressDialog>
        {startGuidedTour && (
          <TldrGuidedTour
            onComplete={(res) => {
              this.setState(
                {
                  ...this.state,
                  startGuidedTour: false,
                },
                () => {
                  this.props.redirect(
                    Format(
                      STORY_DETAIL,
                      res.data.organization,
                      res.data.id,
                      encodeURIComponent(res.data.title)
                    ),
                    this.props
                  );
                }
              );
            }}
            onHide={() => {
              this.setState({
                ...this.state,
                startGuidedTour: false,
              });
            }}
            templateId={this.props.story.id}
          ></TldrGuidedTour>
        )}
      </StyledMarketplaceDesignCard>
    );
  }
}

DesignCard.propTypes = {
  story: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  errors: state.errors,
});

const mapDispatchToProps = (dispatch) => ({
  cloneTemplate: (storyId, signal, props) =>
    dispatch(cloneTemplate(storyId, signal, props)),
  redirect: (path, props) => dispatch(redirect(path, props)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DesignCard));
