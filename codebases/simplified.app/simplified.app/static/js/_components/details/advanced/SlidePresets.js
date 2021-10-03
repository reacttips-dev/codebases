import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import {
  StyledLayoutCollection,
  StyledSlideLayout,
  StyledSlideLayoutContent,
  StyledSlideSubtitle,
  StyledSlideTitle,
} from "../../styled/details/stylesDetails";
import { wsUpdatePage } from "../../../_actions/webSocketAction";
import {
  fetchCategories,
  fetchFormats,
} from "../../../_actions/slidePresetActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Accordion,
  AccordionContext,
  useAccordionToggle,
  Card,
} from "react-bootstrap";
import { ShowCenterSpinner } from "../../common/statelessView";

function CustomToggle({ children, eventKey, callback, onClick }) {
  const currentEventKey = React.useContext(AccordionContext);
  const decoratedOnClick = useAccordionToggle(
    eventKey,
    () => callback && callback(eventKey)
  );
  const isCurrentEventKey = currentEventKey === eventKey;

  return (
    <div
      onClick={() => {
        decoratedOnClick();
        !isCurrentEventKey && onClick();
      }}
      className="collapsible-title-row"
    >
      {isCurrentEventKey ? (
        <FontAwesomeIcon icon="angle-down" className="mr-2"></FontAwesomeIcon>
      ) : (
        <FontAwesomeIcon icon="angle-right" className="mr-2"></FontAwesomeIcon>
      )}
      {children}
    </div>
  );
}

export class SlidePresets extends Component {
  signal = axios.CancelToken.source();

  constructor(props) {
    super(props);

    this.state = {
      loaded: true,
      localVarient: "",
    };
  }

  componentDidMount() {
    this.fetchCategories();
  }

  fetchCategories() {
    this.props.fetchCategories(this.props, this.signal.token);
  }

  render() {
    const { loaded, localVarient } = this.state;
    const { presetCategories, presets } = this.props.slidePresets;

    const presetToSelect = presets.map((preset, index) => {
      const { id, image_height, image_width, payload, title } = preset;
      const { iconType, icon } = payload;

      return (
        <StyledSlideLayout
          key={id}
          onClick={() => this.applyDesign(preset)}
          className={
            localVarient === `${id}_${image_width}_${image_height}`
              ? "active"
              : ""
          }
        >
          <StyledSlideLayoutContent
            imageHeight={image_height}
            imageWidth={image_width}
            heightScaleFactor={this.calculateHeight(image_width, image_height)}
            widthScaleFactor={this.calculateWidth(image_width)}
          >
            {iconType && iconType === "brand" ? (
              <FontAwesomeIcon icon={["fab", `${icon}`]} />
            ) : (
              <FontAwesomeIcon icon={`${icon}`} />
            )}
          </StyledSlideLayoutContent>
          <StyledSlideTitle>{title}</StyledSlideTitle>
          <StyledSlideSubtitle>
            {image_width} x {image_height} px
          </StyledSlideSubtitle>
        </StyledSlideLayout>
      );
    });

    const collapsibleSections = presetCategories.map((category, index) => {
      return (
        <React.Fragment key={index}>
          <Card className="accordion-card">
            <Card.Header className="accordion-card-header">
              <CustomToggle
                as={Card.Header}
                eventKey={category.id}
                onClick={() => this.handleToggleChange(index)}
              >
                <p className="collapsible-title">{category.display_name}</p>
              </CustomToggle>
            </Card.Header>
            <Accordion.Collapse eventKey={category.id}>
              <Card.Body className="accordion-card-body">
                <StyledLayoutCollection>
                  {!loaded ? (
                    <ShowCenterSpinner loaded={loaded} />
                  ) : (
                    presetToSelect
                  )}
                </StyledLayoutCollection>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <hr className="tldr-hl" />
        </React.Fragment>
      );
    });

    return (
      <>
        <Accordion>
          <div className="slide-presets-accordion">{collapsibleSections}</div>
        </Accordion>
      </>
    );
  }

  componentWillUnmount() {
    this.signal.cancel("The user aborted a request.");
  }

  loadPresets = (key = "") => {
    this.setState({ loaded: false });
    this.props.fetchFormats(key, this.props).then(() => {
      this.setState({ loaded: true });
    });
  };

  applyDesign = (design) => {
    const { activePage, pagestore } = this.props;
    const { pages } = pagestore;
    const { id, image_height, image_width } = design;

    const page = pages[activePage.id];

    this.setState({
      localVarient: `${id}_${image_width}_${image_height}`,
    });

    const payload = {
      ...page.payload,
      width: design.image_width,
      height: design.image_height,
    };

    let message = {
      page: activePage.id,
      payload,
      image_width: design.image_width,
      image_height: design.image_height,
    };

    this.props.wsUpdatePage(message);
  };

  handleToggleChange = (i) => {
    const { presetCategories } = this.props.slidePresets;

    this.loadPresets(presetCategories[i].id);
  };

  calculateWidth = (width) => {
    if (width > 2000) {
      return 0.04;
    } else if (width <= 2000 && width > 1600) {
      return 0.06;
    } else if (width <= 1600 && width > 1000) {
      return 0.07;
    } else if (width <= 1000 && width > 800) {
      return 0.08;
    } else if (width <= 800 && width > 600) {
      return 0.1;
    } else if (width <= 600 && width > 500) {
      return 0.2;
    } else if (width <= 500 && width > 300) {
      return 0.22;
    } else if (width <= 300 && width > 100) {
      return 0.3;
    } else {
      return 0.42;
    }
  };

  calculateHeight = (width, height) => {
    if (width > 2000) {
      return 0.04;
    } else if (width <= 2000 && width > 1600) {
      return 0.06;
    } else if (width <= 1600 && width > 1000) {
      return 0.07;
    } else if (width <= 1000 && width > 800) {
      if (height <= 250 && height >= 200) {
        return 0.15;
      } else if (height > 300 && height < 400) {
        return 0.12;
      } else {
        return 0.08;
      }
    } else if (width <= 800 && width > 500) {
      if (height <= 250 && height >= 200) {
        return 0.2;
      } else if (height < 100) {
        return 0.5;
      } else {
        return 0.1;
      }
    } else if (width <= 500 && width > 300) {
      if (height < 100) {
        return 0.7;
      } else {
        return 0.2;
      }
    } else if (width <= 300 && width > 100) {
      return 0.22;
    } else {
      return 0.42;
    }
  };
}

SlidePresets.propTypes = {
  pagestore: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  pagestore: state.pagestore,
  activePage: state.editor.activePage,
  slidePresets: state.slidePresets,
});

const mapDispatchToProps = (dispatch) => ({
  wsUpdatePage: (payload) => dispatch(wsUpdatePage(payload)),
  fetchCategories: (props, signalToken) =>
    dispatch(fetchCategories(props, signalToken)),
  fetchFormats: (key, props) => dispatch(fetchFormats(key, props)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SlidePresets);
