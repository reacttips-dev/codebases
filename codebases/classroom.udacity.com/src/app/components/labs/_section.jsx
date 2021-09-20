import { THEMES, ThemeType } from 'constants/theme';

import PropTypes from 'prop-types';
import styles from './_section.scss';

@cssModule(styles)
export default class LabReflection extends React.Component {
  static displayName = 'components/labs/reflection';

  static propTypes = {
    children: PropTypes.node,
    theme: ThemeType,
    title: PropTypes.string,
  };

  static defaultProps = {
    theme: THEMES.LIGHT,
    value: null,
  };

  render() {
    const { title, theme, children } = this.props;

    return (
      <div styleName={`section-${theme}`}>
        <h3>{title}</h3>
        {children}
      </div>
    );
  }
}
