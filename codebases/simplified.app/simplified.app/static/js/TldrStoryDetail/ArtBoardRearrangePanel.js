import React, { Component } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ArtBoardRearrangeGrid from "./ArtBoardRearrangeGrid";

class ArtBoardRearrangePanel extends Component {
  render() {
    return (
      <DndProvider backend={HTML5Backend}>
        <ArtBoardRearrangeGrid />
      </DndProvider>
    );
  }
}

ArtBoardRearrangePanel.propTypes = {};

export default ArtBoardRearrangePanel;
