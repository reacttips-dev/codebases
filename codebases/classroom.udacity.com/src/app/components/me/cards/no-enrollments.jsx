import { Button } from '@udacity/veritas-components';
import Card from './card';
import { Heading } from '@udacity/veritas-components';
import { __ } from 'services/localization-service';
import popularPrograms from './../data/popular_nds';
import styles from './no-enrollments.scss';

@cssModule(styles)
export default class NoEnrollments extends React.Component {
  static displayName = 'me/cards/no-enrollments';

  _renderButton = (handleClick) => {
    return (
      <Button
        label={__('Learn More')}
        variant="minimal"
        onClick={handleClick}
      />
    );
  };

  render() {
    const count = popularPrograms['en-us'].length;

    return (
      <div styleName="no-enrollments">
        <Heading size="h1" as="h3">
          {__('Welcome!')}
        </Heading>
        <p>
          {__(
            `It's looking a bit empty right now, we know.  But this is where you'll find <strong>your applications</strong>, as well as all the free courses and Nanodegrees that you're part of when you sign up.`,
            { renderHTML: true }
          )}
        </p>
        <Heading size="h5" as="h3">
          {__('Our Top <%= count %> Programs', { count })}
        </Heading>
        <ol>
          {_.map(popularPrograms['en-us'], (enrollment) => {
            const {
              title,
              summary,
              semantic_type,
              key,
              version,
              path,
            } = enrollment;

            return (
              <Card
                key={key + version}
                title={title}
                summary={summary}
                type={semantic_type}
                isGraduated={false}
                isPromo={true}
                showColorScheme={false}
                renderButton={this._renderButton}
                path={path}
              />
            );
          })}
        </ol>
      </div>
    );
  }
}
