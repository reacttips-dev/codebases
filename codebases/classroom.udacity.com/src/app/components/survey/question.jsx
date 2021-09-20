import {
  Body,
  Footer,
  NextButton,
  PrevButton,
  Slide,
} from 'components/common/slides';

import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import styles from './question.scss';

@cssModule(styles)
class Question extends React.Component {
  static displayName = 'survey/question';
  static propTypes = {
    children: PropTypes.node,
    nextButtonLabel: PropTypes.string,
  };

  static defaultProps = {
    get nextButtonLabel() {
      return __('Next');
    },
  };

  render() {
    const { children, nextButtonLabel } = this.props;

    return (
      <Slide>
        <Body styleName="body">
          <div styleName="content">{children}</div>
        </Body>
        <Footer>
          <div styleName="footer-buttons">
            <div>
              <PrevButton />
            </div>
            <NextButton label={nextButtonLabel} />
          </div>
        </Footer>
      </Slide>
    );
  }
}

export default Question;
