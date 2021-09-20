import { TabKeys, getLabTabPath } from './_lab-tabs';

import ButtonLink from 'components/common/button-link';
import ClassroomPropTypes from 'components/prop-types';
import Markdown from '@udacity/ureact-markdown';
import PropTypes from 'prop-types';
import Wrapper from './_wrapper';
import { __ } from 'services/localization-service';
import styles from './instructions.scss';

@cssModule(styles)
export default class LabDetails extends React.Component {
  static displayName = 'components/labs/instructions';

  static propTypes = {
    lab: ClassroomPropTypes.lab.isRequired,
    trackLabActivity: PropTypes.func.isRequired,
  };

  static contextTypes = {
    location: PropTypes.object,
  };

  componentDidMount() {
    this.props.trackLabActivity('lab_instructions_viewed');
  }

  render() {
    const { lab } = this.props;
    const {
      location: { pathname: labPath },
    } = this.context;
    const detailsAtom = _.get(lab, 'details', {});

    return (
      <Wrapper lab={lab} selectedTabId={TabKeys.INSTRUCTIONS}>
        <div styleName="container">
          <h1 styleName="title">{__('Instructions')}</h1>
          <div styleName="section-markdown">
            <Markdown text={detailsAtom.text} />
          </div>
          <div styleName="next-button-container">
            <ButtonLink
              label={__('Start')}
              variant="primary"
              to={getLabTabPath(labPath, TabKeys.WORKSPACE)}
            />
          </div>
        </div>
      </Wrapper>
    );
  }
}
