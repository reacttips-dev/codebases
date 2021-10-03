import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as BrandIcon } from "../../assets/logo/smp-s.svg";

export class BrandLogo extends Component {
  render() {
    return (
      <>
        {/* Brand Logo */}
        <Link to="#">
          <BrandIcon className="brand-image" />
        </Link>
      </>
    );
  }
}

export default BrandLogo;
