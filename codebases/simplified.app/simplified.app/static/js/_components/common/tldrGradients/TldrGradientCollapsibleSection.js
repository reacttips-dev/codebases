import React, { Component } from "react";
import axios from "axios";
import { StyledGradientGrid } from "../../styled/details/stylesDetails";
import { GRADIENTS_ENDPOINT } from "../../../_actions/endpoints";
import GradientElement from "./GradientElement";
import { findIndex } from "lodash";
import TldrCollpasibleSection from "../TldrCollpasibleSection";

class TldrGradientCollapsibleSection extends Component {
  _isMounted = false;
  signalToken = axios.CancelToken.source();

  constructor(props) {
    super(props);

    this.state = {
      effects: { results: [] },
      isLoading: true,
      collapse: false,
      showSettings: null,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    axios
      .get(GRADIENTS_ENDPOINT, { cancelToken: this.signalToken.token })
      .then((res) => {
        let effects = res.data;
        effects.results = [...effects.results];
        if (this._isMounted) {
          this.setState({
            effects: effects,
            isLoading: false,
            showSettings: Array(effects.results.length).fill(false),
          });
        }
      })
      .catch((error) => {
        if (this._isMounted) {
          this.setState({
            isLoading: false,
          });
        }
      });
  }

  componentWillUnmount() {
    this.signalToken.cancel("The user aborted a request.");
    this._isMounted = false;
  }

  render() {
    const { canvasRef, mime } = this.props;
    const { effects, isLoading } = this.state;
    var bodyChildElement;
    if (!isLoading) {
      bodyChildElement = effects.results.map((effect, index) => {
        return (
          <GradientElement
            canvasRef={canvasRef}
            gradientData={effect.payload}
            gradientTitle={effect.title}
            key={index}
            changeSelectedColor={(newColor, selectedColor) =>
              this.onColorChangeComplete(
                newColor,
                selectedColor,
                effect.payload
              )
            }
            addNewColor={() => this.addNewColor(effect.payload)}
            rotateGradientAngle={(value) =>
              this.rotateGradientAngle(effect.payload, value)
            }
            adjustColors={(values) => this.adjustColors(effect.payload, values)}
            top={25}
            right={-77}
            alignSelf={
              index % 3 === 0
                ? "flex-start"
                : index % 3 === 1
                ? "center"
                : "flex-end"
            }
            mime={mime}
            eventKey={index}
            showSettings={this.state.showSettings[index]}
            onToggleSettings={() => this.handleToggleSettings(index)}
          />
        );
      });
    }

    return (
      <TldrCollpasibleSection
        title="Gradients"
        collapse={this.state.collapse}
        onToggleCollapse={this.handleToggleChange}
      >
        {!isLoading && (
          <StyledGradientGrid>{bodyChildElement}</StyledGradientGrid>
        )}
      </TldrCollpasibleSection>
    );
  }

  handleToggleChange = () => {
    if (this._isMounted) {
      this.setState({ collapse: !this.state.collapse });
    }
  };

  handleToggleSettings = (i) => {
    const { showSettings } = this.state;
    var collapseArray = showSettings;
    if (!collapseArray[i]) {
      collapseArray = Array(showSettings.length).fill(false);
    }
    collapseArray[i] = !collapseArray[i];
    if (this._isMounted) {
      this.setState({ showSettings: collapseArray });
    }
  };

  onColorChangeComplete = (newColor, selectedColor, selectedGrad) => {
    const { effects } = this.state;
    const availableGradients = effects.results;

    let selectedColorIndex = findIndex(selectedGrad.colorStops, (c) => {
      return selectedColor === c.color;
    });
    let selectedGradIndex = findIndex(availableGradients, (g) => {
      return selectedGrad.colorStops === g.payload.colorStops;
    });
    let newGradient;

    if (selectedColorIndex > -1) {
      selectedGrad.colorStops[selectedColorIndex].color = newColor;
      newGradient = selectedGrad.colorStops;
    }

    if (selectedGradIndex > -1) {
      availableGradients[selectedGradIndex].payload = {
        ...selectedGrad,
        colorStops: newGradient,
      };
    }
    if (this._isMounted) {
      this.setState({
        ...this.state,
        effects: { results: availableGradients },
      });
    }
  };

  addNewColor = (selectedGrad) => {
    const { effects } = this.state;
    const availableGradients = effects.results;
    let selectedGradIndex = findIndex(availableGradients, (g) => {
      return selectedGrad.colorStops === g.payload.colorStops;
    });

    if (selectedGradIndex > -1) {
      var stops = availableGradients[selectedGradIndex].payload.colorStops;
      if (stops.length === 3) {
        stops[2].offset = 50;
        stops[1].offset = 25;
        stops[0].offset = 0;
        stops.push({ color: "#FFFFFF", offset: 100 });
      } else if (stops.length === 2) {
        stops[1].offset = 50;
        stops[0].offset = 0;
        stops.push({ color: "#555555", offset: 100 });
      }
    }
    if (this._isMounted) {
      this.setState({
        ...this.state,
        effects: { results: availableGradients },
      });
    }
  };

  rotateGradientAngle = (selectedGrad, value) => {
    const { effects } = this.state;
    const availableGradients = effects.results;
    let selectedGradIndex = findIndex(availableGradients, (g) => {
      return selectedGrad.colorStops === g.payload.colorStops;
    });

    if (selectedGradIndex > -1) {
      availableGradients[selectedGradIndex].payload = {
        ...selectedGrad,
        degree: value,
      };
    }
    if (this._isMounted) {
      this.setState({
        ...this.state,
        effects: { results: availableGradients },
      });
    }
  };

  adjustColors = (selectedGrad, values) => {
    const { effects } = this.state;
    const availableGradients = effects.results;
    let selectedGradIndex = findIndex(availableGradients, (g) => {
      return selectedGrad.colorStops === g.payload.colorStops;
    });

    if (selectedGradIndex > -1) {
      var stops = availableGradients[selectedGradIndex].payload.colorStops;
      stops.forEach((c, i) => {
        stops[i] = {
          ...c,
          offset: values[i],
        };
      });
    }
    if (this._isMounted) {
      this.setState({
        ...this.state,
        effects: { results: availableGradients },
      });
    }
  };
}

TldrGradientCollapsibleSection.propTypes = {};

export default TldrGradientCollapsibleSection;
