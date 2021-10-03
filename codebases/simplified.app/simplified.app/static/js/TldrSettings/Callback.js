import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Axios from "axios";

import { LOGIN_WITH_SHOPIFY, GENERIC_APP_CONNECT } from "../_actions/endpoints";
import Format from "string-format";
import TldrBase from "../TldrLogin/TldrBase";
import { Spinner } from "react-bootstrap";
import { ACCESS_DENIED, MY_APPS, ROOT } from "../_utils/routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { processLogin } from "../_actions/authActions";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Callback(props) {
  let query = useQuery();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("Connecting");
  const [message, setMessage] = useState("Connecting..");
  useEffect(() => {
    let shop = query.get("shop");
    let code = query.get("code");
    let state = query.get("state");
    if (!shop || !code || !state || state !== localStorage.getItem("nonce")) {
      props.history.push(ACCESS_DENIED);
      return;
    } else {
      const isAuthenticated = props.auth.isAuthenticated;
      let url = isAuthenticated
        ? Format(GENERIC_APP_CONNECT + "?shop={}", query.get("shop"))
        : Format(LOGIN_WITH_SHOPIFY, query.get("shop"));
      Axios.post(url, {
        code: code,
        app_id: "shopify_app",
        callback_url: "https://devang.staqlab-tunnel.com/settings/myapps",
      }).then(
        (response) => {
          setLoading(false);
          setTitle("Success.");
          setMessage("Successfully connected.");
          if (!isAuthenticated) {
            props.processLogin(response.data, props);
          } else {
            props.history.push(MY_APPS);
          }
        },
        (error) => {
          setLoading(false);
          setTitle("Failed");
          setMessage(
            "Oops, Something went wrong.Please contact online support."
          );
        }
      );
      // }
      return () => {};
    }
  }, []);

  return (
    <TldrBase>
      <div className="text-center">{title}</div>
      {loading && (
        <div className="row mb-3 social-buttons">
          <button
            type="submit"
            className="btn btn-outline-warning btn-lg tldr-login-btn"
          >
            <Spinner
              variant={"warning"}
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          </button>
        </div>
      )}
      <div className="text-center">{message}</div>
      <div className="text-center mt-2 secondary-links">
        <Link to={ROOT}>
          <FontAwesomeIcon icon="arrow-left" className="mr-1" />
          Back to login
        </Link>
      </div>
    </TldrBase>
  );
}

Callback.propTypes = {};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    processLogin: (data, props) => dispatch(processLogin(data, props)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Callback);
