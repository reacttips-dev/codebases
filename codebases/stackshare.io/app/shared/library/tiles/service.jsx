import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {CONCRETE, BLACK, WHITE} from '../../style/colors';
import {BASE_TEXT, WEIGHT} from '../../style/typography';
import LazyLoadImage from '../../../shared/utils/lazy-loading-images';

const Service = glamorous.span(
  {
    display: 'flex',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: 57,
    minWidth: 57,
    height: 57,
    minHeight: 57,
    backgroundColor: WHITE,
    ':hover': {
      backgroundColor: WHITE
    },
    borderRadius: 3.1
  },
  ({slim}) => ({
    border: slim ? 0 : `solid 0.8px ${CONCRETE}`
  }),
  'service'
);

const MicroService = glamorous(Service)(
  {
    width: 22,
    height: 22,
    minWidth: 22,
    minHeight: 22
  },
  ({rounded}) => ({
    borderRadius: rounded ? 3.1 : 0.8
  }),
  ({customStyle}) => (customStyle ? customStyle : {})
);

const SmallService = glamorous(Service)({
  width: 32,
  height: 32,
  minWidth: 32,
  minHeight: 32
});

const MediumService = glamorous(Service)(
  {
    width: 44,
    height: 44,
    minWidth: 44,
    minHeight: 34
  },
  ({customStyle}) => (customStyle ? customStyle : {})
);

const LargeService = glamorous(Service)({
  width: 60,
  height: 60,
  minWidth: 60,
  minHeight: 60
});

const Logo = glamorous.img({}, ({slim, rounded, height, width}) => ({
  border: slim ? `solid 1px ${CONCRETE}` : 0,
  borderRadius: slim ? (rounded ? 3.1 : 0.8) : 0,
  height: height,
  width: width
}));

const Label = glamorous.span(
  {
    ...BASE_TEXT,
    marginLeft: 7,
    fontWeight: WEIGHT.NORMAL
  },
  ({inverted, labelSize = 13}) => ({
    color: inverted ? WHITE : BLACK,
    fontSize: labelSize
  })
);

const Tile = glamorous.a({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  textDecoration: 'none'
});

const TileWithoutA = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  textDecoration: 'none'
});

export const MICRO = 'micro';
export const SMALL = 'small';
export const MEDIUM = 'medium';
export const DEFAULT = 'default';
export const LARGE = 'large';

export default class ServiceTile extends PureComponent {
  static propTypes = {
    innerRef: PropTypes.func,
    name: PropTypes.string,
    imageUrl: PropTypes.string,
    label: PropTypes.bool,
    labelSize: PropTypes.number,
    rounded: PropTypes.bool,
    slim: PropTypes.bool,
    inverted: PropTypes.bool,
    useAnchor: PropTypes.bool,
    href: PropTypes.string,
    onClick: PropTypes.func,
    preventDefault: PropTypes.bool,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    size: PropTypes.oneOf([MICRO, SMALL, MEDIUM, DEFAULT, LARGE]),
    customStyle: PropTypes.object,
    lazyLoad: PropTypes.bool
  };

  static defaultProps = {
    size: DEFAULT,
    preventDefault: true,
    customStyle: {},
    lazyLoad: true
  };

  handleClick = event => {
    event.stopPropagation();
    if (this.props.onClick) {
      this.props.preventDefault && event.preventDefault();
      this.props.onClick(event);
    }
  };

  handleMouseEnter = event => {
    if (this.props.onMouseEnter) {
      event.preventDefault();
      this.props.onMouseEnter(event);
    }
  };

  handleMouseLeave = event => {
    if (this.props.onMouseLeave) {
      event.preventDefault();
      this.props.onMouseLeave(event);
    }
  };

  render() {
    const {
      size,
      href,
      imageUrl,
      name,
      rounded,
      slim,
      label,
      labelSize,
      inverted,
      useAnchor = true,
      customStyle,
      lazyLoad
    } = this.props;

    const image = (size => {
      if (lazyLoad) {
        switch (size) {
          case MICRO:
            return (
              <MicroService title={name} rounded={rounded} slim={slim} customStyle={customStyle}>
                <LazyLoadImage>
                  <Logo
                    rounded={rounded}
                    slim={slim}
                    src={imageUrl}
                    width={slim ? 22 : 13}
                    height={slim ? 22 : 13}
                    alt={name}
                  />
                </LazyLoadImage>
              </MicroService>
            );
          case SMALL:
            return (
              <SmallService title={name} slim={slim}>
                <LazyLoadImage>
                  <Logo
                    src={imageUrl}
                    width={slim ? 32 : 24}
                    height={slim ? 32 : 24}
                    slim={slim}
                    alt={name}
                  />
                </LazyLoadImage>
              </SmallService>
            );
          case MEDIUM:
            return (
              <MediumService title={name} customStyle={customStyle}>
                <LazyLoadImage>
                  <Logo src={imageUrl} width={32} height={32} alt={name} />
                </LazyLoadImage>
              </MediumService>
            );
          case DEFAULT:
            return (
              <Service title={name}>
                <LazyLoadImage>
                  <Logo src={imageUrl} width={38} height={38} alt={name} />
                </LazyLoadImage>
              </Service>
            );
          case LARGE:
            return (
              <LargeService title={name}>
                <LazyLoadImage>
                  <Logo src={imageUrl} width={38} height={38} alt={name} />
                </LazyLoadImage>
              </LargeService>
            );
        }
      } else {
        switch (size) {
          case MICRO:
            return (
              <MicroService title={name} rounded={rounded} slim={slim}>
                <Logo
                  rounded={rounded}
                  slim={slim}
                  src={imageUrl}
                  width={slim ? 22 : 13}
                  height={slim ? 22 : 13}
                  alt={name}
                />
              </MicroService>
            );
          case SMALL:
            return (
              <SmallService title={name} slim={slim}>
                <Logo
                  src={imageUrl}
                  width={slim ? 32 : 24}
                  height={slim ? 32 : 24}
                  slim={slim}
                  alt={name}
                />
              </SmallService>
            );
          case MEDIUM:
            return (
              <MediumService title={name}>
                <Logo src={imageUrl} width={32} height={32} alt={name} />
              </MediumService>
            );
          case DEFAULT:
            return (
              <Service title={name}>
                <Logo src={imageUrl} width={38} height={38} alt={name} />
              </Service>
            );
          case LARGE:
            return (
              <LargeService title={name}>
                <Logo src={imageUrl} width={38} height={38} alt={name} />
              </LargeService>
            );
        }
      }
    })(size);

    return useAnchor ? (
      <Tile
        innerRef={this.props.innerRef}
        href={href}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {image}
        {label && (
          <Label inverted={inverted} labelSize={labelSize}>
            {name}
          </Label>
        )}
      </Tile>
    ) : (
      <TileWithoutA
        innerRef={this.props.innerRef}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {image}
        {label && (
          <Label inverted={inverted} labelSize={labelSize}>
            {name}
          </Label>
        )}{' '}
      </TileWithoutA>
    );
  }
}
