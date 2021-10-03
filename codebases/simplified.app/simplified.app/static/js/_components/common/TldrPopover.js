import React, { Component, useEffect } from "react";
import { Popover } from "react-bootstrap";

const PopoverComponent = React.forwardRef(
  ({ popper, onChange, defaultChecked, validsources, ...props }, ref) => {
    useEffect(() => {
      popper.scheduleUpdate();
    }, [popper, onChange, defaultChecked, validsources]);

    const popoverSources = [];

    for (const [index, value] of validsources.entries()) {
      popoverSources.push(
        <div className="radio" key={index}>
          <label>
            <input
              className="popover-options"
              type="radio"
              name="optradio"
              value={value}
              defaultChecked={defaultChecked === value.trim() ? true : false}
              onChange={onChange}
            />
            <span className="popover-options-text">{value}</span>
          </label>
        </div>
      );
    }

    return (
      <Popover ref={ref} id="popover-basic" {...props.props}>
        <Popover.Content>
          <div className="popover-title">
            <label>Sources</label>
          </div>
          {popoverSources}
        </Popover.Content>
      </Popover>
    );
  }
);

class TldrPopover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userSelectSource: "",
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    var selectedSource = e.currentTarget.value;

    this.setState({
      userSelectSource: selectedSource,
    });
  }

  render() {
    const { innerRef, popper } = this.props;
    let defaultSelection =
      this.props.props.sidebarSlider.sliderPanelType === "video"
        ? this.props.props.sidebarSlider.videoSource
        : this.props.props.sidebarSlider.sliderPanelType === "images"
        ? this.props.props.sidebarSlider.imageSource
        : this.props.props.sidebarSlider.sliderPanelType === "icons"
        ? this.props.props.sidebarSlider.iconsSource
        : "";
    return (
      <PopoverComponent
        ref={innerRef}
        props={this.props}
        popper={popper}
        onChange={this.onClick}
        defaultChecked={defaultSelection}
        validsources={this.props.validsources}
      />
    );
  }
}

TldrPopover.propTypes = {};
export default React.forwardRef((props, ref) => (
  <TldrPopover ref={ref} {...props} />
));
