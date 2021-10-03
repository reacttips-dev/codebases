import React, { Component } from "react";
import TldrBase from "../TldrLogin/TldrBase";
import { Link } from "react-router-dom";
import { ROOT } from "../_utils/routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class Tldr404 extends Component {
  render() {
    return (
      <TldrBase heading={"Sorry!"} subheading={"Oh no! Page not found."}>
        <div className="text-center mt-2 secondary-links">
          <Link to={ROOT}>
            <FontAwesomeIcon icon="arrow-left" className="mr-1" />
            Back to login
          </Link>
        </div>
      </TldrBase>
    );
  }
}
