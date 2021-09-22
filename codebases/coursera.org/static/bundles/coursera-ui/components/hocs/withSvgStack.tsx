import React from 'react';
import { css, StyleSheet, color } from '@coursera/coursera-ui';
import { pure } from 'recompose';
import hoistNonReactStatics from 'js/lib/hoistNonReactStatics';

// Dynamic styles
function getStyles({
  size,
  stackBorderRadius,
  stackBorderWidth,
  stackBorderColor,
  stackToIconRatio,
}: {
  size: number;
  stackBorderRadius: string;
  stackBorderWidth: number;
  stackBorderColor: string;
  stackToIconRatio: number;
}) {
  return {
    withSvgStack: {
      width: size / stackToIconRatio,
      height: size / stackToIconRatio,
      overflow: 'hidden',
      border: `${stackBorderWidth}px solid ${stackBorderColor}`,
      borderRadius: stackBorderRadius,
    },
  };
}

const styles = StyleSheet.create({
  withSvgStack: {},
});

type InputProps = {
  size?: number;
  color?: string;
};

type HocProps = {
  size: number;
  color: string;
  hoverColor: string;
  /**
   * Allow rendering of different tags, e.g. 'span', 'div'
   * Default to 'span' so as it's easy to use inside button
   */
  stackTag: React.ComponentType<React.HTMLAttributes<HTMLElement>>;
  stackBorderRadius: string;
  stackBorderColor: string;
  stackBorderWidth: number;
  stackColor: string;
  stackHoverColor: string;
  stackStyle: React.CSSProperties;
  stackToIconRatio: number;
};

type HocState = {
  isHovered: boolean;
};

/**
 * A HOC to add stack to svg icons
 * Can also be used to add stack to any other elements
 * When hovered, the HOC will pass the hovered state to svgIcon
 */
const withSvgStack = <BaseProps extends InputProps>(
  Component: React.ComponentType<BaseProps>
): React.ComponentType<BaseProps & InputProps & Partial<HocProps>> => {
  const componentName = Component.displayName || Component.name;

  class HOC extends React.Component<HocProps, HocState> {
    static displayName = `withSvgStack(${componentName})`;

    static defaultProps = {
      stackTag: 'span',
      size: 24,
      stackBorderRadius: '50%',
      stackBorderWidth: 0,
      stackBorderColor: color.divider,
      stackColor: color.primary,
      stackStyle: {},
      stackToIconRatio: 0.6,
    };

    state = {
      isHovered: false,
    };

    handleBlur = () => {
      this.setState({ isHovered: false });
    };

    handleFocus = () => {
      this.setState({ isHovered: true });
    };

    render() {
      const {
        stackBorderColor,
        stackBorderRadius,
        stackBorderWidth,
        stackColor,
        stackHoverColor,
        stackStyle,
        stackToIconRatio,
        stackTag: Tag,

        // svgProps
        size,
        color: svgColor,
        hoverColor,
        ...rest
      } = this.props;

      const { isHovered } = this.state;
      const dynamicStyles = getStyles({
        size,
        stackBorderRadius,
        stackBorderWidth,
        stackBorderColor,
        stackToIconRatio,
      });

      const backgroundColor = isHovered && stackHoverColor ? stackHoverColor : stackColor;

      const componentProps = {
        ...rest,
        size,
        color: (isHovered && hoverColor) || svgColor,
      } as BaseProps;

      return (
        <Tag
          {...css('horizontal-box align-items-absolute-center', styles.withSvgStack)}
          style={{
            ...dynamicStyles.withSvgStack,
            backgroundColor,
            ...stackStyle,
          }}
          onFocus={this.handleFocus}
          onMouseOver={this.handleFocus}
          onMouseOut={this.handleBlur}
          onBlur={this.handleBlur}
        >
          <Component {...componentProps} />
        </Tag>
      );
    }
  }

  hoistNonReactStatics(HOC, Component);
  // @ts-expect-error can't correctly pass defaultProps through HOC
  return pure(HOC);
};

export default withSvgStack;
