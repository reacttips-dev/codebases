import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, css } from '@coursera/coursera-ui';
import Button from 'bundles/coursera-ui/components/basic/Button';

const CONFIG = {
  iconMargin: '0.6rem',
};

const styles = StyleSheet.create({
  iconWrapper: {
    display: 'inline-block',
  },
  iconLeft: {
    marginRight: CONFIG.iconMargin,
  },
  iconRight: {
    marginLeft: CONFIG.iconMargin,
  },
});

/**
 * A Button that handles interaction when having svg icon as children
 */
class SvgButton extends Component {
  static propTypes = {
    svgElement: PropTypes.node,
    htmlAttributes: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    htmlAttributes: {},
  };

  state = {
    hovered: false,
  };

  handleMouseLeave = (e: $TSFixMe) => {
    this.setState({ hovered: false });
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'htmlAttributes' does not exist on type '... Remove this comment to see the full error message
    if (this.props.htmlAttributes.onMouseLeave) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'htmlAttributes' does not exist on type '... Remove this comment to see the full error message
      this.props.htmlAttributes.onMouseLeave(e);
    }
  };

  handleMouseEnter = (e: $TSFixMe) => {
    this.setState({ hovered: true });
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'htmlAttributes' does not exist on type '... Remove this comment to see the full error message
    if (this.props.htmlAttributes.onMouseEnter) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'htmlAttributes' does not exist on type '... Remove this comment to see the full error message
      this.props.htmlAttributes.onMouseEnter(e);
    }
  };

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'svgElement' does not exist on type 'Read... Remove this comment to see the full error message
    const { svgElement, htmlAttributes, ...rest } = this.props;

    return (
      <Button
        {...rest}
        htmlAttributes={{
          ...htmlAttributes,
          onMouseEnter: this.handleMouseEnter,
          onMouseLeave: this.handleMouseLeave,
        }}
      >
        {svgElement && (
          <span
            {...css(
              styles.iconWrapper,
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'label' does not exist on type '{ childre... Remove this comment to see the full error message
              rest.label && !rest.isChildrenOnRight && styles.iconLeft,
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'label' does not exist on type '{ childre... Remove this comment to see the full error message
              rest.label && rest.isChildrenOnRight && styles.iconRight
            )}
          >
            {svgElement &&
              React.cloneElement(svgElement, {
                hovered: this.state.hovered,
                disableMouseEvent: true,
              })}
          </span>
        )}
      </Button>
    );
  }
}

export default SvgButton;
