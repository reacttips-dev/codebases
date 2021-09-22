import React from 'react';
import initBem from 'js/lib/bem';
import { Button, color } from '@coursera/coursera-ui';
import { SvgExternalLink } from '@coursera/coursera-ui/svg';
import _t from 'i18n!nls/compound-assessments';
import withSingleTracked from 'bundles/common/components/withSingleTracked';
import { TrackedA } from 'bundles/page/components/TrackedLink2';

import 'css!./__styles__/PlagiarismReportLink';

const TrackedButton = withSingleTracked({ type: 'BUTTON' })(Button);
const bem = initBem('PlagiarismReportLink');

type Props = {
  link?: string;
  refetch: () => void;
};

type State = {
  isLinkAvailable: boolean;
};

class PlagiarismReportLink extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isLinkAvailable: true,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      // 58 seconds for link valid time
      // the turnitin link expires within 60 seconds. it's 58 seconds so that we could avoid the possible edge case that the user will click an expired link
      this.setState({
        isLinkAvailable: false,
      });
    }, 58 * 1000);
  }

  onGenerateReportClick = () => {
    const { refetch } = this.props;
    refetch();
  };

  render() {
    const { link } = this.props;
    const { isLinkAvailable } = this.state;

    return (
      <div className={bem()}>
        {!isLinkAvailable && (
          <TrackedButton
            data-test="generate-report"
            trackingName="generate_plagiarism_report"
            type="link"
            label={_t('Generate Report')}
            size="zero"
            onClick={this.onGenerateReportClick}
          />
        )}
        {isLinkAvailable && (
          <TrackedA
            trackingName="view_similarity_report"
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="body-1-text"
          >
            {_t('View Similarity Report')}
            <span className={bem('external-svg-icon')}>
              <SvgExternalLink size={20} color={color.primary} />
            </span>
          </TrackedA>
        )}
      </div>
    );
  }
}

export default PlagiarismReportLink;
