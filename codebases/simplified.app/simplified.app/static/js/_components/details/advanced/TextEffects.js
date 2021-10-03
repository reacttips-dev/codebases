import React, { Component } from "react";
import { connect } from "react-redux";
import { ShowCenterSpinner } from "../../common/statelessView";
import axios from "axios";
import { EFFECTS_ENDPOINT } from "../../../_actions/endpoints";
import { StyledTextEffectTitle } from "../../styled/details/styleAdvancedPanel";
import FiniteGridLayout from "../../common/FiniteGridLayout";

class TextEffects extends Component {
  signalToken = axios.CancelToken.source();

  constructor(props) {
    super(props);
    this.noneEffect = {
      id: "none-effect",
      image:
        "https://celeryhq-static.s3.amazonaws.com/usetldr/4/hello_world.png",
      image_height: 100,
      image_width: 542,
      mime: 4,
      payload: {
        type: "textbox",
        fill: "rgba(0, 0, 0, 1)",
        stroke: null,
        strokeWidth: 1,
        strokeDashArray: null,
        strokeLineCap: "butt",
        strokeDashOffset: 0,
        strokeLineJoin: "miter",
        strokeUniform: true,
        strokeMiterLimit: 4,
        opacity: 1,
        shadow: null,
        visible: true,
        backgroundColor: "",
        fillRule: "nonzero",
        paintFirst: "fill",
        textBackgroundColor: "",
        editable: true,
        editingBorderColor: "rgba(255, 172, 65, 0.4)",
        charSpacing: 0,
        skewX: 0,
        skewY: 0,
        angle: 0,
        flipX: false,
        flipY: false,
      },
      title: "None",
    };
    this.state = {
      effects: { results: [] },
      isLoading: true,
      selectedEffectId: this.noneEffect.id,
    };
  }

  componentDidMount() {
    axios
      .get(EFFECTS_ENDPOINT, { cancelToken: this.signalToken.token })
      .then((res) => {
        let effects = res.data;
        effects.results = [this.noneEffect, ...effects.results];
        this.setState({
          effects: effects,
          isLoading: false,
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
      });
  }

  applyTextEffect = (effect, id) => {
    const { selectedEffectId } = this.state;
    const { canvasRef } = this.props;
    const { textHandler } = canvasRef.handler;
    let obj = textHandler.getActiveTextElementObject();

    if (id === selectedEffectId) {
      // if clicked on the same effect, unselect it
      this.setState(
        {
          selectedEffectId: this.noneEffect.id,
        },
        () => {
          textHandler.applyStyleToSelection(this.noneEffect.payload);
          obj.set({ userProperty: { effectId: this.noneEffect.id } });
        }
      );
      return;
    }

    this.setState(
      {
        selectedEffectId: id,
      },
      () => {
        textHandler.applyStyleToSelection(effect);
        obj.set({ userProperty: { effectId: id } }); // for active styling purpose
      }
    );
  };

  render() {
    const { effects, isLoading } = this.state;
    const { canvasRef } = this.props;
    const textHandler = canvasRef?.handler?.textHandler;

    let obj = textHandler?.getActiveTextElementObject();
    let childElements = effects.results.map((effect) => {
      const { payload, id } = effect;
      const isEffectApplied =
        obj?.userProperty?.effectId === id ||
        (obj?.userProperty.effectId === undefined && id === this.noneEffect.id);

      return (
        <div
          key={id}
          className={"item text-effect-item " + (isEffectApplied && "active")}
          onClick={() => this.applyTextEffect(payload, id)}
        >
          <h2>Hello</h2>
          <StyledTextEffectTitle>{effect.title}</StyledTextEffectTitle>
        </div>
      );
    });

    return (
      <>
        {isLoading ? (
          <ShowCenterSpinner loaded={!isLoading} />
        ) : (
          <div className="grid-gallary text-effect-gallary" id="tldr-toolbar">
            <FiniteGridLayout
              childElements={childElements}
              loaded={!isLoading}
            />
          </div>
        )}
      </>
    );
  }
}

TextEffects.propTypes = {};

const mapStateToProps = (state) => ({
  editor: state.editor,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TextEffects);
