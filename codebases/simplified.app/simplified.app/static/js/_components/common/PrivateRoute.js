import React from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  ACCESS_DENIED,
  CREATE_WORKSPACE,
  LOGIN,
  SHOPIFY_LOGIN,
} from "../../_utils/routes";
import { v4 } from "uuid";
import { SHOPIFY_AUTH_URL } from "../../_actions/endpoints";
import Format from "string-format";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PrivateRoute = ({ component: Component, auth, ...rest }) => {
  let query = useQuery();

  const ShopifyRedirectPath = (props) => {
    let shop = query.get("shop");
    if (!shop) {
      return (
        <Redirect
          to={{ pathname: ACCESS_DENIED, state: { from: props.location } }}
        />
      );
    }

    const nonce = v4();
    localStorage.setItem("nonce", nonce);
    let url = Format(SHOPIFY_AUTH_URL, shop, nonce);
    window.open(url, "_self");
  };

  const renderComponent = (props) => {
    // Check whether use is Authenticated or not
    if (auth.isAuthenticated) {
      // If User is authenicated

      // If the path is Shopify login
      if (rest.path === SHOPIFY_LOGIN) {
        return <ShopifyRedirectPath />;
      }

      // If the path is Create workspace or user already have workspace(s)
      if (
        rest.path === CREATE_WORKSPACE ||
        (auth.payload.orgs !== null && auth.payload.orgs.length > 0)
      ) {
        return <Component {...props} />;
      }

      // If no workspace is there
      if (auth.payload.orgs === null || auth.payload.orgs.length === 0) {
        return (
          <Redirect
            to={{
              pathname: CREATE_WORKSPACE,
              state: { from: props.location },
            }}
          />
        );
      }
    } else {
      // If User is not  authenicated

      // If the path is Shopify login
      if (rest.path === SHOPIFY_LOGIN) {
        return <ShopifyRedirectPath />;
      }
      return (
        <Redirect to={{ pathname: LOGIN, state: { from: props.location } }} />
      );
    }
  };

  return <Route {...rest} render={renderComponent} />;
};

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
