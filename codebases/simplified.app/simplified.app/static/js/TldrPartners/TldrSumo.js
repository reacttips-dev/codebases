import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Redirect, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import {
  BrandTextLogo,
  ShowCenterSpinner,
} from "../_components/common/statelessView";
import Axios from "axios";
import { handleHTTPError } from "../_actions/errorHandlerActions";
import { SUMO_DEAL_ENDPOINT } from "../_actions/endpoints";
import Format from "string-format";
import { StyledSumoActivationPage } from "../_components/styled/workspace/styles";
import SumoActivationForm from "./SumoActivationForm";
import SumoSelectWorkspaceForm from "./SumoSelectWorkspaceFrom";
import { ROOT } from "../_utils/routes";
import { StyledInterComWrapper } from "../TldrApp/TldrHomeBaseStyles";
import { IntercomCustomIcon } from "../_components/styled/home/statelessView";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const TldrSumo = (props) => {
  let query = useQuery();
  const [deal, setDeal] = useState(query.get("deal"));
  const [loaded, setLoaded] = useState(false);
  const [details, setDetails] = useState();
  const [error, setError] = useState();
  const { isAuthenticated } = props.auth;

  function fetchDealDetails(deal) {
    // Get all the deal id
    Axios.get(Format(SUMO_DEAL_ENDPOINT, deal)).then(
      (response) => {
        setDetails(response.data);
        setLoaded(true);
      },
      (error) => {
        setLoaded(true);
        props.handleHTTPError(error, props);
      }
    );
  }

  useEffect(() => {
    fetchDealDetails(deal);
    return () => {};
  }, [deal]);

  if (isAuthenticated && details?.new_user) {
    return <Redirect to={ROOT} />;
  }

  return (
    <>
      {!loaded ? (
        <ShowCenterSpinner loaded={loaded}></ShowCenterSpinner>
      ) : (
        details && (
          <StyledSumoActivationPage>
            <div className="tldr-dark-overlay" />
            <div className="appsumo-box">
              <div className="appsumo-card-body">
                <div className="appsumo-simplified-logo">
                  <BrandTextLogo height={60} width={160} />
                </div>

                {details?.new_user ? (
                  <SumoActivationForm details={details} />
                ) : (
                  <SumoSelectWorkspaceForm details={details} />
                )}
              </div>
            </div>
            <StyledInterComWrapper className="d-none d-sm-none d-md-block">
          <IntercomCustomIcon />
        </StyledInterComWrapper>
          </StyledSumoActivationPage>
        )
      )}
    </>
  );
};

TldrSumo.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  handleHTTPError: (error, props) => dispatch(handleHTTPError(error, props)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TldrSumo);
