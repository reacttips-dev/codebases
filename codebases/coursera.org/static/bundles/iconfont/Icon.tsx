import classnames from 'classnames';

// TODO(archana) move this component to styleguide/components/Icon

/**
 * Use this component to pull the icons from coursera list of icons.
 * Please refer to the styleguide for names of all the icons available:
 *
 * styleguide.dkandu.me/learnerApp/section-8.html
 * (or) the CSS file
 * static/bundles/styleguide/learnerApp/icons.styl
 *
 * Provide the name without the cif- prefix as the name and provide any additional
 * classnames for the icon.
 */
import PropTypes from 'prop-types';

import React from 'react';

// NOTE this must be required in the root of an app, not dynamically. By requiring dynamically
// we end up loading the same file twice in parallel.
// require('css!bundles/styleguide/core/icons');

import { IconName } from './types';

export type { IconName };

type Props = {
  /**
   * Name: Refer to the list of names of all icons styleguide.dkandu.me/learnerApp/section-8.html
   * Use them without the cif- prefix.
   * Classnames: Provide additional classnames for the icon.
   */
  name: IconName;
  className?: string;
  innerIcon?: string;
  spin?: boolean;
  pulse?: boolean;
  rotate?: 90 | 180 | 270;
  flip?: 'horizontal' | 'vertical';
  inverse?: boolean;

  /**
   * When defining icons inside an icon stack, you should not be specifying size. Instead, specify
   * the size on the parent IconStack component to increase the size of the icon.'
   */
  size?: 'lg' | '2x' | '3x' | '4x' | '5x';

  // Stacking
  outer?: boolean;
  inner?: boolean;
};

class Icon extends React.Component<Props> {
  static contextTypes = {
    inStack: PropTypes.bool,
  };

  static defaultProps = {
    spin: false,
    size: '',
  };

  render() {
    const iconClassNames = classnames(`cif-${this.props.name}`, this.props.className, {
      // eslint-disable-line quote-props
      'cif-spin': this.props.spin,
      'cif-inverse': this.props.inverse,
      'cif-pulse': this.props.pulse,
      [`cif-rotate-${this.props.rotate}`]: this.props.rotate && this.props.rotate > 0,
      [`cif-flip-${this.props.flip}`]: !!this.props.flip,
      [`cif-${this.props.size}`]: this.props.size && !this.context.inStack,

      // Stack classes
      'cif-stack-2x': this.context.inStack && this.props.outer,
      'cif-stack-1x': this.context.inStack && this.props.inner,
    });
    const outerClassNames = classnames('cif-stack', this.props.className);
    const innerClassNames = classnames('cif-' + this.props.innerIcon, 'cif-stack-1x', 'cif-inverse');
    /**
     * There are some SVGs which need multiple glyphs, esp custom icons
     * created in house. Icomoon generated multiple glyphs and also provides this
     * HTML. Please paste it here and special case it whenever necessary.
     */
    switch (this.props.name) {
      case 'get-vc':
        return (
          <span className={iconClassNames}>
            <span className="path1" />
            <span className="path2" />
            <span className="path3" />
            <span className="path4" />
            <span className="path5" />
            <span className="path6" />
            <span className="path7" />
            <span className="path8" />
            <span className="path9" />
          </span>
        );
      case 'summative-incomplete':
        return (
          <span className={iconClassNames}>
            <span className="path1" />
            <span className="path2" />
          </span>
        );

      case 'summative-complete':
        return (
          <span className={iconClassNames}>
            <span className="path1" />
            <span className="path2" />
            <span className="path3" />
          </span>
        );

      /**
       * Generates an icon on a circular background.
       * The prop 'innerIcon' defines the name of the inner icon without the 'cif-' prefix.
       */
      case 'circle-outer':
        return (
          <span className={outerClassNames}>
            <i className="cif-circle cif-stack-2x" aria-hidden={true} />
            <i className={innerClassNames} aria-hidden={true} />
          </span>
        );

      default:
        return <i className={iconClassNames} aria-hidden={true} />;
    }
  }
}

export default Icon;
