import React, { Component } from "react";
import { GridLayout } from "@egjs/react-infinitegrid";
import { ShowCenterSpinner } from "./statelessView";

class FiniteGridLayout extends Component {
  render() {
    const { childElements, loaded } = this.props;

    return (
      <GridLayout
        className="gridlayout gridlayout-container"
        loading={<ShowCenterSpinner loaded={loaded} />}
        options={{
          isOverflowScroll: false,
          useFit: true,
          useRecycle: true,
          horizontal: false,
          isConstantSize: true,
          isEqualSize: true,
        }}
        layoutOptions={{
          margin: 15,
          align: "start",
        }}
        onLayoutComplete={(e) => {
          !e.isLayout && e.endLoading();
        }}
        onAppend={(e) => {}}
      >
        {childElements}
      </GridLayout>
    );
  }
}

FiniteGridLayout.propTypes = {};

export default FiniteGridLayout;
