import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import Options from './options';
import {grid} from '../../../../shared/utils/grid';
import {ASH, GUNSMOKE} from '../../../../shared/style/colors';
import SettingsIcon from '../../../../shared/library/icons/settings.svg';
import TriangleIcon from '../../../../shared/library/icons/triangle.svg';
import {withSendAnalyticsEvent} from '../../../../shared/enhancers/analytics-enhancer';
import {ReferenceBox, PopperBox, ArrowContainer} from '../../popovers/hint/styles';
import {BOTTOM_END} from '../../../constants/placements';
import Arrow from '../../popovers/hint/arrow.svg';

let Manager = null;
let Reference = null;
let Popper = null;

const Container = glamorous.div();

const SettingsLink = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  border: `1px solid ${ASH}`,
  borderRadius: 2,
  padding: grid(1),
  lineHeight: 0.8,
  cursor: 'pointer',
  ':hover': {
    borderColor: GUNSMOKE
  },
  '> svg:first-child': {
    marginRight: grid(1)
  }
});

const CustomMenu = glamorous.div(
  {
    display: 'flex',
    alignItems: 'center'
  },
  ({customMenuCss, disabled}) => ({
    ...customMenuCss,
    cursor: disabled && 'initial'
  })
);

export class MenuPopover extends Component {
  static propTypes = {
    placement: PropTypes.string,
    anchor: PropTypes.element,
    onClick: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        label: PropTypes.string.isRequired,
        icon: PropTypes.string
      }).isRequired
    ),
    sendAnalyticsEvent: PropTypes.func,
    onShowMenuEvent: PropTypes.string,
    icon: PropTypes.any,
    isCustom: PropTypes.bool,
    customMenuCss: PropTypes.object,
    customPopperCss: PropTypes.object,
    disabled: PropTypes.bool
  };

  static defaultProps = {
    placement: BOTTOM_END,
    icon: <SettingsIcon />,
    isCustom: false,
    customMenuCss: {},
    customPopperCss: {},
    disabled: false
  };

  state = {
    ready: false,
    showMenu: false
  };

  container = null;

  componentDidMount() {
    import(/* webpackChunkName: "react-popper" */ 'react-popper').then(module => {
      Manager = module.Manager;
      Reference = module.Reference;
      Popper = module.Popper;
      this.setState({ready: true});
    });
  }

  handleClick = () => {
    const {onShowMenuEvent, sendAnalyticsEvent} = this.props;
    if (onShowMenuEvent) {
      sendAnalyticsEvent(onShowMenuEvent);
    }
    if (!this.state.showMenu) {
      document.addEventListener('click', this.handleDismiss, {capture: true, once: true});
    }
    this.setState({showMenu: !this.state.showMenu});
  };

  handleDismiss = event => {
    if (!this.container.contains(event.target)) {
      this.setState({showMenu: false});
    }
  };

  render() {
    const {options, anchor, icon, isCustom, customMenuCss, customPopperCss, disabled} = this.props;
    const {showMenu} = this.state;

    if (this.state.ready) {
      return (
        <Container innerRef={el => (this.container = el)}>
          <Manager>
            <Reference>
              {({ref}) => (
                <ReferenceBox innerRef={ref} onClick={!disabled && this.handleClick}>
                  {anchor ||
                    (isCustom ? (
                      <CustomMenu customMenuCss={customMenuCss} disabled={disabled}>
                        {icon}
                      </CustomMenu>
                    ) : (
                      <SettingsLink>
                        <SettingsIcon />
                        <TriangleIcon />
                      </SettingsLink>
                    ))}
                </ReferenceBox>
              )}
            </Reference>
            {showMenu && (
              <Popper placement={this.props.placement}>
                {({ref, style, placement, arrowProps}) => (
                  <PopperBox
                    innerRef={ref}
                    style={{...style, padding: 0, alignItems: 'flex-start', ...customPopperCss}}
                    data-placement={placement}
                  >
                    <Options
                      options={options}
                      onClick={id => {
                        this.props.onClick(id);
                        this.setState({showMenu: false});
                      }}
                    />
                    {!isCustom && (
                      <ArrowContainer
                        innerRef={arrowProps.ref}
                        data-placement={placement}
                        style={arrowProps.style}
                      >
                        <Arrow />
                      </ArrowContainer>
                    )}
                  </PopperBox>
                )}
              </Popper>
            )}
          </Manager>
        </Container>
      );
    } else return null;
  }
}

export default withSendAnalyticsEvent(MenuPopover);
