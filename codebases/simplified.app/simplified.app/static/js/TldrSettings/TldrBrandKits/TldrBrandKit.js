import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
  StyledSettingsBaseDiv,
  StyledBrandKitContentContainer,
} from "../../_components/styled/settings/stylesSettings";
import {
  ShowBrandKitInfo,
  ShowCenterSpinner,
} from "../../_components/common/statelessView";
import { StyledAddBrandkitButton } from "../../_components/styled/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BrandKitSection from "./BrandKitSection";
import { addBrandKit, fetchBrandKits } from "../../_actions/brandKitActions";
import { connect } from "react-redux";
import FontHandler from "../../_components/canvas/handlers/FontHandler";
import { getSubscription } from "../../_actions/subscriptionActions";
import { checkFeatureAvailability } from "../../_utils/common";
import { USE_BRANDKIT } from "../../_components/details/constants";
import TldrVideoInAction from "../../TldrAi/TldrVideoInAction";
import TldrUpgradeSubscriptionModal from "../TldrBillingAndPayments/Modals/TldrUpgradeSubscriptionModal";

class TldrBrandKit extends Component {
  signal = axios.CancelToken.source();

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      showTrialPeriodEndedModal: false,
      showUpgradeSubscriptionModal: false,
    };
  }

  componentDidMount() {
    this.getUserBrandKits();
    this.checkForTrialPeriod();
  }

  getUserBrandKits = () => {
    this.props.fetchBrandKits().then((brandKits) => {
      let fontHandler = new FontHandler(null);
      brandKits.forEach((brandKit, index) => {
        fontHandler.addFonts(brandKit.fonts);
      });
    });
  };

  checkForTrialPeriod = () => {
    const { subscription } = this.props;
    this.props.getSubscription().then(() => {
      if (subscription.subscribedPlan?.trial_remaining_days < 0) {
        this.setState({
          ...this.state,
          showTrialPeriodEndedModal: true,
        });
      }
    });
  };

  createBrandKit = () => {
    const isFeatureAvailable = checkFeatureAvailability(
      this.props,
      USE_BRANDKIT
    );

    if (!isFeatureAvailable) {
      this.setState({ showUpgradeSubscriptionModal: true });
    } else {
      this.props.addBrandKit(this.props.brandKit.brandkitsCount, this.signal);
    }
  };

  render() {
    const { brandkitPayload, loaded, brandkitsCount } = this.props.brandKit;
    var childElement;
    if (loaded) {
      childElement = brandkitPayload.map((brandKit, index) => {
        return <BrandKitSection key={index} brandKitInfo={brandKit} />;
      });
    }

    return (
      <StyledSettingsBaseDiv>
        {!loaded ? (
          <ShowCenterSpinner loaded={loaded} />
        ) : (
          <StyledBrandKitContentContainer>
            {brandkitsCount > 0 ? (
              <>{childElement}</>
            ) : (
              <>
                <ShowBrandKitInfo text="Upload your logo and fonts, add brand colors and use them across your projects" />
                <TldrVideoInAction
                  title={"Setup Brand Kit"}
                  videoInAction={"https://www.youtube.com/embed/tA8TJSP_Nqw"}
                />
              </>
            )}
            <StyledAddBrandkitButton
              type="submit"
              onClick={this.createBrandKit}
              bottomMargin={true}
              topMargin={true}
            >
              Add Brand Kit
              <FontAwesomeIcon icon="plus" className="ml-2" />
            </StyledAddBrandkitButton>
          </StyledBrandKitContentContainer>
        )}

        <TldrUpgradeSubscriptionModal
          show={this.state.showUpgradeSubscriptionModal}
          onHide={() => {
            this.setState({
              ...this.state,
              showUpgradeSubscriptionModal: false,
            });
          }}
        />
      </StyledSettingsBaseDiv>
    );
  }
}

TldrBrandKit.propTypes = {
  fetchBrandKits: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  brandKit: state.brandKit,
  subscription: state.subscription,
});

const mapDispatchToProps = (dispatch) => ({
  fetchBrandKits: () => dispatch(fetchBrandKits()),
  addBrandKit: (count, signalToken) =>
    dispatch(addBrandKit(count, signalToken)),
  getSubscription: () => dispatch(getSubscription()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TldrBrandKit);
