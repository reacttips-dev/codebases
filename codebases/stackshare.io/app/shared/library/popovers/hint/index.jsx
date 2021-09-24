import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ReferenceBox, PopperBox, ArrowContainer} from './styles';
import Arrow from './arrow.svg';
import {TOP} from '../../../constants/placements';

export const ACTIVATE_MODE_HOVER = 'hover';
export const ACTIVATE_MODE_MOUNT = 'mount';

let Manager = null;
let Reference = null;
let Popper = null;

export default class Hint extends Component {
  static propTypes = {
    placement: PropTypes.string,
    anchor: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    hint: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    customStyle: PropTypes.object,
    activateMode: PropTypes.oneOf([ACTIVATE_MODE_MOUNT, ACTIVATE_MODE_HOVER]),
    onActivate: PropTypes.func,
    hideHint: PropTypes.bool
  };

  static defaultProps = {
    placement: TOP,
    activateMode: ACTIVATE_MODE_MOUNT
  };

  state = {
    ready: false,
    showHint: !this.props.hideHint && this.props.activateMode === ACTIVATE_MODE_MOUNT
  };

  componentDidMount() {
    import(/* webpackChunkName: "react-popper" */ 'react-popper').then(module => {
      Manager = module.Manager;
      Reference = module.Reference;
      Popper = module.Popper;
      this.setState({ready: true});
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.hideHint !== this.props.hideHint) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({showHint: !this.props.hideHint});
    }
  }

  handleMouseEnter = () => {
    const {activateMode, onActivate} = this.props;

    if (activateMode === ACTIVATE_MODE_HOVER) {
      this.setState({showHint: true});
      this.activateTimer = setTimeout(() => onActivate && onActivate(), 1000);
    }
  };

  handleMouseLeave = () => {
    if (this.props.activateMode === ACTIVATE_MODE_HOVER) {
      this.setState({showHint: false});
      clearTimeout(this.activateTimer);
    }
  };

  render() {
    const {placement, anchor, hint, customStyle} = this.props;
    const {showHint} = this.state;

    if (this.state.ready) {
      return (
        <Manager>
          <Reference>
            {({ref}) => (
              <ReferenceBox
                innerRef={ref}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
              >
                {anchor}
              </ReferenceBox>
            )}
          </Reference>
          {showHint && (
            <Popper placement={placement}>
              {({ref, style, placement, arrowProps}) => (
                <PopperBox
                  innerRef={ref}
                  style={{...style, ...customStyle}}
                  data-placement={placement}
                >
                  {hint}
                  <ArrowContainer
                    innerRef={arrowProps.ref}
                    data-placement={placement}
                    style={arrowProps.style}
                  >
                    <Arrow />
                  </ArrowContainer>
                </PopperBox>
              )}
            </Popper>
          )}
        </Manager>
      );
    } else return null;
  }
}
