import React from "react";
import { Slider, Rail, Handles, Tracks } from "react-compound-slider";
import {
  StyledAdvEditorToolbarFormatGroup,
  StyledAdvEditorToolbarRow,
  StyledSliderInputContainer,
} from "../styled/details/stylesDetails";
import EditableLabel from "./EditableLabel";

function Track({ source, target, getTrackProps }) {
  return (
    <div
      className="tldr-track"
      style={{
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`,
      }}
      {
        ...getTrackProps() /* this will set up events if you want it to be clickeable (optional) */
      }
    />
  );
}

function Handle({
  handle: { id, value, percent },
  getHandleProps,
  showDecimals,
  hideIndicator,
  unit,
}) {
  return (
    <div
      className="tldr-handle"
      style={{
        left: `${percent}%`,
      }}
      {...getHandleProps(id)}
    >
      {hideIndicator ? (
        <></>
      ) : (
        <div className="tldr-tooltip">
          {showDecimals === false
            ? value.toFixed(0) + `${unit ? unit : ""}`
            : value.toFixed(2) + `${unit ? unit : ""}`}
        </div>
      )}
    </div>
  );
}

function Title(props) {
  return <div className="title">{props.title}</div>;
}

function InputBox(props) {
  return (
    <StyledSliderInputContainer showValue={true}>
      <EditableLabel
        text={`${props.text}`}
        labelClassName="slidervaluename"
        inputClassName="slidervalueinput"
        onFocus={props.handleFocus}
        onFocusOut={props.handleFocusOut}
        showIcon={false}
        inputMaxLength={props.maxLength}
        labelPlaceHolder={`${props.text}`}
      />
    </StyledSliderInputContainer>
  );
}

function SliderWithInput(props) {
  return (
    <>
      <StyledAdvEditorToolbarRow isWithValue={true}>
        <StyledAdvEditorToolbarFormatGroup isWithValue={true}>
          <Title title={props.title ? props.title : ""} />

          <Slider
            className={`tldr-slider mr-3`}
            domain={props.domain ? props.domain : [0, 100]}
            step={props.step ? props.step : 1}
            mode={props.mode ? props.mode : 2}
            values={props.values ? props.values : [0]}
            onUpdate={props.onUpdate}
            onChange={props.onChange}
            disabled={props.disabled}
            rootStyle={{ opacity: props.disabled ? 0.3 : 1 }}
          >
            <Rail>
              {({ getRailProps }) => (
                <div className="tldr-rail" {...getRailProps()} />
              )}
            </Rail>

            <Handles>
              {({ handles, getHandleProps }) => (
                <div className="slider-handles">
                  {handles.map((handle) => (
                    <Handle
                      key={handle.id}
                      handle={handle}
                      unit={props.unit}
                      hideIndicator={props.hideIndicator}
                      getHandleProps={getHandleProps}
                      showDecimals={props.showDecimals}
                    />
                  ))}
                </div>
              )}
            </Handles>
            <Tracks right={false}>
              {({ tracks, getTrackProps }) => (
                <div className={`slider-tracks ${props.tracksClassNames}`}>
                  {tracks.map(({ id, source, target }) => (
                    <Track
                      key={id}
                      source={source}
                      target={target}
                      getTrackProps={getTrackProps}
                    />
                  ))}
                </div>
              )}
            </Tracks>
          </Slider>
        </StyledAdvEditorToolbarFormatGroup>

        <InputBox
          text={
            props.values
              ? props.step % 1 === 0 || !props.step
                ? parseFloat(props.values[0])
                : parseFloat(props.values[0]).toFixed(2)
              : 0
          }
          maxLength={props.maxLength ? props.maxLength : 1}
          handleFocus={props.handleFocus}
          handleFocusOut={props.handleFocusOut}
        />
      </StyledAdvEditorToolbarRow>
    </>
  );
}

function SliderWithoutInput(props) {
  return (
    <>
      <Title title={props.title ? props.title : ""} />
      <Slider
        className={`tldr-slider ${props.classNames}`}
        domain={props.domain ? props.domain : [0, 100]}
        step={props.step ? props.step : 1}
        mode={props.mode ? props.mode : 2}
        values={props.values ? props.values : [0]}
        onUpdate={props.onUpdate}
        onChange={props.onChange}
        disabled={props.disabled}
        rootStyle={{ opacity: props.disabled ? 0.3 : 1 }}
      >
        <Rail>
          {({ getRailProps }) => (
            <div className="tldr-rail" {...getRailProps()} />
          )}
        </Rail>

        <Handles>
          {({ handles, getHandleProps }) => (
            <div className="slider-handles">
              {handles.map((handle) => (
                <Handle
                  key={handle.id}
                  handle={handle}
                  unit={props.unit}
                  hideIndicator={props.hideIndicator}
                  getHandleProps={getHandleProps}
                  showDecimals={props.showDecimals}
                />
              ))}
            </div>
          )}
        </Handles>
        <Tracks left={props.values.length > 1 ? false : true} right={false}>
          {({ tracks, getTrackProps }) => (
            <div className={`slider-tracks ${props.tracksClassNames}`}>
              {tracks.map(({ id, source, target }) => (
                <Track
                  key={id}
                  source={source}
                  target={target}
                  getTrackProps={getTrackProps}
                />
              ))}
            </div>
          )}
        </Tracks>
      </Slider>
    </>
  );
}

function TldrSlider(props) {
  if (props.showInputbox) {
    return SliderWithInput(props);
  } else {
    return SliderWithoutInput(props);
  }
}

TldrSlider.propTypes = {};

export default TldrSlider;
